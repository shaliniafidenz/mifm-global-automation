'use strict';
const path = require('path');
const { existsSync } = require('fs');
const { execSync } = require('child_process');

const file = path.resolve(__dirname, '../reports/html-reports/report.html');

if (!existsSync(file)) {
    console.error('\n  No report found. Run tests first:\n  npm test\n');
    process.exit(1);
}

console.log(`\n  Opening: ${file}\n`);
execSync(`start "" "${file}"`, { shell: true });
