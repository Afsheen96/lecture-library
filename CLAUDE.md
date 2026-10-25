# Rules for Claude Code in this project

Static lecture directory (HTML, CSS, JS) hosted on GitHub Pages at
https://afsheen96.github.io/lecture-library/

`lectures.json` is the single source of truth. `tools/build.js` reads it and writes the
lecture list, structured data and analytics tags into `index.html`, plus `sitemap.xml`.
The GitHub Actions workflow runs the same build on every push to `main` and deploys the site.

## Adding lectures
1. Edit only `lectures.json`. Do not change the design (`style.css`, `assets/`) or the text outside the generated blocks in `index.html`.
2. Each lecture has exactly 4 fields: `number` (whole number, no quotes), `title`, `category`, `url`.
3. `category` must be exactly one of: `AI & Automation`, `Freelancing`, `Web & App Development`, `Digital Marketing`.
   If the owner's category is unclear, ask instead of guessing.
4. `url` must be the exact original Facebook link the owner gave (facebook.com or fb.watch). Never shorten, guess, download or rehost videos.
5. Never change or remove existing lectures unless the owner clearly asks.
6. Do not add a lecture whose number or Facebook link already exists. Tell the owner instead.
7. Keep the file sorted by lecture number.
8. Run `node tools/build.js`. It stops with a clear message if anything is wrong; fix it and run again.
9. Commit `lectures.json`, `index.html` and `sitemap.xml` with a message like `Add lectures 9-10` and push to `main`.

## Never hand-edit
The blocks between `<!-- HEAD:START -->`, `<!-- LECTURES:START -->`, `<!-- COUNT:START -->` and `<!-- UPDATED:START -->`
markers in `index.html`, and `sitemap.xml`. They are overwritten by the build.

## Analytics and Search Console
`site.config.json` holds the GA4 Measurement ID and the Search Console verification code.
Only fill them with values the owner provides. Never invent them.
