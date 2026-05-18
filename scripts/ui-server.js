'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const PORT = 3939;
const ROOT = path.resolve(__dirname, '..');
const HTML = fs.readFileSync(path.join(__dirname, 'ui.html'), 'utf8');

// ─── Parse spec files for describe / it hierarchy ────────────────────────────

function parseSpecFile(specPath) {
    let content;
    try { content = fs.readFileSync(path.join(ROOT, specPath), 'utf8'); }
    catch (_) { return []; }

    const root = { describes: [] };
    const stack = [root];
    let depth = 0;
    const descDepths = [];

    for (const line of content.split('\n')) {
        const opens  = (line.match(/{/g)  || []).length;
        const closes = (line.match(/}/g) || []).length;

        const dm = line.match(/^\s*describe\s*\(\s*['"`](.+?)['"`]/);
        if (dm) {
            const node = { name: dm[1], tests: [], describes: [] };
            stack[stack.length - 1].describes.push(node);
            stack.push(node);
            depth += opens - closes;
            descDepths.push(depth);
            continue;
        }

        depth += opens - closes;
        while (descDepths.length > 0 && depth < descDepths[descDepths.length - 1]) {
            stack.pop();
            descDepths.pop();
        }

        const im = line.match(/^\s*it(?:\.[a-z]+)?\s*\(\s*['"`](TC_[A-Z]+_\d+[:\s].+?)['"`]/);
        if (im && stack.length > 1) {
            const m2 = im[1].match(/^(TC_[A-Z]+_\d+)[:\s]*(.*)/);
            if (m2) stack[stack.length - 1].tests.push({ id: m2[1], label: m2[2].trim() });
        }
    }

    return root.describes;
}

// ─── Spec file map — update this when adding new spec files ──────────────────
// Each key is the suite label shown in the UI; value is the spec file path.

const SPEC_FILES = {
    Login: 'test/e2e/login.e2e.js',
    CWO:   'test/e2e/cwo.e2e.js',
    PPM:   'test/e2e/ppm.e2e.js',
};

const SUITES = {};
Object.keys(SPEC_FILES).forEach(function (name) {
    SUITES[name] = { spec: SPEC_FILES[name], describes: parseSpecFile(SPEC_FILES[name]) };
});

let activeRun = null;
let _tmpSpec  = null;

// Write a temp wrapper spec that patches it/it.skip before requiring the real spec.
// This runs at spec-file load time when global.it is already available.
function buildTmpSpec(specPath, tests) {
    const absSpec    = path.join(ROOT, specPath).replace(/\\/g, '\\\\');
    const targetJson = JSON.stringify(tests);
    const src = [
        "'use strict';",
        "var __tcs  = " + targetJson + ";",
        "var __orig = global.it;",
        "function __match(t) {",
        "    return __tcs.some(function(tc) {",
        "        return t === tc || t.indexOf(tc + ':') === 0 || t.indexOf(tc + ' ') === 0;",
        "    });",
        "}",
        "global.it      = function(t, fn) { return __match(t) ? __orig(t, fn) : __orig(t); };",
        "global.it.skip = function(t, fn) { return __match(t) ? __orig(t, fn) : __orig(t); };",
        "global.it.only = __orig.only;",
        "require('" + absSpec + "');",
        "global.it = __orig;",
    ].join('\n');
    const p = path.join(ROOT, '.wdio_ui_tmp.js');
    fs.writeFileSync(p, src);
    return p;
}

function cleanTmp() {
    if (_tmpSpec) { try { fs.unlinkSync(_tmpSpec); } catch (e) {} _tmpSpec = null; }
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

const server = http.createServer(function (req, res) {
    const url = new URL(req.url, 'http://x');
    const { method } = req;
    const { pathname } = url;

    if (method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HTML);
        return;
    }

    if (method === 'GET' && pathname === '/api/suites') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(SUITES));
        return;
    }

    if (method === 'GET' && pathname === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ running: !!(activeRun && !activeRun.done) }));
        return;
    }

    if (method === 'POST' && pathname === '/api/run') {
        if (activeRun && !activeRun.done) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'A run is already in progress' }));
            return;
        }

        readBody(req).then(function (body) {
            const { suite, tests } = JSON.parse(body);
            const args       = buildArgs(suite, tests);
            const cmdDisplay = 'npx wdio ' + args.join(' ');

            // Run wdio directly via node — no shell means ( | ) are never
            // interpreted by cmd.exe, so grep patterns work on Windows too.
            const wdioBin = path.join(ROOT, 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');

            activeRun = {
                proc: null,
                clients: new Set(),
                buffer: ['\x1b[90m$ ' + cmdDisplay + '\x1b[0m\n\n'],
                done: false,
                exitCode: null,
            };

            const proc = spawn(process.execPath, [wdioBin].concat(args), {
                cwd: ROOT,
                shell: false,
                env: Object.assign({}, process.env, { FORCE_COLOR: '1', COLORTERM: 'truecolor' }),
            });

            activeRun.proc = proc;

            proc.stdout.on('data', function (c) { pushOutput(c.toString()); });
            proc.stderr.on('data', function (c) { pushOutput(c.toString()); });

            proc.on('close', function (code) {
                cleanTmp();
                if (!activeRun) return;
                activeRun.done = true;
                activeRun.exitCode = code;
                broadcast({ type: 'done', code: code });
                // Give clients 3 s to receive 'done' before force-closing
                setTimeout(function () {
                    if (!activeRun) return;
                    activeRun.clients.forEach(function (c) { try { c.end(); } catch (e) {} });
                    activeRun.clients.clear();
                }, 3000);
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
        }).catch(function (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
        return;
    }

    if (method === 'GET' && pathname === '/api/stream') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        res.flushHeaders();

        if (!activeRun || activeRun.done) {
            res.write('data: ' + JSON.stringify({ type: 'idle' }) + '\n\n');
            res.end();
            return;
        }

        activeRun.buffer.forEach(function (chunk) {
            res.write('data: ' + JSON.stringify({ type: 'out', text: chunk }) + '\n\n');
        });

        activeRun.clients.add(res);
        req.on('close', function () {
            if (activeRun) activeRun.clients.delete(res);
        });
        return;
    }

    if (method === 'POST' && pathname === '/api/step') {
        readBody(req).then(function (body) {
            try {
                const data = JSON.parse(body);
                if (activeRun) broadcast({ type: 'step', data: data });
            } catch (_) {}
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
        }).catch(function () {
            res.writeHead(400);
            res.end();
        });
        return;
    }

    if (method === 'POST' && pathname === '/api/stop') {
        if (activeRun && !activeRun.done && activeRun.proc) {
            killProc(activeRun.proc);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pushOutput(text) {
    if (!activeRun) return;
    activeRun.buffer.push(text);
    broadcast({ type: 'out', text: text });
}

function broadcast(msg) {
    if (!activeRun) return;
    const line = 'data: ' + JSON.stringify(msg) + '\n\n';
    activeRun.clients.forEach(function (client) {
        try { client.write(line); } catch (e) {}
    });
}

function buildArgs(suite, tests) {
    cleanTmp();
    const base = ['run', 'wdio.conf.js'];
    if (!suite || suite === 'all') return base;

    const s = SUITES[suite];
    if (!s) return base;

    if (!tests || tests.length === 0) return base.concat(['--spec', s.spec]);

    _tmpSpec = buildTmpSpec(s.spec, tests);
    return base.concat(['--spec', _tmpSpec]);
}

function readBody(req) {
    return new Promise(function (resolve, reject) {
        let data = '';
        req.on('data', function (c) { data += c; });
        req.on('end', function () { resolve(data); });
        req.on('error', reject);
    });
}

function killProc(proc) {
    if (process.platform === 'win32') {
        try { execSync('taskkill /F /T /PID ' + proc.pid, { stdio: 'ignore' }); } catch (e) {}
    } else {
        try { proc.kill('SIGTERM'); } catch (e) {}
    }
}

// ─── SSE heartbeat — keeps connections alive during long Appium runs ──────────

setInterval(function () {
    if (!activeRun || activeRun.done) return;
    activeRun.clients.forEach(function (client) {
        try { client.write(': heartbeat\n\n'); } catch (e) {}
    });
}, 20000);

// ─── Start ───────────────────────────────────────────────────────────────────

server.listen(PORT, '127.0.0.1', function () {
    const url = 'http://localhost:' + PORT;
    console.log('\n  Appium Test Runner\n');
    console.log('  ' + url + '\n');
    console.log('  Press Ctrl+C to stop\n');

    const openCmd = process.platform === 'win32' ? 'start ' + url
        : process.platform === 'darwin' ? 'open ' + url
        : 'xdg-open ' + url;

    require('child_process').exec(openCmd);
});

process.on('SIGINT', function () {
    cleanTmp();
    if (activeRun && !activeRun.done && activeRun.proc) killProc(activeRun.proc);
    process.exit(0);
});
