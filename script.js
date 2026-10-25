// Lecture Library: search + category filters. Data comes from lectures.json
(function () {
  var CATEGORIES = ["AI & Automation", "Freelancing", "Web & App Development", "Digital Marketing"];
  var all = [];

  var listEl = document.getElementById("lecture-list");
  var emptyEl = document.getElementById("empty");
  var countEl = document.getElementById("count");
  var searchEl = document.getElementById("search");
  var chips = document.querySelectorAll(".chip");
  var activeCategory = "All Lectures";

  // Show a note if the cover photo file is missing
  var cover = document.getElementById("cover-img");
  function coverMissing() {
    cover.hidden = true;
    document.getElementById("cover-missing").hidden = false;
  }
  cover.addEventListener("error", coverMissing);
  if (cover.complete && cover.naturalWidth === 0) coverMissing();

  var playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render() {
    var q = searchEl.value.trim().toLowerCase();

    var results = all.filter(function (l) {
      var inCategory = activeCategory === "All Lectures" || l.category === activeCategory;
      if (!inCategory) return false;
      if (!q) return true;
      // "1", "01", "lecture 1" and "lecture 01" all find lecture 1
      var numQuery = q.replace(/^(lecture|lec|#)\s*/, "");
      if (/^\d+$/.test(numQuery) && Number(numQuery) === Number(l.number)) return true;
      var text = (l.title + " " + l.category).toLowerCase();
      return text.indexOf(q) !== -1;
    });

    listEl.innerHTML = results.map(function (l) {
      var label = String(l.number).padStart(2, "0");
      return (
        '<li class="lecture">' +
          '<span class="num" aria-label="Lecture ' + escapeHtml(label) + '">' + escapeHtml(label) + '</span>' +
          '<div class="info">' +
            '<p class="title">' + escapeHtml(l.title) + '</p>' +
            '<span class="cat">' + escapeHtml(l.category) + '</span>' +
          '</div>' +
          '<a class="watch" href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Watch lecture ' + escapeHtml(l.number) + ': ' + escapeHtml(l.title) + ' (opens in a new tab)">' +
            playIcon + 'Watch Lecture' +
          '</a>' +
        '</li>'
      );
    }).join("");

    if (all.length === 0) {
      emptyEl.textContent = "Lecture links will be added soon.";
      emptyEl.hidden = false;
      countEl.textContent = "";
    } else if (results.length === 0) {
      emptyEl.textContent = "No lectures found.";
      emptyEl.hidden = false;
      countEl.textContent = "0 lectures";
    } else {
      emptyEl.hidden = true;
      countEl.textContent = results.length + (results.length === 1 ? " lecture" : " lectures");
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      activeCategory = chip.getAttribute("data-category");
      render();
    });
  });

  searchEl.addEventListener("input", render);

  function normalizeUrl(url) {
    // Ignore http/https, www/m/web and tracking extras, but keep a video id (?v=123)
    var u = String(url).trim().toLowerCase().replace(/#.*$/, "");
    var v = u.match(/[?&]v=([^&]+)/);
    u = u.replace(/^https?:\/\/(www\.|m\.|web\.)?/, "").replace(/\?.*$/, "").replace(/\/+$/, "");
    return v ? u + "?v=" + v[1] : u;
  }

  // Keep only valid lectures, skip duplicate numbers and links, sort by number
  function prepare(list) {
    var seenNumbers = {};
    var seenUrls = {};
    return (Array.isArray(list) ? list : []).filter(function (l) {
      if (!l || !l.title || !l.url || !Number.isInteger(Number(l.number))) return false;
      if (CATEGORIES.indexOf(l.category) === -1) {
        console.warn("Lecture " + l.number + " has an unknown category: " + l.category);
      }
      var key = normalizeUrl(l.url);
      if (seenNumbers[l.number] || seenUrls[key]) {
        console.warn("Skipped duplicate lecture: " + l.number + " " + l.url);
        return false;
      }
      seenNumbers[l.number] = true;
      seenUrls[key] = true;
      return true;
    }).sort(function (a, b) { return Number(a.number) - Number(b.number); });
  }

  fetch("lectures.json", { cache: "no-cache" })
    .then(function (res) { return res.json(); })
    .then(function (data) { all = prepare(data); render(); })
    .catch(function () {
      all = [];
      render();
      if (location.protocol === "file:") {
        emptyEl.textContent = "To see lectures on your computer, open this folder with a local server (or view the live GitHub Pages site).";
      }
    });
})();
