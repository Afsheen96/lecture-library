# Learn Freelancing AI — Lecture Library

A simple page where students can search and open lecture links.
Independent student resource. Not an official website of Sir Hisham Sarwar.

## Files
- `index.html` — the page
- `style.css` — the design
- `script.js` — search and category filters
- `lectures.json` — **your lecture list (the only file you need to edit)**
- `ADDING-LECTURES.md` — daily guide for adding lectures
- `tools/check-lectures.js` — checks lectures.json for mistakes and duplicates
- `CLAUDE.md` — rules Claude Code follows when it edits your lectures
- `assets/cover.jpg` — your original cover photo (add it here)

## Add lectures
See **ADDING-LECTURES.md**. Short version: tell Claude Code
`Add lecture 9 | Title | Freelancing | https://www.facebook.com/... then commit and push`.

Note: the page loads `lectures.json`, so opening `index.html` by double-click shows a notice instead of lectures. View it on GitHub Pages, or run `npx serve` in this folder.

## Put it online with GitHub Pages
1. Create a new public repository on GitHub (for example `lecture-library`).
2. Click **Add file → Upload files** and upload everything in this folder (keep the `assets` folder).
3. Go to **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and Save.
4. After about a minute your site is live at `https://YOUR-USERNAME.github.io/lecture-library/`.
