// Shared rules for lectures.json (used by build.js and check-lectures.js)
const CATEGORIES = ["AI & Automation", "Freelancing", "Web & App Development", "Digital Marketing"];

function normalizeUrl(url) {
  let u = String(url).trim().toLowerCase().replace(/#.*$/, "");
  const v = u.match(/[?&]v=([^&]+)/);
  u = u.replace(/^https?:\/\/(www\.|m\.|web\.)?/, "").replace(/\?.*$/, "").replace(/\/+$/, "");
  return v ? u + "?v=" + v[1] : u;
}

function validate(lectures) {
  const errors = [];
  if (!Array.isArray(lectures)) return ["lectures.json must be a list that starts with [ and ends with ]."];
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
  return errors;
}

module.exports = { CATEGORIES, validate };
