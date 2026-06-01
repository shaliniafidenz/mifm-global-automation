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
    Login:      'test/e2e/login.e2e.js',
    CWO:        'test/e2e/cwo.e2e.js',
    'CWO Filter': 'test/e2e/cwo.filter.e2e.js',
    PPM:        'test/e2e/ppm.e2e.js',
};

const SUITES = {};
Object.keys(SPEC_FILES).forEach(function (name) {
    SUITES[name] = { spec: SPEC_FILES[name], describes: parseSpecFile(SPEC_FILES[name]) };
});

let activeRun       = null;
let _tmpSpec        = null;
let reportGenerating = false;

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
        "global.it      = function(t, fn) { return __match(t) ? __orig(t, fn) : void 0; };",
        "global.it.skip = function(t, fn) { return __match(t) ? __orig(t, fn) : void 0; };",
        "global.it.only = __orig.only;",
        "require('" + absSpec + "');",
        "global.it = __orig;",
    ].join('\n');
    const p = path.join(ROOT, '.wdio_ui_tmp.js');
    fs.writeFileSync(p, src);
    return p;
}

// Write a temp wrapper spec that un-skips ALL tests across the given spec files.
// Used for "run suite" and "run all" so it.skip tests appear in Allure as executed.
function buildTmpSpecUnrestricted(specPaths) {
    const lines = [
        "'use strict';",
        "var __orig = global.it;",
        "global.it      = function(t, fn) { return fn ? __orig(t, fn) : __orig(t); };",
        "global.it.skip = function(t, fn) { return fn ? __orig(t, fn) : __orig(t); };",
        "global.it.only = __orig.only;",
    ];
    specPaths.forEach(function (specPath) {
        lines.push("require('" + path.join(ROOT, specPath).replace(/\\/g, '\\\\') + "');");
    });
    lines.push("global.it = __orig;");
    const p = path.join(ROOT, '.wdio_ui_tmp.js');
    fs.writeFileSync(p, lines.join('\n'));
    return p;
}

function cleanTmp() {
    if (_tmpSpec) { try { fs.unlinkSync(_tmpSpec); } catch (e) {} _tmpSpec = null; }
}

function getDevices() {
    const list = [];
    try {
        const out = execSync('adb devices', { encoding: 'utf8', timeout: 5000 });
        for (const line of out.split('\n').slice(1)) {
            const m = line.match(/^(\S+)\s+device\s*$/);
            if (!m) continue;
            const id = m[1];
            let model = id, version = '';
            try { model   = execSync('adb -s ' + id + ' shell getprop ro.product.model',         { encoding: 'utf8', timeout: 3000 }).trim(); } catch (_) {}
            try { version = execSync('adb -s ' + id + ' shell getprop ro.build.version.release', { encoding: 'utf8', timeout: 3000 }).trim(); } catch (_) {}
            list.push({ id, model, version });
        }
    } catch (_) {}
    return list;
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
        res.end(JSON.stringify({ suites: SUITES, groups: {} }));
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
            const { suite, tests, devices } = JSON.parse(body);
            const args       = buildArgs(suite, tests);
            const cmdDisplay = 'npx wdio ' + args.join(' ');

            const deviceList = (Array.isArray(devices) && devices.length > 0) ? devices : [null];

            activeRun = {
                proc: null,
                clients: new Set(),
                buffer: ['\x1b[90m$ ' + cmdDisplay + '\x1b[0m\n\n'],
                done: false,
                exitCode: null,
                deviceQueue: deviceList.slice(1),
                overallExitCode: 0,
                runArgs: args,
            };

            spawnForDevice(deviceList[0], args);

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

    if (method === 'GET' && pathname === '/api/devices') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getDevices()));
        return;
    }

    if (method === 'POST' && pathname === '/api/stop') {
        if (activeRun && !activeRun.done && activeRun.proc) {
            activeRun.deviceQueue = [];
            killProc(activeRun.proc);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
        return;
    }

    if (method === 'POST' && pathname === '/api/clean-results') {
        if (activeRun && !activeRun.done) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Cannot clean while a run is in progress' }));
            return;
        }
        try {
            execSync('npm run clean-allure', { cwd: ROOT, shell: true, stdio: 'ignore' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'POST' && pathname === '/api/report') {
        if (reportGenerating) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Report generation already in progress' }));
            return;
        }
        const resultsDir = path.join(ROOT, 'reports', 'allure-results');
        const hasResults = fs.existsSync(resultsDir) &&
            fs.readdirSync(resultsDir).some(function (f) { return f.endsWith('.json') || f.endsWith('.xml'); });
        if (!hasResults) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No test results found. Run some tests first.' }));
            return;
        }
        reportGenerating = true;
        const rproc = spawn('npm', ['run', 'allure-generate'], { cwd: ROOT, shell: true });
        let rOut = '';
        rproc.stdout.on('data', function (d) { rOut += d; });
        rproc.stderr.on('data', function (d) { rOut += d; });
        rproc.on('error', function (err) {
            reportGenerating = false;
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        });
        rproc.on('close', function (code) {
            reportGenerating = false;
            if (code !== 0) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: rOut.trim() || 'allure generate failed (exit ' + code + ')' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, url: '/report/' }));
            }
        });
        return;
    }

    if (method === 'GET' && (pathname === '/report' || pathname.startsWith('/report/'))) {
        const MIME_MAP = {
            '.html': 'text/html; charset=utf-8',
            '.js':   'application/javascript; charset=utf-8',
            '.css':  'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.png':  'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
            '.svg':  'image/svg+xml', '.ico': 'image/x-icon',
            '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
            '.xml':  'application/xml',
        };
        const rel   = pathname.slice('/report'.length) || '/index.html';
        const parts = rel.split('/').filter(function (p) { return p && p !== '..'; });
        let   serve = parts.length
            ? path.join(ROOT, 'reports', 'allure-report', parts.join(path.sep))
            : path.join(ROOT, 'reports', 'allure-report', 'index.html');
        if (!fs.existsSync(serve) || fs.statSync(serve).isDirectory()) {
            serve = path.join(ROOT, 'reports', 'allure-report', 'index.html');
        }
        if (!fs.existsSync(serve)) {
            res.writeHead(404);
            res.end('Report not generated yet. Click "View Report" in the test runner to generate it.');
            return;
        }
        const ext = path.extname(serve).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_MAP[ext] || 'application/octet-stream' });
        fs.createReadStream(serve).pipe(res);
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

function spawnForDevice(device, args) {
    const wdioBin = path.join(ROOT, 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');

    if (device) {
        const label = (device.model && device.model !== device.id)
            ? device.model + ' (' + device.id + ') · Android ' + device.version
            : device.id;
        pushOutput('\x1b[90m\n▶ Device: ' + label + '\x1b[0m\n\n');
    }

    const extraEnv = device ? { DEVICE_NAME: device.id, PLATFORM_VERSION: device.version } : {};

    const proc = spawn(process.execPath, [wdioBin].concat(args), {
        cwd: ROOT,
        shell: false,
        env: Object.assign({}, process.env, { FORCE_COLOR: '1', COLORTERM: 'truecolor' }, extraEnv),
    });

    activeRun.proc = proc;
    proc.stdout.on('data', function (c) { pushOutput(c.toString()); });
    proc.stderr.on('data', function (c) { pushOutput(c.toString()); });

    proc.on('close', function (code) {
        if (code) activeRun.overallExitCode = code;

        if (activeRun.deviceQueue && activeRun.deviceQueue.length > 0) {
            const next = activeRun.deviceQueue.shift();
            spawnForDevice(next, activeRun.runArgs);
            return;
        }

        cleanTmp();
        if (!activeRun) return;
        activeRun.done = true;
        activeRun.exitCode = activeRun.overallExitCode;
        broadcast({ type: 'done', code: activeRun.overallExitCode });
        setTimeout(function () {
            if (!activeRun) return;
            activeRun.clients.forEach(function (c) { try { c.end(); } catch (e) {} });
            activeRun.clients.clear();
        }, 3000);
    });
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

    if (!suite || suite === 'all') {
        _tmpSpec = buildTmpSpecUnrestricted(Object.values(SPEC_FILES));
        return base.concat(['--spec', _tmpSpec]);
    }

    const s = SUITES[suite];
    if (!s) return base;

    if (!tests || tests.length === 0) {
        _tmpSpec = buildTmpSpecUnrestricted([s.spec]);
        return base.concat(['--spec', _tmpSpec]);
    }

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
