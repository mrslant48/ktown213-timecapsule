// Classic vs Compact view toggle.
//
// The old version only set a <meta name="viewport"> tag, which desktop
// browsers completely ignore (viewport meta is a mobile-browser-only
// convention) - so the toggle looked like it did nothing when tested on a
// desktop. This version applies a CSS zoom directly, which is visible
// and testable on any device/window size, and genuinely helps on a real
// phone too: it scales the fixed-width page down (or up to fill, capped
// at 100%) to match the current window width.
//
// "Classic" (default) is the page exactly as it has always rendered -
// zoom is left alone. "Compact" computes zoom = windowWidth / naturalPage
// Width (never above 1, so wide desktop windows are untouched - there's
// nothing to compact when the page already fits). Preference is
// remembered site-wide via localStorage and reapplied on resize.
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

  function naturalWidth() {
    var html = document.documentElement;
    var prevZoom = html.style.zoom;
    html.style.zoom = "1"; // reset before measuring, or we'd measure a stale scaled size
    var w = html.scrollWidth || document.body.scrollWidth || 855;
    html.style.zoom = prevZoom;
    return w;
  }

  function applyMode(mode) {
    var html = document.documentElement;
    if (mode === "compact") {
      var w = naturalWidth();
      var scale = Math.min(1, (window.innerWidth - 4) / w);
      html.style.zoom = scale;
    } else {
      html.style.zoom = "";
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
    window.addEventListener("resize", function () {
      if (getMode() === "compact") applyMode("compact");
    });
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
