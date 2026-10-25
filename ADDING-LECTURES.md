# How to add new lectures (daily guide)

All your lectures are in one file: **`lectures.json`**.
You never need to touch the design files.

---

## The easiest way: ask Claude Code

Open Claude Code in your website's GitHub repository and paste a message like this:

```
Add these lectures to lectures.json, check them, then commit and push:

9 | Finding Clients on Facebook Groups | Freelancing | https://www.facebook.com/watch/?v=1234567890
10 | ChatGPT Prompts for Proposals | AI & Automation | https://fb.watch/abcd123/
```

That's it. One line per lecture: **number | title | category | Facebook link**.
You can send one lecture or ten at once.

The `CLAUDE.md` file in this folder tells Claude Code the rules automatically, so it will:
- add the lectures in the right format,
- refuse duplicate lecture numbers or duplicate Facebook links,
- leave your existing lectures untouched,
- run the checker (`node tools/check-lectures.js`),
- commit and push so the live site updates.

**Categories** (write one of these exactly):
- AI & Automation
- Freelancing
- Web & App Development
- Digital Marketing

**Which Facebook link to use:** open the lecture on Facebook, click **Share → Copy link**, and paste that link.

---

## Doing it by hand (optional)

Open `lectures.json` on GitHub (click the file, then the ✏️ pencil icon).
Each lecture looks like this:

```json
{ "number": 9, "title": "Finding Clients on Facebook Groups", "category": "Freelancing", "url": "https://www.facebook.com/watch/?v=1234567890" }
```

Rules:
- Put a **comma** between lectures, but **not** after the last one.
- `number` has no quotes. Everything else has "double quotes".
- The order in the file doesn't matter. The website always sorts lectures by number.

Then click **Commit changes**.

---

## Important: when will visitors see the new lectures?

Your website runs on **GitHub Pages**. Editing `lectures.json` on your computer, or in Claude Code, does **not** change the live website by itself.

New lectures appear online only after the change is:
1. **committed** (saved into your GitHub repository), and
2. **pushed** to the `main` branch.

GitHub Pages then redeploys automatically, usually in **1 to 2 minutes**.
If you still see old lectures, refresh the page (or press Ctrl + Shift + R).

You can watch the deploy in your repository under the **Actions** tab. A green tick means it's live.

---

## Safety nets built in

- **Duplicates:** the checker blocks duplicate numbers and links. If one slips through, the website shows only the first one.
- **Order:** lectures always display in number order, even if added out of order.
- **Search and filters:** every new lecture works with the search bar and category buttons automatically.
- **No public "Add Lecture" button:** a button on the website could not save lectures permanently or safely, so updates go through GitHub only. Nobody else can change your list.
