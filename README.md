# Brussels Mobility Link Library

Public, curated directory of official sources on **road mobility** (cars, logistics, parking) in Brussels, Belgium and Europe: institutions, road operators, open-data portals, professional organisations, European bodies and studies. Interface and link descriptions are available in **Dutch, French and English**.

> **AANNAME / ASSUMPTION:** link descriptions were written from general knowledge and have not been verified against the sites. Every link shows this label until `"verified": true` is set. The weekly check only tests that a link is reachable, not that its description is right.

## How it works

- `data/links.json` is the **single source of truth** (plain JSON, easy to diff and back up).
- `public/` is a static site: it reads `data/links.json` and needs no server. When opened through the local app (`server.js`) it also allows editing.
- Per link: `title`, `description` (English) and optional `title_nl`, `title_fr`, `description_nl`, `description_fr`. A link without a translation shows the English text.
- `public/config.json` holds the site title, subtitle and default language (so another city can fork and rename the list).

## Run locally (Windows)

Editing, with the app:

```
npm install
npm start
```

Open http://localhost:3737. Changes are written to `data/links.json`.

Read-only static preview:

```
node scripts/build.js
```

then serve the `_site` folder with any static server (for example `python -m http.server 8099` inside `_site`).

## Publish (GitHub Pages)

The workflow `.github/workflows/site.yml` builds `_site` (site + `export/bookmarks.html` + `export/links.csv`) and deploys it to GitHub Pages on every push to `main`. One-time setting: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Weekly check

The same workflow runs every **Wednesday 06:00 UTC** (and on demand via *Actions → Check links and publish site → Run workflow*):

1. checks every link, updates `status` and `lastChecked` in `data/links.json` and commits it;
2. opens (or updates) an issue labelled `dead-links` for links that return 404/410 or cannot be reached. A 403 means the site blocks automatic checks and is not treated as dead;
3. rebuilds and publishes the site.

Switch it off: *Actions → Check links and publish site → ⋯ → Disable workflow*, or delete the `schedule:` block in the workflow. Without it the site is still published on every push.

## Keeping a local copy in sync

Edit locally and push, or let the weekly workflow change the data on GitHub: both go through `main`. A local copy updates itself with `git pull --rebase --autostash` before it pushes (the maintainer's PC does this every Thursday, after the Wednesday check).

## Export

`node scripts/export.js` writes `bookmarks.html` (importable in any browser) and `links.csv` from `data/links.json`.

## Reuse by another city

Fork the repository, edit `public/config.json` (title, subtitle, language), replace `data/links.json` with your own sections and links, enable Pages. Nothing else needs to change.

## Rules

Public sources only. No personal bookmarks, no camera or traffic-count data, no credentials. See `CLAUDE.md`.

## Not tested

See the list at the end of `opdracht.md`.
