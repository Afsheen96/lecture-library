// Checks lectures.json for mistakes before you publish.
// Run from the website folder:  node tools/check-lectures.js
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "lectures.json");
const CATEGORIES = ["AI & Automation", "Freelancing", "Web & App Development", "Digital Marketing"];

function normalizeUrl(url) {
  let u = String(url).trim().toLowerCase().replace(/#.*$/, "");
  const v = u.match(/[?&]v=([^&]+)/);
  u = u.replace(/^https?:\/\/(www\.|m\.|web\.)?/, "").replace(/\?.*$/, "").replace(/\/+$/, "");
  return v ? u + "?v=" + v[1] : u;
}

let lectures;
try {
  lectures = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  console.error("❌ lectures.json is not valid JSON: " + e.message);
  console.error("   Check for a missing comma, quote or bracket.");
  process.exit(1);
}
if (!Array.isArray(lectures)) {
  console.error("❌ lectures.json must be a list that starts with [ and ends with ].");
  process.exit(1);
}

const errors = [];
const numbers = new Map();
const urls = new Map();

lectures.forEach((l, i) => {
  const where = `Entry ${i + 1}` + (l && l.number !== undefined ? ` (lecture ${l.number})` : "");
  if (!l || typeof l !== "object") return errors.push(`${where}: is not a lecture object.`);
  const extra = Object.keys(l).filter(k => !["number", "title", "category", "url"].includes(k));
  if (extra.length) errors.push(`${where}: unknown field(s) ${extra.join(", ")}.`);
  if (!Number.isInteger(l.number) || l.number < 1) errors.push(`${where}: "number" must be a whole number like 9 (no quotes).`);
  if (!l.title || typeof l.title !== "string") errors.push(`${where}: "title" is missing.`);
  if (!CATEGORIES.includes(l.category)) errors.push(`${where}: "category" must be one of: ${CATEGORIES.join(" | ")}.`);
  if (!/^https:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch)\//i.test(l.url || "")) {
    errors.push(`${where}: "url" must be a Facebook link starting with https://www.facebook.com/ or https://fb.watch/.`);
  }
  if (numbers.has(l.number)) errors.push(`${where}: lecture number ${l.number} is already used by entry ${numbers.get(l.number)}.`);
  else numbers.set(l.number, i + 1);
  const key = normalizeUrl(l.url || "");
  if (urls.has(key)) errors.push(`${where}: this Facebook link is already used by entry ${urls.get(key)}.`);
  else urls.set(key, i + 1);
});

if (errors.length) {
  console.error(`❌ Found ${errors.length} problem(s) in lectures.json:\n`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
const sorted = [...lectures].sort((a, b) => a.number - b.number).map(l => l.number);
console.log(`✅ lectures.json looks good: ${lectures.length} lecture(s).`);
if (sorted.length) console.log(`   Lecture numbers: ${sorted.join(", ")}`);
