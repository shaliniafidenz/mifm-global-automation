'use strict';

// When the UI runner targets specific TCs, WDIO_TCS is a comma-separated list
// of TC IDs (e.g. "TC_CWO_001" or "TC_CWO_001,TC_CWO_002").
// This file is required by mochaOpts.require before spec files are loaded, so
// patching global it / it.skip here affects all subsequently registered tests.

const targetTcs = (process.env.WDIO_TCS || '')
    .split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);

if (targetTcs.length > 0) {
    const origIt   = global.it;

    function shouldRun(title) {
        return targetTcs.some(function (tc) {
            return title === tc || title.startsWith(tc + ':') || title.startsWith(tc + ' ');
        });
    }

    // Plain it(): run if it matches a target TC, otherwise force-skip it
    global.it = function (title, fn) {
        return shouldRun(title) ? origIt(title, fn) : origIt.skip(title, fn);
    };

    // it.skip(): run if it matches a target TC (override the skip), otherwise keep skipped
    global.it.skip = function (title, fn) {
        return shouldRun(title) ? origIt(title, fn) : origIt.skip(title, fn);
    };

    global.it.only = origIt.only;
}
