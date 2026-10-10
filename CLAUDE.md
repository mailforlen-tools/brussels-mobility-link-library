# Brussels Mobility Link Library

Public, curated directory of Brussels / Belgian / European mobility data sources (Yahoo-style: sections, subsections, link status, notes).
Existing code: small Express app (`server.js`, `public/index.html`, data in `data/links.json`). Read `README.md` first.

## Rules (always)
- This repo is PUBLIC. Only public sources and generated files. No camera IDs, addresses, coordinates of cameras, ANPR data, credentials, tokens, `.env` files, or local paths.
- No Chinese or Russian sources / content.
- Windows is the only target for local use; the published site must work in any browser.
- Do not add dependencies without a reason; prefer a static site with no build step.
- Keep `data/links.json` as the single source of truth (plain JSON, easy to diff and back up).
- Write notes on what is verified versus assumed: mark unverified claims `AANNAME`.

## Task
See `opdracht.md`.
