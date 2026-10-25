# Rules for Claude Code in this project

This is a static lecture library website (HTML, CSS, JS) hosted on GitHub Pages.
All lectures live in `lectures.json`. When the owner asks to add lectures:

1. Edit only `lectures.json`. Do not change the design (`index.html`, `style.css`, `script.js`, `assets/`).
2. Each lecture has exactly 4 fields: `number` (whole number, no quotes), `title`, `category`, `url`.
3. `category` must be exactly one of: `AI & Automation`, `Freelancing`, `Web & App Development`, `Digital Marketing`.
   If the owner's category is unclear, ask instead of guessing.
4. `url` must be the original Facebook link (facebook.com or fb.watch). Never download or rehost videos.
5. Never change or remove existing lectures unless the owner clearly asks.
6. Do not add a lecture whose number or Facebook link already exists. Tell the owner instead.
7. Keep the file sorted by lecture number.
8. After editing, run `node tools/check-lectures.js` and fix any problem it reports.
9. Then commit with a message like `Add lectures 9-10` and push to the `main` branch so GitHub Pages redeploys.
