# Learn Freelancing AI — Lecture Library

A simple page where students can search and open lecture links.
Independent student resource. Not an official website of Sir Hisham Sarwar.

Live site: https://afsheen96.github.io/lecture-library/

## Files
- `lectures.json` — **your lecture list (the only file you need to edit)**
- `index.html` — the page. The lecture list inside it is generated from lectures.json
- `style.css` — the design
- `script.js` — search, category filters and analytics events
- `site.config.json` — GA4 Measurement ID and Search Console verification code
- `sitemap.xml` — generated for Google Search Console
- `tools/build.js` — builds the page from lectures.json (`node tools/build.js`)
- `tools/check-lectures.js` — checks lectures.json only
- `.github/workflows/deploy.yml` — builds and publishes the site on every push
- `ADDING-LECTURES.md` — daily guide · `CLAUDE.md` — rules for Claude Code
- `assets/` — original cover photo, share thumbnail, favicon

## Add lectures
See **ADDING-LECTURES.md**.

## Publishing
GitHub Pages → Settings → Pages → Source: **GitHub Actions**. Every push to `main` builds and deploys automatically.
