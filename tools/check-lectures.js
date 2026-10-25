// Checks lectures.json for mistakes before you publish.
// Run from the website folder:  node tools/check-lectures.js
const fs = require("fs");
const path = require("path");
const { validate } = require("./validate");

let lectures;
try {
  lectures = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "lectures.json"), "utf8"));
} catch (e) {
  console.error("❌ lectures.json is not valid JSON: " + e.message);
  console.error("   Check for a missing comma, quote or bracket.");
  process.exit(1);
}

const errors = validate(lectures);
if (errors.length) {
  console.error(`❌ Found ${errors.length} problem(s) in lectures.json:\n`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
const sorted = [...lectures].sort((a, b) => a.number - b.number).map(l => l.number);
console.log(`✅ lectures.json looks good: ${lectures.length} lecture(s).`);
if (sorted.length) console.log(`   Lecture numbers: ${sorted.join(", ")}`);
