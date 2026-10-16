/* ==========================================================================
   Page rendering and interactions
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var LOGOS = window.LOGOS || {};
  var root = document.documentElement;

  /* ---- helpers ---------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function reducedMotion() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }

  var I = {
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.5v.01M12 17v-3.8c0-1.6 1-2.7 2.4-2.7s2.1 1 2.1 2.6V17M12 10.5V17"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
  };

  function logoOrMark(item) {
    if (item.logo && LOGOS[item.logo]) return '<span class="logo logo-' + esc(item.logo) + '">' + LOGOS[item.logo] + "</span>";
    return '<span class="mark" style="--co:' + esc(item.color || "#888") + '">' + esc(item.mark || "") + "</span>";
  }

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

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store("eo-theme", t);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#f5f7fb" : "#07090f");
  }

  /* ---- hero ------------------------------------------------------------- */
  function renderHero() {
    $("#statusText").textContent = S.status;
    // Highlight everything after the first sentence.
    var cut = S.headline.indexOf(". ");
    $("#heroHeadline").innerHTML = cut === -1 ? esc(S.headline)
      : esc(S.headline.slice(0, cut + 1)) + ' <span class="hl">' + esc(S.headline.slice(cut + 2)) + "</span>";
    $("#heroSummary").textContent = S.summary;

    $("#heroCtas").innerHTML =
      '<a class="btn btn-primary" href="' + esc(S.resume) + '" download>' + I.download + "Download resume</a>" +
      '<a class="btn" href="tel:' + esc(S.phoneHref) + '">' + I.phone + esc(S.phone) + "</a>" +
      '<a class="btn btn-social" href="mailto:' + esc(S.email) + '" aria-label="Email" title="Email">' + I.mail + '<span class="lbl">Email</span></a>' +
      '<a class="btn btn-social" href="' + esc(S.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn profile" title="LinkedIn">' + I.linkedin + '<span class="lbl">LinkedIn</span></a>';

    $("#creds").innerHTML = S.credentials.map(function (c) {
      return '<div class="cred">' + logoOrMark(c) + '<span class="cred-text"><b>' + esc(c.title) + "</b><small>" + esc(c.note) + "</small></span></div>";
    }).join("");

    $("#startupLabel").textContent = S.startup.label;
    $("#stats").innerHTML = S.startup.stats.map(function (s) {
      return "<div><dt>" + esc(s.label) + '</dt><dd data-count="' + s.value + '" data-suffix="' + esc(s.suffix || "") + '">' +
        s.value + '<span class="sfx">' + esc(s.suffix || "") + "</span></dd></div>";
    }).join("");
  }

  function countUp() {
    var els = $$("#stats dd");
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    function paint(e) {
      els.forEach(function (el) {
        el.innerHTML = Math.round(+el.dataset.count * e) + '<span class="sfx">' + esc(el.dataset.suffix) + "</span>";
      });
    }
    paint(0);
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / 1400);
        paint(1 - Math.pow(1 - p, 3));
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
      if (move) {
        for (i = 0; i < nodes.length; i++) {
          a = nodes[i];
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
      ctx.globalAlpha = 0.65;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
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
      .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
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
  var selectedNeeds = (S.defaultNeeds || []).slice(0, 1);

  function renderNeeds() {
    $("#needs").innerHTML = S.needs.map(function (n) {
      return '<button type="button" role="radio" class="need" data-need="' + n.id + '" aria-checked="' + (selectedNeeds.indexOf(n.id) !== -1) + '">' +
        '<span class="box" aria-hidden="true"></span>' + esc(n.label) + "</button>";
    }).join("");
    $("#needs").addEventListener("click", function (e) {
      var b = e.target.closest(".need");
      if (!b) return;
      // One requirement at a time, like a radio button.
      var id = b.getAttribute("data-need");
      if (selectedNeeds[0] === id) return;
      selectedNeeds = [id];
      $$(".need").forEach(function (n) {
        n.setAttribute("aria-checked", String(n.getAttribute("data-need") === id));
      });
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
    lines.push("Phone: " + S.phone);
    lines.push("Email: " + S.email);
    lines.push("LinkedIn: " + S.linkedin);
    return lines.join("\n");
  }

  function renderFit() {
    var box = $("#fitReport"), needs = chosenNeeds();
    if (!needs.length) {
      box.innerHTML = '<div class="fit-empty"><p>Pick one or more on the left<br>to see the proof.</p></div>';
      return;
    }
    var proof = needs.reduce(function (s, n) { return s + n.evidence.length; }, 0);
    box.innerHTML =
      '<div class="fit-head"><div><p class="mini-label">Fit report</p><p class="fit-title">' +
      "Here's where I've done it.</p></div>" +
      '<p class="fit-score"><strong>' + proof + "</strong>proof points</p></div>" +
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
      '">' + I.mail + "Email me about this role</a></div>";

  }

  /* ---- 02 experience ---------------------------------------------------- */
  function renderExperience() {
    var html = S.experience.map(function (j) {
      var now = /present/i.test(j.dates);
      var stats = j.stats ? '<div class="job-stats">' + j.stats.map(function (s) {
        return "<span><b>" + esc(s.value) + "</b>" + esc(s.label) + "</span>";
      }).join("") + "</div>" : "";
      return '<article class="job reveal" id="' + esc(j.id) + '" style="--co:' + esc(j.color) + '">' +
        '<div class="job-mark' + (j.logo ? " has-logo" : "") + '" aria-hidden="true">' + logoOrMark(j) + "</div>" +
        '<div class="card"><div class="job-top"><div><h3 class="job-role">' + esc(j.role) + '</h3><p class="job-co"><i></i>' + esc(j.company) +
        (j.companyNote ? '<span class="job-note">' + esc(j.companyNote) + "</span>" : "") + "</p></div>" +
        '<p class="job-when">' + esc(j.dates) + (now ? '<span class="job-now">Now</span>' : "") + "<br>" + esc(j.location) + "</p></div>" +
        stats +
        "<ul>" + j.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" +
        "</div></article>";
    }).join("");
    $("#timeline").insertAdjacentHTML("beforeend", html);

    $("#eduGrid").innerHTML = S.education.map(function (e) {
      return '<div class="card edu reveal' + (e.main ? " edu-main" : "") + '"><h4>' + esc(e.school) + "</h4><p>" + esc(e.degree) + "</p>" +
        (e.detail ? '<p class="edu-detail">' + esc(e.detail) + "</p>" : "") +
        (e.extra ? '<p class="edu-extra">' + esc(e.extra) + "</p>" : "") +
        '<p class="when">' + esc(e.dates) + " · " + esc(e.location) + "</p></div>";
    }).join("");
  }

  /* ---- 03 projects ------------------------------------------------------ */
  function renderProjects() {
    var wrap = $("#projectList");
    wrap.innerHTML = S.projects.map(function (p) {
      var link = p.link ? '<div class="project-links"><a class="btn btn-sm btn-primary" href="' + esc(p.link.href) + '" target="_blank" rel="noopener">' + esc(p.link.label) + I.external + "</a></div>" : "";
      var visual = p.visual === "outline"
        ? '<div class="outline"><p class="mini-label">' + esc(p.outlineTitle) + '</p><ol>' +
          p.outline.map(function (o, i) { return '<li><span class="num">' + (i + 1) + "</span><span>" + esc(o) + "</span></li>"; }).join("") + "</ol></div>"
        : "";
      return '<article class="card project reveal" id="' + esc(p.id) + '">' +
        '<div class="project-info"><p class="project-when">' + esc(p.when) + '</p><h3 class="project-title">' + esc(p.title) + "</h3>" +
        '<p class="project-summary">' + esc(p.summary) + "</p>" +
        '<div class="tags">' + p.stack.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div>" +
        link + "</div>" +
        '<div class="demo" data-visual="' + esc(p.visual) + '">' + visual + "</div></article>";
    }).join("");
    $$(".demo", wrap).forEach(function (el) {
      var v = el.getAttribute("data-visual");
      if (v !== "outline" && window.Demos) window.Demos.mount(v, el);
    });
  }

  /* ---- 04 skills -------------------------------------------------------- */
  function renderSkills() {
    $("#skillList").innerHTML = S.skills.map(function (g) {
      return '<div class="skill-row"><h3>' + esc(g.group) + '</h3><div class="tags">' +
        g.items.map(function (s) { return '<span class="tag">' + esc(s) + "</span>"; }).join("") + "</div></div>";
    }).join("");
  }

  /* ---- 05 contact ------------------------------------------------------- */
  function renderContact() {
    $("#contactActions").innerHTML =
      '<a class="btn btn-primary" href="tel:' + esc(S.phoneHref) + '">' + I.phone + esc(S.phone) + "</a>" +
      '<div class="email-pill"><a href="mailto:' + esc(S.email) + '">' + I.mail + esc(S.email) + "</a>" +
      '<button type="button" data-act="copy-email" aria-label="Copy email address">Copy</button></div>' +
      '<a class="btn" href="' + esc(S.linkedin) + '" target="_blank" rel="noopener">' + I.linkedin + "LinkedIn</a>" +
      '<a class="btn" href="' + esc(S.resume) + '" download>' + I.download + "Resume</a>" +
      '<a class="btn btn-social" href="https://github.com/' + esc(S.githubUser) + '" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">' + I.github + "</a>";

    var rows = [
      ["Targeting", "Sales Engineering · Solutions Consulting"],
      ["Graduating", "B.S. Computer Science, CSUSM · May 2027"],
      ["Based in", S.location],
      ["Recent", "Cisco Technical Sales Engineering Intern ('26) · AWS Student Builder Campus Leader"],
      ["Proof", "2× quota and 500+ viewer live streams at a live commerce startup"],
    ];
    $("#tldr").innerHTML = rows.map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
    }).join("") +
      '<div><dt>Phone</dt><dd><a href="tel:' + esc(S.phoneHref) + '">' + esc(S.phone) + "</a></dd></div>" +
      '<div><dt>Email</dt><dd><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></dd></div>";

    $("#footerContact").innerHTML = '<a href="tel:' + esc(S.phoneHref) + '">' + esc(S.phone) + '</a> · <a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>";
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
    renderSkills();
    renderContact();
    $("#year").textContent = new Date().getFullYear();

    document.addEventListener("click", function (e) {
      if (e.target.closest('[data-act="copy-email"]')) copy(S.email, "Email copied");
      if (e.target.closest('[data-act="copy-fit"]')) copy(fitSummaryText(), "Fit summary copied");
    });
    $("#themeBtn").addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

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
