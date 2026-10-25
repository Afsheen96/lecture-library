// Builds the crawlable lecture list from lectures.json into index.html,
// plus structured data, analytics tags and sitemap.xml.
// Run from the website folder:  node tools/build.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { validate } = require("./validate");

const root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);

let lectures;
try {
  lectures = JSON.parse(read("lectures.json"));
} catch (e) {
  console.error("❌ lectures.json is not valid JSON: " + e.message);
  process.exit(1);
}
const errors = validate(lectures);
if (errors.length) {
  console.error(`❌ Build stopped. Fix ${errors.length} problem(s) in lectures.json:\n`);
  errors.forEach(e => console.error("  - " + e));
  process.exit(1);
}
lectures = [...lectures].sort((a, b) => a.number - b.number);

const config = JSON.parse(read("site.config.json"));
const siteUrl = config.siteUrl;
const ga4 = String(config.ga4MeasurementId || "").trim();
const gsc = String(config.searchConsoleVerification || "").trim();
if (ga4 && !/^G-[A-Z0-9]+$/.test(ga4)) {
  console.error('❌ ga4MeasurementId in site.config.json must look like "G-XXXXXXXXXX".');
  process.exit(1);
}

// Last time lectures.json changed, from git history (falls back to today)
let updated;
try {
  updated = execSync("git log -1 --format=%cs -- lectures.json", { cwd: root }).toString().trim();
} catch (e) { /* not a git checkout */ }
if (!/^\d{4}-\d{2}-\d{2}$/.test(updated || "")) updated = new Date().toISOString().slice(0, 10);
const updatedLabel = new Date(updated + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");

const listHtml = lectures.map(l => `        <li class="lecture" data-number="${l.number}" data-category="${esc(l.category)}">
          <span class="num" aria-hidden="true">${pad(l.number)}</span>
          <div class="info">
            <h3 class="title"><a href="${esc(l.url)}" target="_blank" rel="noopener" data-lecture="${l.number}"><span class="sr-only">Lecture ${pad(l.number)}: </span>${esc(l.title)}</a></h3>
            <span class="cat">${esc(l.category)}</span>
          </div>
          <a class="watch" href="${esc(l.url)}" target="_blank" rel="noopener" data-lecture="${l.number}" aria-label="Watch Lecture ${pad(l.number)} on Facebook: ${esc(l.title)} (opens in a new tab)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>Watch Lecture</a>
        </li>`).join("\n");

const countText = lectures.length === 1 ? "1 lecture" : `${lectures.length} lectures`;

// FAQ text lives in index.html; read it back so the FAQPage schema always matches what's visible
const html0 = read("index.html");
const faq = [...html0.matchAll(/<div class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)]
  .map(m => [m[1], m[2]].map(t => t.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()));

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": siteUrl + "#website",
      url: siteUrl,
      name: "Learn Freelancing AI — Lecture Hub",
      description: "An independent, student-created directory of Learn Freelancing AI lecture links.",
      inLanguage: "en"
    },
    {
      "@type": "WebPage",
      "@id": siteUrl + "#webpage",
      url: siteUrl,
      name: "Learn Freelancing AI Lectures | Claude & AI Tutorials",
      isPartOf: { "@id": siteUrl + "#website" },
      inLanguage: "en",
      dateModified: updated,
      primaryImageOfPage: { "@type": "ImageObject", url: siteUrl + "assets/cover.jpg", width: 2056, height: 765 },
      mainEntity: { "@id": siteUrl + "#lectures" }
    },
    {
      "@type": "ItemList",
      "@id": siteUrl + "#lectures",
      name: "Learn Freelancing AI lectures",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: lectures.length,
      itemListElement: lectures.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Lecture ${pad(l.number)}: ${l.title}`,
        url: l.url
      }))
    },
    ...(faq.length ? [{
      "@type": "FAQPage",
      "@id": siteUrl + "#faq",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
    }] : [])
  ]
};

const headExtra = [
  gsc ? `  <meta name="google-site-verification" content="${esc(gsc)}">` : "",
  ga4 ? `  <script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "${ga4}", { allow_google_signals: false, allow_ad_personalization_signals: false });
  </script>` : "",
  `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2).replace(/</g, "\\u003c")}\n  </script>`
].filter(Boolean).join("\n");

function replaceBlock(html, name, content) {
  const re = new RegExp(`(<!-- ${name}:START[^>]*-->)[\\s\\S]*?(<!-- ${name}:END -->)`);
  if (!re.test(html)) { console.error(`❌ Marker ${name} not found in index.html`); process.exit(1); }
  return html.replace(re, `$1\n${content}\n$2`);
}

let html = html0;
html = replaceBlock(html, "HEAD", headExtra);
html = replaceBlock(html, "LECTURES", listHtml);
html = replaceBlock(html, "COUNT", `<span id="count" class="count" aria-live="polite">${countText}</span>`);
html = replaceBlock(html, "UPDATED", `<p class="updated">Lecture list last updated: <time datetime="${updated}">${updatedLabel}</time></p>`);
write("index.html", html);

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${updated}</lastmod>
  </url>
</urlset>
`);

console.log(`✅ Built index.html with ${lectures.length} lecture(s), updated ${updated}.`);
console.log(`   GA4: ${ga4 || "not set"} | Search Console tag: ${gsc ? "set" : "not set"}`);
