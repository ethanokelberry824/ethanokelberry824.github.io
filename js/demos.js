/* ==========================================================================
   Interactive project demos
   - gpu:      8-GPU ring simulation (from the Cisco AI Infrastructure deck)
   - outreach: simulated run of the Autonomous Internship Outreach Agent
   - mlb:      simulated run of the sports analytics ETL pipeline
   ========================================================================== */
(function () {
  "use strict";

  var ICONS = {
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    sparkles: '<path d="M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    database: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    filter: '<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="10" y="10" width="4" height="4"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
  };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  function bi(tech, biz) {
    return '<span class="t">' + tech + '</span><span class="b">' + biz + "</span>";
  }
  function reducedMotion() {
    return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* ------------------------------------------------------------------------
     GPU ring simulation
     Each training step = compute, then every GPU exchanges results with its
     neighbor around the ring. The step only completes once every link is
     done, so one congested link stalls all eight GPUs.
     Timings are calibrated to the deck's illustrative numbers:
     healthy ≈ 50 steps/min at 90% utilization; congested ≈ 21 steps/min.
     ------------------------------------------------------------------------ */
  function gpu(root) {
    var N = 8;
    var COMPUTE = 0.5;          // seconds of compute per step
    var XFER = 0.7;             // seconds for a healthy link to finish its exchange
    var SLOW = 0.297;           // speed of a congested link relative to healthy
    var BASE = COMPUTE + XFER;  // 1.2 s per step => 50 steps/min

    root.innerHTML =
      '<div class="demo-head"><span class="live"><i></i>Live simulation</span>' +
      '<span class="demo-note">Illustrative numbers, as in the original deck</span></div>' +
      '<div class="gpu-stage"><canvas role="img" aria-label="Eight GPUs in a ring exchanging data. Click a link to congest it."></canvas></div>' +
      '<div class="metrics">' +
      '<div class="metric"><span>Training steps / min</span><strong data-m="steps" class="good">50</strong></div>' +
      '<div class="metric"><span>GPU utilization</span><strong data-m="util" class="good">90%</strong></div>' +
      '<div class="metric"><span>Time to finish job</span><strong data-m="time" class="good">1.0×</strong></div>' +
      "</div>" +
      '<div class="demo-controls"><button type="button" class="btn btn-sm btn-primary" data-act="jam">Congest link 2 ↔ 3</button>' +
      '<span class="demo-hint">or click any link in the ring</span></div>' +
      '<ul class="legend" aria-label="Legend">' +
      '<li><i style="background:var(--accent)"></i>Exchanging data</li>' +
      '<li><i style="background:var(--warn)"></i>Waiting on the network</li>' +
      '<li><i style="background:var(--bad)"></i>Congested</li></ul>' +
      '<p class="demo-caption">' +
      bi(
        "Ring all-reduce: after every step, each GPU swaps results with its neighbor, and the next step can't start until the slowest link finishes. Congest one link and all eight GPUs stall behind it.",
        "Eight very expensive GPUs working on one job. When a single network link slows down, all eight wait, and you're paying for hardware that's sitting idle. That's why the network is part of the AI purchase."
      ) +
      "</p>";

    var canvas = root.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var btn = root.querySelector('[data-act="jam"]');
    var mSteps = root.querySelector('[data-m="steps"]');
    var mUtil = root.querySelector('[data-m="util"]');
    var mTime = root.querySelector('[data-m="time"]');

    var jammed = new Set();
    var phase = "compute";
    var phaseT = 0;
    var progress = new Array(N).fill(0);
    var stepNo = 1;
    var flash = 0;
    var hover = -1;
    var shown = { steps: 50, util: 90, time: 1 };
    var colors = {};
    var W = 0, H = 0, nodes = [], size = 40;
    var running = false, last = 0, raf = 0;

    function readColors() {
      colors = {
        accent: cssVar("--accent"),
        warn: cssVar("--warn"),
        bad: cssVar("--bad"),
        text: cssVar("--text"),
        muted: cssVar("--muted"),
        line: cssVar("--border-strong"),
        node: cssVar("--surface-2"),
        bg: cssVar("--bg-elev"),
        mono: cssVar("--font-mono") || "monospace",
        display: cssVar("--font-display") || "sans-serif",
      };
    }

    function layout() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var R = Math.min(W, H) * 0.37;
      size = Math.max(28, Math.min(44, R * 0.33));
      nodes = [];
      for (var i = 0; i < N; i++) {
        var a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
        nodes.push({ x: W / 2 + R * Math.cos(a), y: H / 2 + R * Math.sin(a) });
      }
    }

    function linkDur(i) { return jammed.has(i) ? XFER / SLOW : XFER; }

    function targets() {
      var dur = COMPUTE + (jammed.size ? XFER / SLOW : XFER);
      return { steps: 60 / dur, util: (90 * BASE) / dur, time: dur / BASE };
    }

    function updateMetrics(dt) {
      var tg = targets();
      var k = Math.min(1, dt * 3.5);
      shown.steps += (tg.steps - shown.steps) * k;
      shown.util += (tg.util - shown.util) * k;
      shown.time += (tg.time - shown.time) * k;
      mSteps.textContent = Math.round(shown.steps);
      mUtil.textContent = Math.round(shown.util) + "%";
      mTime.textContent = shown.time.toFixed(1) + "×";
      var cls = jammed.size ? "bad" : "good";
      [mSteps, mUtil, mTime].forEach(function (el) { el.className = cls; });
    }

    function tick(dt) {
      phaseT += dt;
      if (flash > 0) flash = Math.max(0, flash - dt * 1.6);
      if (phase === "compute") {
        if (phaseT >= COMPUTE) { phase = "comm"; phaseT = 0; progress.fill(0); }
      } else {
        var allDone = true;
        for (var i = 0; i < N; i++) {
          progress[i] = Math.min(1, progress[i] + dt / linkDur(i));
          if (progress[i] < 1) allDone = false;
        }
        if (allDone) { phase = "compute"; phaseT = 0; stepNo++; flash = 1; }
      }
    }

    function edgePoints(i) {
      var a = nodes[i], b = nodes[(i + 1) % N];
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
      var off = size * 0.62;
      return {
        x1: a.x + (dx / len) * off, y1: a.y + (dy / len) * off,
        x2: b.x - (dx / len) * off, y2: b.y - (dy / len) * off,
      };
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, e, k;

      // links
      for (i = 0; i < N; i++) {
        e = edgePoints(i);
        var jam = jammed.has(i);
        ctx.save();
        if (i === hover) {
          ctx.strokeStyle = jam ? colors.bad : colors.accent;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 12;
          ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.lineWidth = jam ? 3 : 2;
        ctx.strokeStyle = jam ? colors.bad : colors.line;
        if (jam) ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke();
        ctx.restore();

        // packets in flight
        if (phase === "comm" && progress[i] < 1) {
          var col = jam ? colors.bad : colors.accent;
          ctx.save();
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 10;
          for (k = 0; k < 3; k++) {
            var q = progress[i] * 1.5 - k * 0.25;
            if (q <= 0 || q >= 1) continue;
            ctx.beginPath();
            ctx.arc(e.x1 + (e.x2 - e.x1) * q, e.y1 + (e.y2 - e.y1) * q, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
          if (jam) {
            // backlog piling up at the sender
            var dx = (e.x2 - e.x1), dy = (e.y2 - e.y1), len = Math.hypot(dx, dy);
            var nx = -dy / len, ny = dx / len;
            for (k = 0; k < 4; k++) {
              var t = 0.06 + (k % 2) * 0.05;
              var s = (k < 2 ? -1 : 1) * 5 + Math.sin(performance.now() / 120 + k) * 1.2;
              ctx.beginPath();
              ctx.arc(e.x1 + dx * t + nx * s, e.y1 + dy * t + ny * s, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      }

      // GPUs
      for (i = 0; i < N; i++) {
        var n = nodes[i];
        var left = (i + N - 1) % N, right = i;
        var linksDone = progress[left] >= 1 && progress[right] >= 1;
        var stalled = phase === "comm" && ((jammed.has(left) && progress[left] < 1) || (jammed.has(right) && progress[right] < 1));
        var waiting = phase === "comm" && linksDone;
        var stroke = colors.accent, fillA = 0.12, fillC = colors.accent;
        if (stalled) { stroke = colors.bad; fillC = colors.bad; fillA = 0.14; }
        else if (waiting) { stroke = colors.warn; fillC = colors.warn; fillA = 0.22; }
        else if (phase === "compute") { fillA = 0.12 + 0.2 * Math.sin((phaseT / COMPUTE) * Math.PI); }

        var x = n.x - size / 2, y = n.y - size / 2;
        ctx.save();
        roundRect(x, y, size, size, size * 0.24);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.globalAlpha = fillA;
        ctx.fillStyle = fillC;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = stroke;
        ctx.stroke();
        if (phase === "compute") {
          ctx.fillStyle = colors.accent;
          ctx.fillRect(x + 6, y + size - 7, (size - 12) * Math.min(1, phaseT / COMPUTE), 2.5);
        }
        ctx.fillStyle = colors.text;
        ctx.font = "600 " + Math.round(size * 0.38) + "px " + colors.display;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1), n.x, n.y - 1);
        ctx.restore();
      }

      // centre: step counter
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (flash > 0) {
        ctx.strokeStyle = colors.accent;
        ctx.globalAlpha = flash * 0.7;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, 26 + (1 - flash) * 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = colors.muted;
      ctx.font = "500 10px " + colors.mono;
      ctx.fillText("TRAINING STEP", W / 2, H / 2 - 17);
      ctx.fillStyle = colors.text;
      ctx.font = "700 28px " + colors.display;
      ctx.fillText(String(stepNo), W / 2, H / 2 + 8);
      ctx.restore();
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      tick(dt);
      updateMetrics(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    function syncButton() {
      btn.textContent = jammed.size ? "Clear congestion" : "Congest link 2 ↔ 3";
    }
    function toggle(i) {
      if (jammed.has(i)) jammed.delete(i); else jammed.add(i);
      syncButton();
      if (!running) { updateMetrics(1); draw(); }
    }

    btn.addEventListener("click", function () {
      if (jammed.size) jammed.clear(); else jammed.add(1); // link between GPU 2 and GPU 3
      syncButton();
      if (!running) { updateMetrics(1); draw(); }
    });

    function linkAt(evt) {
      var r = canvas.getBoundingClientRect();
      var px = evt.clientX - r.left, py = evt.clientY - r.top;
      var best = -1, bestD = 16;
      for (var i = 0; i < N; i++) {
        var e = edgePoints(i);
        var vx = e.x2 - e.x1, vy = e.y2 - e.y1;
        var t = Math.max(0, Math.min(1, ((px - e.x1) * vx + (py - e.y1) * vy) / (vx * vx + vy * vy)));
        var d = Math.hypot(px - (e.x1 + vx * t), py - (e.y1 + vy * t));
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    }
    canvas.addEventListener("pointermove", function (e) {
      hover = linkAt(e);
      canvas.style.cursor = hover >= 0 ? "pointer" : "default";
    });
    canvas.addEventListener("pointerleave", function () { hover = -1; });
    canvas.addEventListener("click", function (e) {
      var i = linkAt(e);
      if (i >= 0) toggle(i);
    });

    readColors();
    layout();
    draw();

    new MutationObserver(function () { readColors(); if (!running) draw(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-mode"] });
    if ("ResizeObserver" in window) new ResizeObserver(function () { layout(); if (!running) draw(); }).observe(canvas);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { readColors(); if (!running) draw(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0.1 }).observe(canvas);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
    });
  }

  /* ------------------------------------------------------------------------
     Pipeline runner (shared by the outreach and MLB demos)
     ------------------------------------------------------------------------ */
  function pipeline(root, def) {
    var n = def.stages.length;
    var stagesHtml = def.stages.map(function (s, i) {
      return '<div class="stage" data-i="' + i + '"><span class="stage-dot">' + icon(s.icon) + '</span><span class="stage-name">' + s.name + "</span></div>";
    }).join("");
    var select = "";
    if (def.inputs) {
      select = '<label class="sr-only" for="' + def.id + '-in">' + def.inputLabel + "</label>" +
        '<select class="select" id="' + def.id + '-in">' +
        def.inputs.map(function (inp, i) { return '<option value="' + i + '">' + inp.label + "</option>"; }).join("") +
        "</select>";
    }

    root.innerHTML =
      '<div class="demo-head"><span class="live"><i></i>Interactive demo</span>' +
      '<span class="demo-note">' + def.note + "</span></div>" +
      '<div class="pipe" style="--n:' + n + '"><div class="pipe-track"><span></span><b class="pipe-packet"></b></div>' + stagesHtml + "</div>" +
      '<div class="demo-controls">' + select +
      '<button type="button" class="btn btn-sm btn-primary" data-act="run">' + PLAY + "<span>Run pipeline</span></button></div>" +
      '<div class="console" role="log" aria-live="polite"></div>' +
      '<div class="result-slot"></div>';

    var pipe = root.querySelector(".pipe");
    var stageEls = root.querySelectorAll(".stage");
    var out = root.querySelector(".console");
    var slot = root.querySelector(".result-slot");
    var runBtn = root.querySelector('[data-act="run"]');
    var sel = root.querySelector("select");
    var timers = [];
    var t0 = 0;

    function setP(p) { pipe.style.setProperty("--p", p); }
    function stamp() {
      var s = ((performance.now() - t0) / 1000).toFixed(2);
      return (s.length < 5 ? "0" : "") + s + "s";
    }
    function log(html) {
      var ln = document.createElement("div");
      ln.className = "ln";
      ln.innerHTML = '<span class="ts">' + stamp() + "</span><span>" + html + "</span>";
      out.appendChild(ln);
      out.scrollTop = out.scrollHeight;
    }
    function reset() {
      timers.forEach(clearTimeout);
      timers = [];
      out.innerHTML = "";
      slot.innerHTML = "";
      stageEls.forEach(function (el) { el.classList.remove("active", "done"); });
      setP(0);
    }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function run() {
      reset();
      var input = def.inputs ? def.inputs[+sel.value] : null;
      var steps = def.steps(input);
      var fast = reducedMotion();
      var gap = fast ? 120 : 850;
      t0 = performance.now();
      pipe.classList.add("running");
      runBtn.disabled = true;
      runBtn.querySelector("span").textContent = "Running…";
      log('<span class="dim">' + bi(def.startTech, def.startBiz) + "</span>");

      steps.forEach(function (st, i) {
        later(function () {
          stageEls.forEach(function (el, j) {
            el.classList.toggle("active", j === i);
            if (j < i) el.classList.add("done");
          });
          setP(n > 1 ? i / (n - 1) : 1);
          log('<span class="key">[' + def.stages[i].name.toLowerCase() + "]</span> " + bi(st.tech, st.biz));
        }, gap * i + 150);
      });

      later(function () {
        stageEls.forEach(function (el) { el.classList.remove("active"); el.classList.add("done"); });
        pipe.classList.remove("running");
        log('<span class="ok">✓ ' + bi(def.doneTech(input), def.doneBiz(input)) + "</span>");
        slot.innerHTML = def.result(input);
        runBtn.disabled = false;
        runBtn.querySelector("span").textContent = "Run again";
      }, gap * steps.length + 150);
    }

    runBtn.addEventListener("click", run);
    if (sel) sel.addEventListener("change", function () {
      reset();
      runBtn.querySelector("span").textContent = "Run pipeline";
    });
  }

  /* ------------------------------------------------------------------------
     Demo definitions (sample data only; .example domains are reserved)
     ------------------------------------------------------------------------ */
  var LISTINGS = [
    { label: "Solutions Engineer Intern · Northwind Cloud", company: "Northwind Cloud", domain: "northwind-cloud.example", title: "Solutions Engineer Intern", found: 18, sent: 15, to: "Jordan", toRole: "Director of Solutions Engineering" },
    { label: "Sales Engineering Intern · Lumen Data", company: "Lumen Data", domain: "lumendata.example", title: "Sales Engineering Intern", found: 7, sent: 7, to: "Priya", toRole: "Sales Engineering Manager" },
    { label: "Associate Solutions Consultant · Brightpath", company: "Brightpath Software", domain: "brightpath.example", title: "Associate Solutions Consultant", found: 23, sent: 15, to: "Marcus", toRole: "VP, Solutions Consulting" },
  ];

  var outreach = {
    id: "outreach",
    note: "Simulated run · sample data · no emails are sent",
    inputLabel: "Sample job listing",
    inputs: LISTINGS,
    stages: [
      { name: "Listing", icon: "doc" },
      { name: "Parse", icon: "scan" },
      { name: "Hunter.io", icon: "search" },
      { name: "Gemini", icon: "sparkles" },
      { name: "Gmail", icon: "send" },
    ],
    startTech: "scenario.run() · 7 modules · trigger=new_listing",
    startBiz: "New job listing dropped in. Starting the agent…",
    steps: function (L) {
      return [
        { tech: "webhook ← listing (" + L.title + ")", biz: "Received the job listing" },
        { tech: 'extract → domain="' + L.domain + '", title="' + L.title + '"', biz: "Identified the company (" + L.company + ") and the role" },
        { tech: "GET api.hunter.io/v2/domain-search?domain=" + L.domain + " → 200 · " + L.found + " verified contacts", biz: "Found " + L.found + " verified people to contact at " + L.company },
        { tech: "gemini.generate(profile + contact + role) × " + L.sent + " → " + L.sent + " drafts", biz: "Wrote " + L.sent + " personalized emails, one per person" },
        { tech: "gmail.messages.send × " + L.sent + " → queued (simulated)", biz: "Sent " + L.sent + " emails with zero manual steps (simulated)" },
      ];
    },
    doneTech: function (L) { return "done · " + L.sent + "/" + L.sent + " dispatched · cap=15/request"; },
    doneBiz: function (L) { return "Done. One listing in, " + L.sent + " tailored emails out."; },
    result: function (L) {
      return '<div class="result"><div class="result-head"><span>Sample draft · 1 of ' + L.sent + "</span><b>Generated by Gemini (simulated)</b></div>" +
        "<h5>Subject: " + L.title + " at " + L.company + ": a quick note from a CSUSM CS student</h5>" +
        "<p>Hi " + L.to + ", I saw " + L.company + " is hiring a " + L.title + ". As " + L.toRole + ", you'd know best what makes someone great on your team, so I wanted to reach out directly.</p>" +
        "<p>I'm a Computer Science student at Cal State San Marcos who loves explaining technical products to the people who buy them. Would you be open to a 15-minute call?</p></div>";
    },
  };

  var mlb = {
    id: "mlb",
    note: "Simulated run · illustrative output, not a real projection",
    stages: [
      { name: "Ingest", icon: "database" },
      { name: "Clean", icon: "filter" },
      { name: "Features", icon: "layers" },
      { name: "Model", icon: "cpu" },
      { name: "Report", icon: "chart" },
    ],
    startTech: "cron 06:00 · etl.run(season=2024)",
    startBiz: "Scheduled run starting. Nobody has to press a button.",
    steps: function () {
      return [
        { tech: "GET /games?season=2024 (public REST API) → 2,430 games", biz: "Pulled a full season of game history" },
        { tech: "dedupe · cast types · handle nulls · validate keys → clean table", biz: "Cleaned up and checked the raw data" },
        { tech: "rolling form, pitching splits, home/away → feature matrix", biz: "Turned raw stats into signals: recent form, pitching, home field" },
        { tech: "model.predict(next_slate) → win probabilities", biz: "Scored tomorrow's games" },
        { tech: "render(report, metrics, assumptions, limitations) → email", biz: "Sent a plain-English report, with assumptions and limits spelled out" },
      ];
    },
    doneTech: function () { return "pipeline complete · report delivered"; },
    doneBiz: function () { return "Done. Projections delivered on schedule."; },
    result: function () {
      return '<div class="result"><div class="result-head"><span>Daily projections report</span><b>Illustrative</b></div>' +
        "<dl><dt>Matchup</dt><dd>Padres at Dodgers</dd>" +
        "<dt>Projection</dt><dd>Dodgers 54% · Padres 46%</dd>" +
        "<dt>Drivers</dt><dd>Recent form, starting pitching, home field</dd>" +
        "<dt>Assumes</dt><dd>Probable starters confirmed, no late lineup changes</dd>" +
        "<dt>Limits</dt><dd>Single games are noisy. Treat this as a probability, not a pick.</dd></dl></div>";
    },
  };

  window.Demos = {
    mount: function (type, el) {
      if (type === "gpu") return gpu(el);
      if (type === "outreach") return pipeline(el, outreach);
      if (type === "mlb") return pipeline(el, mlb);
    },
  };
})();
