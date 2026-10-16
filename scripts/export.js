// Generates a browser-importable HTML bookmarks file and a CSV from data/links.json.
// Usage: node scripts/export.js [outDir]   (default: _site/export)
const fs = require('fs');
const path = require('path');

const out = path.resolve(process.argv[2] || path.join(__dirname, '..', '_site', 'export'));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'links.json'), 'utf8'));
fs.mkdirSync(out, { recursive: true });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Brussels Mobility Link Library</H1>\n<DL><p>\n';
for (const s of data.sections) {
  html += `  <DT><H3>${esc(s.title)}</H3>\n  <DL><p>\n`;
  for (const u of s.subsections) {
    if (!u.links.length) continue;
    html += `    <DT><H3>${esc(u.title)}</H3>\n    <DL><p>\n`;
    for (const l of u.links) html += `      <DT><A HREF="${esc(l.url)}">${esc(l.title)}</A>\n`;
    html += '    </DL><p>\n';
  }
  html += '  </DL><p>\n';
}
html += '</DL><p>\n';
fs.writeFileSync(path.join(out, 'bookmarks.html'), html);

const csv = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
const cols = ['section', 'subsection', 'url', 'title', 'title_nl', 'title_fr', 'description', 'description_nl', 'description_fr', 'type', 'feed', 'verified', 'verifiedOn', 'status', 'lastChecked'];
const rows = [cols.join(',')];
for (const s of data.sections) for (const u of s.subsections) for (const l of u.links)
  rows.push([s.title, u.title, l.url, l.title, l.title_nl, l.title_fr, l.description, l.description_nl, l.description_fr, l.type, l.feed, l.verified === true, l.verifiedOn, l.status, l.lastChecked].map(csv).join(','));
fs.writeFileSync(path.join(out, 'links.csv'), '﻿' + rows.join('\n') + '\n');
console.log('exported to', out);
