const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3737;
const DATA_FILE = path.join(__dirname, 'data', 'links.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// GET all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// PUT full data (bulk save from client)
app.put('/api/data', (req, res) => {
  writeData(req.body);
  res.json({ ok: true });
});

// POST add section
app.post('/api/sections', (req, res) => {
  const data = readData();
  const section = { id: uid(), title: req.body.title || 'New Section', subsections: [] };
  data.sections.push(section);
  writeData(data);
  res.json(section);
});

// PUT rename section
app.put('/api/sections/:sectionId', (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });
  sec.title = req.body.title;
  writeData(data);
  res.json(sec);
});

// DELETE section
app.delete('/api/sections/:sectionId', (req, res) => {
  const data = readData();
  data.sections = data.sections.filter(s => s.id !== req.params.sectionId);
  writeData(data);
  res.json({ ok: true });
});

// POST add subsection
app.post('/api/sections/:sectionId/subsections', (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });
  const sub = { id: uid(), title: req.body.title || 'New Subsection', links: [] };
  sec.subsections.push(sub);
  writeData(data);
  res.json(sub);
});

// PUT rename subsection
app.put('/api/sections/:sectionId/subsections/:subId', (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });
  const sub = sec.subsections.find(s => s.id === req.params.subId);
  if (!sub) return res.status(404).json({ error: 'not found' });
  sub.title = req.body.title;
  writeData(data);
  res.json(sub);
});

// DELETE subsection
app.delete('/api/sections/:sectionId/subsections/:subId', (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });
  sec.subsections = sec.subsections.filter(s => s.id !== req.params.subId);
  writeData(data);
  res.json({ ok: true });
});

// POST add link to subsection
app.post('/api/sections/:sectionId/subsections/:subId/links', (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });
  const sub = sec.subsections.find(s => s.id === req.params.subId);
  if (!sub) return res.status(404).json({ error: 'not found' });
  const link = {
    id: uid(),
    url: req.body.url || '',
    title: req.body.title || req.body.url || '',
    description: req.body.description || '',
    lastChecked: null,
    status: 'unknown',
    comment: '',
    order: sub.links.length
  };
  sub.links.push(link);
  writeData(data);
  res.json(link);
});

// PUT update link
app.put('/api/links/:linkId', (req, res) => {
  const data = readData();
  for (const sec of data.sections) {
    for (const sub of sec.subsections) {
      const link = sub.links.find(l => l.id === req.params.linkId);
      if (link) {
        Object.assign(link, req.body);
        writeData(data);
        return res.json(link);
      }
    }
  }
  res.status(404).json({ error: 'not found' });
});

// DELETE link
app.delete('/api/links/:linkId', (req, res) => {
  const data = readData();
  for (const sec of data.sections) {
    for (const sub of sec.subsections) {
      const idx = sub.links.findIndex(l => l.id === req.params.linkId);
      if (idx !== -1) {
        sub.links.splice(idx, 1);
        writeData(data);
        return res.json({ ok: true });
      }
    }
  }
  res.status(404).json({ error: 'not found' });
});

// POST move link to different subsection
app.post('/api/links/:linkId/move', (req, res) => {
  const data = readData();
  const { targetSectionId, targetSubId, targetIndex } = req.body;
  let movedLink = null;

  for (const sec of data.sections) {
    for (const sub of sec.subsections) {
      const idx = sub.links.findIndex(l => l.id === req.params.linkId);
      if (idx !== -1) {
        movedLink = sub.links.splice(idx, 1)[0];
        break;
      }
    }
    if (movedLink) break;
  }
  if (!movedLink) return res.status(404).json({ error: 'not found' });

  const targetSec = data.sections.find(s => s.id === targetSectionId);
  if (!targetSec) return res.status(404).json({ error: 'target section not found' });
  const targetSub = targetSec.subsections.find(s => s.id === targetSubId);
  if (!targetSub) return res.status(404).json({ error: 'target subsection not found' });

  const insertAt = (targetIndex !== undefined) ? targetIndex : targetSub.links.length;
  targetSub.links.splice(insertAt, 0, movedLink);
  writeData(data);
  res.json({ ok: true });
});

// POST check link status (HEAD request to URL)
app.post('/api/links/:linkId/check', async (req, res) => {
  const data = readData();
  for (const sec of data.sections) {
    for (const sub of sec.subsections) {
      const link = sub.links.find(l => l.id === req.params.linkId);
      if (link) {
        try {
          const response = await fetch(link.url, {
            method: 'HEAD',
            timeout: 10000,
            headers: { 'User-Agent': 'LinkLib/1.0' }
          });
          link.status = response.ok ? 'ok' : (response.status === 404 ? '404' : `${response.status}`);
        } catch (e) {
          link.status = 'error';
        }
        link.lastChecked = new Date().toISOString();
        writeData(data);
        return res.json({ status: link.status, lastChecked: link.lastChecked });
      }
    }
  }
  res.status(404).json({ error: 'not found' });
});

// POST check ALL links in a section (batch)
app.post('/api/sections/:sectionId/checkall', async (req, res) => {
  const data = readData();
  const sec = data.sections.find(s => s.id === req.params.sectionId);
  if (!sec) return res.status(404).json({ error: 'not found' });

  const results = [];
  for (const sub of sec.subsections) {
    for (const link of sub.links) {
      try {
        const response = await fetch(link.url, {
          method: 'HEAD',
          timeout: 8000,
          headers: { 'User-Agent': 'LinkLib/1.0' }
        });
        link.status = response.ok ? 'ok' : (response.status === 404 ? '404' : `${response.status}`);
      } catch (e) {
        link.status = 'error';
      }
      link.lastChecked = new Date().toISOString();
      results.push({ id: link.id, status: link.status });
    }
  }
  writeData(data);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`LinkLib running at http://localhost:${PORT}`);
});
