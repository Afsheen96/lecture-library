// Lecture Library: search, category filters and analytics events.
// The lecture list is already in the HTML (built from lectures.json by tools/build.js).
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll("#lecture-list .lecture"));
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

  // Read each lecture's details once from the HTML
  var lectures = items.map(function (li) {
    return {
      el: li,
      number: Number(li.getAttribute("data-number")),
      category: li.getAttribute("data-category"),
      title: li.querySelector(".title a").textContent.replace(/^Lecture \d+:\s*/, "")
    };
  });

  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }

  function matches(l, q) {
    if (activeCategory !== "All Lectures" && l.category !== activeCategory) return false;
    if (!q) return true;
    // "1", "01", "lecture 1" and "lecture 01" all find lecture 1
    var numQuery = q.replace(/^(lecture|lec|#)\s*/, "");
    if (/^\d+$/.test(numQuery) && Number(numQuery) === l.number) return true;
    return (l.title + " " + l.category).toLowerCase().indexOf(q) !== -1;
  }

  function render() {
    var q = searchEl.value.trim().toLowerCase();
    var shown = 0;
    lectures.forEach(function (l) {
      var show = matches(l, q);
      l.el.hidden = !show;
      if (show) shown++;
    });

    if (lectures.length === 0) {
      emptyEl.textContent = "Lecture links will be added soon.";
      emptyEl.hidden = false;
      countEl.textContent = "";
    } else if (shown === 0) {
      emptyEl.textContent = "No lectures found.";
      emptyEl.hidden = false;
      countEl.textContent = "0 lectures";
    } else {
      emptyEl.hidden = true;
      countEl.textContent = shown + (shown === 1 ? " lecture" : " lectures");
    }
    return shown;
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

  // Internal search tracking: one event after typing pauses, no repeats, no long text
  var searchTimer;
  var lastTracked = "";
  searchEl.addEventListener("input", function () {
    var shown = render();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      var term = searchEl.value.trim().toLowerCase().slice(0, 60);
      if (term.length < 2 || term === lastTracked) return;
      lastTracked = term;
      track("search", { search_term: term, results_count: shown });
    }, 1500);
  });

  // Watch Lecture clicks (title link and button share one handler, so one click = one event)
  document.getElementById("lecture-list").addEventListener("click", function (e) {
    var link = e.target.closest("a[data-lecture]");
    if (!link) return;
    var l = lectures.filter(function (x) { return x.number === Number(link.getAttribute("data-lecture")); })[0];
    if (!l) return;
    track("watch_lecture", {
      lecture_number: l.number,
      lecture_title: l.title,
      lecture_category: l.category,
      link_type: link.classList.contains("watch") ? "button" : "title"
    });
  });

  // Privacy: let visitors turn analytics off (or back on) on this device
  var toggle = document.getElementById("analytics-toggle");
  var status = document.getElementById("analytics-status");
  if (toggle && typeof window.gtag === "function") {
    var off = false;
    try { off = localStorage.getItem("analytics-off") === "1"; } catch (e) {}
    var showState = function () {
      toggle.textContent = off ? "Turn analytics back on" : "Turn off analytics on this device";
      status.textContent = off ? "Analytics is off on this device." : "";
    };
    toggle.hidden = false;
    showState();
    toggle.addEventListener("click", function () {
      off = !off;
      try { localStorage.setItem("analytics-off", off ? "1" : "0"); } catch (e) {}
      window.gtag("consent", "update", { analytics_storage: off ? "denied" : "granted" });
      if (off) {
        // Remove any analytics cookies already set
        document.cookie.split(";").forEach(function (c) {
          var name = c.split("=")[0].trim();
          if (/^_ga/.test(name)) document.cookie = name + "=; Max-Age=0; path=/; domain=" + location.hostname.replace(/^www\./, "");
        });
      }
      showState();
      if (!off) status.textContent = "Analytics will turn back on when you reload the page.";
    });
  }

  render();
})();
