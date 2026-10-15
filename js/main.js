/* ==========================================================================
   Page rendering and interactions
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var root = document.documentElement;

  /* ---- helpers ---------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function bi(o) { return '<span class="t">' + esc(o.tech) + '</span><span class="b">' + esc(o.biz) + "</span>"; }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function reducedMotion() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }

  var I = {
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.6 1-2.7 2.4-2.7s2.1 1 2.1 2.6V17M12 10.5V17"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
    code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5"/></svg>',
  };

  /* ---- toast & clipboard ------------------------------------------------ */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function copy(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(okMsg); } catch (e) { toast("Couldn't copy. Select and copy manually."); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    } else {
      fallback();
    }
  }

  /* ---- audience + theme ------------------------------------------------- */
  function syncModeButtons() {
    var m = root.getAttribute("data-mode");
    $$("[data-set-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-mode") === m));
    });
  }
  function setMode(m, announce) {
    if (root.getAttribute("data-mode") === m) return;
    root.setAttribute("data-mode", m);
    store("eo-mode", m);
    syncModeButtons();
    if (announce) toast(m === "tech" ? "Explaining everything for engineers" : "Explaining everything for the business side");
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store("eo-theme", t);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#f5f7fb" : "#07090f");
  }
  function scrollToHash(hash) {
    var el = $(hash);
    if (el) el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  }

  /* ---- hero ------------------------------------------------------------- */
  function renderHero() {
    $("#statusText").textContent = S.status;
    // Highlight everything after the first sentence.
    var cut = S.headline.indexOf(". ");
    $("#heroHeadline").innerHTML = cut === -1 ? esc(S.headline)
      : esc(S.headline.slice(0, cut + 1)) + ' <span class="hl">' + esc(S.headline.slice(cut + 2)) + "</span>";
    $("#heroSummary").innerHTML = bi(S.summary);

    var ctas =
      '<a class="btn btn-primary" href="' + esc(S.resume) + '" download>' + I.download + "Download resume</a>" +
      '<a class="btn" href="#contact">Let\'s talk' + I.arrow + "</a>" +
      '<a class="btn btn-social" href="https://github.com/' + esc(S.githubUser) + '" target="_blank" rel="noopener" aria-label="GitHub profile" title="GitHub">' + I.github + '<span class="lbl">GitHub</span></a>' +
      '<a class="btn btn-social" href="' + esc(S.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn profile" title="LinkedIn">' + I.linkedin + '<span class="lbl">LinkedIn</span></a>';
    $("#heroCtas").innerHTML = ctas;

    $("#heroBadges").innerHTML = S.heroBadges.map(function (b) {
      return "<li><b>" + esc(b.label) + "</b><span>" + esc(b.value) + "</span></li>";
    }).join("");

    $("#stats").innerHTML = S.stats.map(function (s) {
      return "<div><dt>" + esc(s.label) + '</dt><dd data-count="' + s.value + '" data-prefix="' + esc(s.prefix || "") + '" data-suffix="' + esc(s.suffix || "") + '">' +
        esc(s.prefix || "") + s.value + '<span class="sfx">' + esc(s.suffix || "") + "</span></dd></div>";
    }).join("");
  }

  function countUp() {
    var els = $$("#stats dd");
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    els.forEach(function (el) {
      el.innerHTML = esc(el.dataset.prefix) + "0" + '<span class="sfx">' + esc(el.dataset.suffix) + "</span>";
    });
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
        els.forEach(function (el) {
          el.innerHTML = esc(el.dataset.prefix) + Math.round(+el.dataset.count * e) + '<span class="sfx">' + esc(el.dataset.suffix) + "</span>";
        });
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.4 });
    io.observe($("#stats"));
  }

  function roleTyper() {
    var el = $("#roleTyper"), roles = S.roles, i = 0;
    if (!roles || roles.length < 2) return;
    if (reducedMotion()) {
      setInterval(function () { i = (i + 1) % roles.length; el.textContent = roles[i]; }, 3000);
      return;
    }
    var text = roles[0], deleting = false;
    el.textContent = text;
    function tick() {
      var target = roles[i];
      if (!deleting && text === target) { deleting = true; return setTimeout(tick, 2200); }
      if (deleting) {
        text = text.slice(0, -1);
        if (!text) { deleting = false; i = (i + 1) % roles.length; }
      } else {
        text = target.slice(0, text.length + 1);
      }
      el.textContent = text;
      setTimeout(tick, deleting ? 28 : 55);
    }
    setTimeout(tick, 1600);
  }

  function heroNetwork() {
    var c = $("#heroCanvas");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d");
    var W = 0, H = 0, nodes = [], mouse = { x: -9999, y: -9999 }, running = false, raf = 0;
    var accent = "", dot = "";
    var LINK = 125;

    function colors() { accent = cssVar("--accent"); dot = cssVar("--muted"); }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.max(26, Math.min(85, (W * H) / 15000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 1.3 });
      }
    }
    function draw(move) {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (move) {
          dx = a.x - mouse.x; dy = a.y - mouse.y; d = Math.hypot(dx, dy);
          if (d < 140 && d > 0.1) { a.vx += (dx / d) * 0.015; a.vy += (dy / d) * 0.015; }
          a.vx *= 0.995; a.vy *= 0.995;
          var sp = Math.hypot(a.vx, a.vy);
          if (sp < 0.12) { a.vx += (Math.random() - 0.5) * 0.04; a.vy += (Math.random() - 0.5) * 0.04; }
          if (sp > 0.8) { a.vx *= 0.8 / sp; a.vy *= 0.8 / sp; }
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
        }
      }
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          var near = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) < 180;
          ctx.strokeStyle = near ? accent : dot;
          ctx.globalAlpha = (1 - d / LINK) * (near ? 0.55 : 0.22);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = accent;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.globalAlpha = 0.65;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function frame() { if (!running) return; draw(true); raf = requestAnimationFrame(frame); }
    function start() { if (running || reducedMotion()) return; running = true; raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    colors(); resize(); draw(false);
    window.addEventListener("resize", function () { resize(); draw(false); });
    $(".hero").addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    $(".hero").addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
    new MutationObserver(function () { colors(); if (!running) draw(false); })
      .observe(root, { attributes: true, attributeFilter: ["data-theme", "data-mode"] });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(c);
    } else start();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  }

  function portraitTilt() {
    var p = $("#portrait"), f = p && $(".portrait-frame", p);
    if (!p || reducedMotion() || !matchMedia("(hover: hover)").matches) return;
    p.addEventListener("pointermove", function (e) {
      var r = p.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      f.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
      f.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
    });
    p.addEventListener("pointerleave", function () {
      f.style.setProperty("--ry", "0deg");
      f.style.setProperty("--rx", "0deg");
    });
  }

  /* ---- 01 discovery ----------------------------------------------------- */
  var selectedNeeds = ["demo", "translate", "sell"];

  function renderNeeds() {
    $("#needs").innerHTML = S.needs.map(function (n) {
      return '<button type="button" class="need" data-need="' + n.id + '" aria-pressed="' + (selectedNeeds.indexOf(n.id) !== -1) + '">' +
        '<span class="box">' + I.check + "</span>" + esc(n.label) + "</button>";
    }).join("");
    $("#needs").addEventListener("click", function (e) {
      var b = e.target.closest(".need");
      if (!b) return;
      var id = b.getAttribute("data-need"), at = selectedNeeds.indexOf(id);
      if (at === -1) selectedNeeds.push(id); else selectedNeeds.splice(at, 1);
      b.setAttribute("aria-pressed", String(at === -1));
      renderFit();
    });
    renderFit();
  }

  function chosenNeeds() {
    return S.needs.filter(function (n) { return selectedNeeds.indexOf(n.id) !== -1; });
  }

  function fitSummaryText() {
    var lines = [S.name + ": fit summary", S.status + " · B.S. Computer Science, CSUSM (May 2027)", ""];
    chosenNeeds().forEach(function (n) {
      lines.push("✓ " + n.label);
      n.evidence.forEach(function (ev) { lines.push("   - " + ev.src + ": " + ev.text); });
      lines.push("");
    });
    lines.push("Portfolio: " + location.href.split("#")[0]);
    lines.push("Email: " + S.email);
    lines.push("LinkedIn: " + S.linkedin);
    return lines.join("\n");
  }

  function renderFit() {
    var box = $("#fitReport"), needs = chosenNeeds();
    if (!needs.length) {
      box.innerHTML = '<div class="fit-empty"><p>Pick one or more requirements on the left<br>to generate a fit report.</p></div>';
      return;
    }
    var proof = needs.reduce(function (s, n) { return s + n.evidence.length; }, 0);
    box.innerHTML =
      '<div class="fit-head"><div><p class="mini-label">Fit report</p><p class="fit-title">' +
      (needs.length === 1 ? "Your requirement is" : "All " + needs.length + " requirements are") + " backed by real experience.</p></div>" +
      '<p class="fit-score"><strong>' + proof + "</strong>proof points</p></div>" +
      '<div class="fit-meter" aria-hidden="true">' + needs.map(function () { return "<i></i>"; }).join("") + "</div>" +
      needs.map(function (n) {
        return '<div class="fit-group"><h4>' + I.check + esc(n.label) + "</h4><ul>" +
          n.evidence.map(function (ev) {
            var text = ev.href ? '<a href="' + esc(ev.href) + '">' + esc(ev.text) + "</a>" : "<span>" + esc(ev.text) + "</span>";
            return '<li><span class="src">' + esc(ev.src) + "</span>" + text + "</li>";
          }).join("") + "</ul></div>";
      }).join("") +
      '<div class="fit-actions">' +
      '<button type="button" class="btn btn-sm" data-act="copy-fit">' + I.copy + "Copy summary</button>" +
      '<a class="btn btn-sm btn-primary" href="mailto:' + esc(S.email) + "?subject=" + encodeURIComponent("Role fit: " + needs.map(function (n) { return n.label; }).join(", ")) +
      "&body=" + encodeURIComponent("Hi Ethan,\n\nI'm hiring for a role that needs someone who:\n" + needs.map(function (n) { return "- " + n.label.toLowerCase(); }).join("\n") + "\n\n") +
      '">' + I.mail + "Email Ethan about this role</a></div>";

    // light up the meter one segment at a time
    $$(".fit-meter i", box).forEach(function (el, i) {
      setTimeout(function () { el.classList.add("on"); }, 80 + i * 110);
    });
  }

  /* ---- 02 experience ---------------------------------------------------- */
  function renderExperience() {
    var html = S.experience.map(function (j) {
      var now = /present/i.test(j.dates);
      return '<article class="job reveal" id="' + esc(j.id) + '" style="--co:' + esc(j.color) + '">' +
        '<div class="job-mark" aria-hidden="true">' + esc(j.mark) + "</div>" +
        '<div class="card"><div class="job-top"><div><h3 class="job-role">' + esc(j.role) + '</h3><p class="job-co"><i></i>' + esc(j.company) + "</p></div>" +
        '<p class="job-when">' + esc(j.dates) + (now ? '<span class="job-now">Now</span>' : "") + "<br>" + esc(j.location) + "</p></div>" +
        "<ul>" + j.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
        '<div class="tags">' + j.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
        "</div></article>";
    }).join("");
    $("#timeline").insertAdjacentHTML("beforeend", html);

    $("#eduGrid").innerHTML = S.education.map(function (e) {
      return '<div class="card edu reveal"><h4>' + esc(e.school) + "</h4><p>" + esc(e.degree) + '</p><p class="when">' + esc(e.dates) + " · " + esc(e.location) + "</p></div>";
    }).join("");
  }

  /* ---- 03 projects ------------------------------------------------------ */
  function renderProjects() {
    var wrap = $("#projects");
    wrap.innerHTML = S.projects.map(function (p) {
      var checks = function (list) { return list.map(function (x) { return "<li>" + I.check + "<span>" + esc(x) + "</span></li>"; }).join(""); };
      var links = p.repo
        ? '<a class="btn btn-sm" href="https://github.com/' + esc(S.githubUser) + "/" + esc(p.repo) + '" target="_blank" rel="noopener">' + I.github + "View the code</a>"
        : "";
      if (p.live) links += '<a class="btn btn-sm" href="' + esc(p.live) + '" target="_blank" rel="noopener">' + I.arrow + "Open the full version</a>";
      return '<article class="card project reveal" id="' + esc(p.id) + '">' +
        '<div class="project-info"><p class="project-when">' + esc(p.when) + '</p><h3 class="project-title">' + esc(p.title) + "</h3>" +
        '<p class="project-summary">' + bi(p.summary) + "</p>" +
        '<ul class="checks t">' + checks(p.points.tech) + '</ul><ul class="checks b">' + checks(p.points.biz) + "</ul>" +
        '<div class="tags">' + p.stack.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div>" +
        (links ? '<div class="project-links">' + links + "</div>" : "") +
        "</div>" +
        '<div class="demo" data-demo="' + esc(p.demo) + '"></div></article>';
    }).join("");
    $$(".demo", wrap).forEach(function (el) {
      if (window.Demos) window.Demos.mount(el.getAttribute("data-demo"), el);
    });
  }

  /* ---- 04 toolkit ------------------------------------------------------- */
  function evidenceFor(id) {
    var j = S.experience.filter(function (x) { return x.id === id; })[0];
    if (j) return { title: j.role + " · " + j.company, detail: esc(j.bullets[0]), href: "#" + j.id };
    var p = S.projects.filter(function (x) { return x.id === id; })[0];
    if (p) return { title: p.title, detail: bi({ tech: p.points.tech.join(" · "), biz: p.points.biz.join(" · ") }), href: "#" + p.id };
    var x = S.extraEvidence[id];
    if (x) return { title: x.title, detail: esc(x.detail), href: x.href, action: x.action };
    return null;
  }

  function renderToolkit() {
    $("#skillGroups").innerHTML = S.skills.map(function (g, gi) {
      return '<div class="skill-group reveal"><h3>' + esc(g.group) + '</h3><div class="chips">' +
        g.items.map(function (s, si) {
          return '<button type="button" class="chip" data-skill="' + gi + "-" + si + '" aria-pressed="false">' + esc(s.name) + "</button>";
        }).join("") + "</div></div>";
    }).join("");

    function select(key) {
      $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-skill") === key)); });
      var k = key.split("-"), g = S.skills[+k[0]], s = g.items[+k[1]];
      var items = s.used.map(evidenceFor).filter(Boolean);
      $("#receipt").innerHTML =
        '<div class="receipt-top"><span>Receipt · ' + esc(g.group) + "</span><b>" + esc(s.name) + "</b><span>Proof of use</span></div>" +
        '<ul class="receipt-items">' + items.map(function (it) {
          var attr = it.action ? ' data-action="' + esc(it.action) + '"' : "";
          return '<li><div class="receipt-row"><span>' + esc(it.title) + '</span><a href="' + esc(it.href) + '"' + attr + ">view →</a></div><p>" + it.detail + "</p></li>";
        }).join("") + "</ul>" +
        '<div class="receipt-total"><span>USED IN</span><span>' + items.length + (items.length === 1 ? " place" : " places") + "</span></div>";
    }

    $("#skillGroups").addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (b) select(b.getAttribute("data-skill"));
    });
    $("#receipt").addEventListener("click", function (e) {
      var a = e.target.closest('[data-action="terminal"]');
      if (a) { e.preventDefault(); if (window.App.terminal) window.App.terminal.open(); }
    });

    // Start on Python
    var start = "0-0";
    S.skills.forEach(function (g, gi) { g.items.forEach(function (s, si) { if (s.name === "Python") start = gi + "-" + si; }); });
    select(start);
  }

  /* ---- 06 contact ------------------------------------------------------- */
  function renderContact() {
    var html =
      '<div class="email-pill"><a href="mailto:' + esc(S.email) + '">' + I.mail + esc(S.email) + "</a>" +
      '<button type="button" data-act="copy-email" aria-label="Copy email address">Copy</button></div>' +
      '<a class="btn" href="' + esc(S.linkedin) + '" target="_blank" rel="noopener">' + I.linkedin + "LinkedIn</a>" +
      '<a class="btn" href="https://github.com/' + esc(S.githubUser) + '" target="_blank" rel="noopener">' + I.github + "GitHub</a>" +
      '<a class="btn" href="' + esc(S.resume) + '" download>' + I.download + "Resume</a>";
    if (S.bookingUrl) html = '<a class="btn btn-primary" href="' + esc(S.bookingUrl) + '" target="_blank" rel="noopener">' + I.calendar + "Book a 15-min call</a>" + html;
    $("#contactActions").innerHTML = html;

    var rows = [
      ["Targeting", "Sales Engineering · Solutions Consulting"],
      ["Graduating", "B.S. Computer Science, CSUSM · May 2027"],
      ["Based in", S.location],
      ["Recent", "Cisco Technical Sales Engineering Intern ('26) · AWS Student Builder Campus Leader"],
      ["Proof", "2× quota in live sales · 500+ viewer live streams · Builds AI automations"],
    ];
    $("#tldr").innerHTML = rows.map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
    }).join("") + '<div><dt>Contact</dt><dd><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></dd></div>";
  }

  /* ---- nav, progress, section rail -------------------------------------- */
  function navigation() {
    var nav = $("#nav"), bar = $("#scrollBar"), links = $$("#navLinks a");
    var sections = $$("section[data-stage]");
    var rail = $("#stageRail");
    var fill = $("#timelineFill"), timeline = $("#timeline");

    rail.innerHTML = sections.map(function (s) {
      return '<li><a href="#' + s.id + '" aria-label="' + esc(s.getAttribute("data-stage-name")) + '">' + s.getAttribute("data-stage") + "<span>" + esc(s.getAttribute("data-stage-name")) + "</span></a></li>";
    }).join("");
    var railLinks = $$("a", rail);

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      nav.classList.toggle("scrolled", y > 8);
      rail.classList.toggle("visible", y > vh * 0.55);

      var active = -1;
      sections.forEach(function (s, i) { if (s.getBoundingClientRect().top <= vh * 0.38) active = i; });
      if (max - y < 4) active = sections.length - 1;
      links.forEach(function (a, i) { a.classList.toggle("active", i === active); });
      railLinks.forEach(function (a, i) {
        a.classList.toggle("active", i === active);
        a.classList.toggle("done", i < active);
      });

      if (fill && timeline) {
        var r = timeline.getBoundingClientRect();
        var p = (vh * 0.6 - r.top) / r.height;
        fill.style.transform = "scaleY(" + Math.max(0, Math.min(1, p)) + ")";
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();

    // mobile menu
    var menuBtn = $("#menuBtn"), menu = $("#navLinks");
    function setMenu(open) {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !e.target.closest("#navLinks, #menuBtn")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  function reveals() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reducedMotion()) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  // Cursor spotlight on cards (one delegated listener)
  function spotlight() {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---- boot ------------------------------------------------------------- */
  function boot() {
    renderHero();
    renderNeeds();
    renderExperience();
    renderProjects();
    renderToolkit();
    renderContact();
    syncModeButtons();
    $("#year").textContent = new Date().getFullYear();

    document.addEventListener("click", function (e) {
      var m = e.target.closest("[data-set-mode]");
      if (m) setMode(m.getAttribute("data-set-mode"), true);
      if (e.target.closest('[data-act="copy-email"]')) copy(S.email, "Email copied");
      if (e.target.closest('[data-act="copy-fit"]')) copy(fitSummaryText(), "Fit summary copied");
    });
    $("#themeBtn").addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    window.App = { setMode: setMode, setTheme: setTheme, scrollTo: scrollToHash, toast: toast };
    if (window.Terminal) {
      window.App.terminal = window.Terminal.init(S, window.App);
      $("#termBtn").addEventListener("click", function () { window.App.terminal.open(); });
    }
    if (window.GitHubFeed) window.GitHubFeed.init($("#ghRoot"), S);

    navigation();
    reveals();
    countUp();
    roleTyper();
    heroNetwork();
    portraitTilt();
    spotlight();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
