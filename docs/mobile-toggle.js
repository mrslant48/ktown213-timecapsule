// Classic vs Compact view toggle. "Classic" (default) is untouched - no
// viewport meta tag is added, so browsers fall back to their standard
// desktop-site zoom-to-fit behavior, same as this time capsule has always
// rendered. "Compact" adds a viewport meta tag matched to the page's own
// actual rendered width, so mobile browsers zoom in to fill the screen
// instead of showing a wide, tiny-text page. Preference is remembered
// site-wide via localStorage.
(function () {
  var KEY = "ktownViewMode"; // "compact" | "classic"

  function getMode() {
    try {
      return localStorage.getItem(KEY) || "classic";
    } catch (e) {
      return "classic";
    }
  }

  function setMode(mode) {
    try {
      localStorage.setItem(KEY, mode);
    } catch (e) {}
  }

  function applyMode(mode) {
    var meta = document.querySelector('meta[name="viewport"]');
    if (mode === "compact") {
      var w = Math.max(
        320,
        document.documentElement.scrollWidth || document.body.scrollWidth || 855
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "viewport");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", "width=" + w);
    } else if (meta) {
      meta.parentNode.removeChild(meta);
    }
  }

  function label(btn) {
    btn.textContent = getMode() === "compact" ? "🖥 Classic view" : "📱 Compact view";
  }

  function makeButton() {
    var btn = document.createElement("button");
    btn.id = "ktown-view-toggle";
    btn.style.cssText =
      "position:fixed;bottom:10px;right:10px;z-index:999999;" +
      "background:#ffcc33;color:#000;border:1px solid #000;border-radius:20px;" +
      "padding:8px 14px;font-family:Verdana,Arial,sans-serif;font-size:12px;" +
      "font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;";
    label(btn);
    btn.addEventListener("click", function () {
      var next = getMode() === "compact" ? "classic" : "compact";
      setMode(next);
      applyMode(next);
      label(btn);
    });
    document.body.appendChild(btn);
  }

  function init() {
    applyMode(getMode()); // no-op if "classic" (the default) - page is untouched
    makeButton();
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
