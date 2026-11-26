/* Section jumps: fade out, then the new section fades and slides in,
   instead of scrolling past everything in between. */
(function () {
  "use strict";
  var busy = false;

  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function navOffset() {
    return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64) + 16;
  }
  function targetY(el) {
    if (el.id === "top") return 0;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset());
  }
  function jumpTo(y) { window.scrollTo({ top: y, left: 0, behavior: "instant" }); }
  function showSection(el) {
    el.querySelectorAll(".reveal").forEach(function (r) { r.classList.add("in"); });
  }

  function go(el) {
    var y = targetY(el);
    showSection(el);
    if (reduced() || busy) { jumpTo(y); return; }
    busy = true;
    var done = function () { busy = false; };
    if (document.startViewTransition) {
      document.startViewTransition(function () { jumpTo(y); }).finished.then(done, done);
      return;
    }
    // Browsers without View Transitions (Firefox): same effect on the main content.
    var main = document.getElementById("main");
    if (!main || !main.animate) { jumpTo(y); done(); return; }
    var out = main.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-14px)" }],
      { duration: 170, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
    out.onfinish = function () {
      jumpTo(y);
      var inn = main.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }],
        { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
      out.cancel();
      inn.onfinish = done;
      inn.oncancel = done;
    };
  }

  // In-page links to a section or the top: nav, side rail, logo, hero button, back to top.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = id && document.getElementById(id);
    if (!el || !(el.matches("section[data-stage]") || id === "top")) return;
    e.preventDefault();
    go(el);
    if (history.replaceState) history.replaceState(null, "", id === "top" ? location.pathname + location.search : "#" + id);
  });
})();
