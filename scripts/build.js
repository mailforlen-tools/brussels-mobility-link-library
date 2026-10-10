// Assembles the static site into _site/: public/ + data/links.json + export files. No dependencies.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const site = path.join(root, '_site');
fs.rmSync(site, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), site, { recursive: true });
fs.mkdirSync(path.join(site, 'data'), { recursive: true });
fs.copyFileSync(path.join(root, 'data', 'links.json'), path.join(site, 'data', 'links.json'));
execFileSync(process.execPath, [path.join(__dirname, 'export.js'), path.join(site, 'export')], { stdio: 'inherit' });
console.log('site built in', site);
