# Mobility Link Library

A lightweight bookmark manager organised like the early Yahoo directory — sections, subsections, link status checking, and scraping notes. Built for the Brussels Mobility Datamap project to track and annotate data sources.

## Start the server

Open a terminal in this folder (`linklib`) and run:

```
"C:\Program Files\nodejs\node.exe" server.js
```

Then open your browser at: **http://localhost:3737**

The server runs on port 3737. Keep the terminal open while using the app.

## Stop the server

Close the terminal window, or press `Ctrl+C` in it.

## Structure

```
linklib/
├── server.js          — Express backend (API + static file server)
├── package.json       — Node.js dependencies
├── data/
│   └── links.json     — All your links and notes (plain JSON, easy to back up)
└── public/
    └── index.html     — Single-page frontend (no build step)
```

## Sections

Five pre-built sections matching the Brussels Mobility Datamap scope:

| Section | Description |
|---|---|
| Europe | EU institutions, EU mobility & transport |
| Federal | Federal mobility, statistics & data |
| Brussels | Brussels Mobility, open data, STIB/MIVB |
| Vlaanderen | Departement Mobiliteit, open data |
| Wallonia | SPW Mobilité, open data |

You can rename, add, or delete any section or subsection from the interface.

## Features

### Links
- Add a link with URL, title, and description
- **⚡ Check** — sends a HEAD request to the URL and records: OK / 404 / error + date last checked
- **⚡ Check all links** — batch-checks every link in a section
- **✏️ Edit** — change URL, title, description
- **↗️ Move** — move a link to a different section/subsection
- **↑↓ Reorder** — move a link up or down within its subsection
- **🗑 Delete** — remove a link

### Notes / comment box
Each link has a collapsible notes field. Use it to record:
- Scraping observations (format, frequency, authentication needed…)
- Data quality remarks
- Contact info
- Why a URL went 404 and what replaced it

### Subsections
- Add a subsection to any section
- Rename a subsection in place
- Delete a subsection (confirms before deleting)

### Search
Type in the search box (top right) to search across all URLs, titles, descriptions, and notes.

## Backup

All data lives in `data/links.json`. Copy that file to back up your library. To restore, paste it back.

## Reinstall dependencies (after moving the folder)

```
"C:\Program Files\nodejs\npm.cmd" install
```

## Future ideas (not implemented yet)
- Import from Diigo CSV export
- Full-page archive (ArchiveBox integration) — download a local copy of a page
- Export to HTML bookmarks file
- Link to Raindrop.io / Linkwarden via API
