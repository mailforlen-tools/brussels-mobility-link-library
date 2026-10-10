// Weekly link check. No dependencies (Node 18+). Updates status + lastChecked in data/links.json
// and writes dead-links.md when links are really gone (404/410/unreachable).
// 403/429 = site blocks automatic checks: recorded, but not treated as dead.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'links.json');
const OUT = path.join(__dirname, '..', 'dead-links.md');
const UA = 'Mozilla/5.0 (compatible; BrusselsMobilityLinkLibrary-check/1.0)';
const PAUSE_MS = 1000;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': UA } });
      if (r.ok) return 'ok';
      if (method === 'GET' || ![403, 405, 501].includes(r.status)) return String(r.status);
    } catch (e) {
      if (method === 'GET') return 'error';
    }
  }
  return 'error';
}

(async () => {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const dead = [];
  const now = new Date().toISOString();
  for (const sec of data.sections) for (const sub of sec.subsections) for (const l of sub.links) {
    l.status = await probe(l.url);
    l.lastChecked = now;
    if (['404', '410', 'error'].includes(l.status)) dead.push(`- ${l.title} (${sec.title} › ${sub.title}): ${l.status} — ${l.url}`);
    await sleep(PAUSE_MS);
  }
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
  if (dead.length) fs.writeFileSync(OUT, `Dead or unreachable links on ${now.slice(0, 10)}:\n\n${dead.join('\n')}\n`);
  else if (fs.existsSync(OUT)) fs.unlinkSync(OUT);
  console.log(dead.length ? `${dead.length} dead links` : 'all links reachable');
})();
