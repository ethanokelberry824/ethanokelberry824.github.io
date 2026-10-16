/* ==========================================================================
   Project demos (sample data only)
   - outreach: mini app walkthrough of the Internship Outreach Agent
   - fantasy:  chat with the Fantasy Baseball Pickup Agent
   Both start when the visitor presses the button.
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fast() {
    return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function initials(name) {
    return name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2);
  }

  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>';
  var PLANE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

  // Runs a list of [delayMs, fn] steps; returns a cancel function.
  function timeline(steps) {
    var timers = [], t = 0, scale = fast() ? 0.15 : 1;
    steps.forEach(function (s) {
      t += s[0] * scale;
      timers.push(setTimeout(s[1], t));
    });
    return function () { timers.forEach(clearTimeout); };
  }

  /* ------------------------------------------------------------------------
     Outreach Agent
     ------------------------------------------------------------------------ */
  var LISTINGS = [
    {
      label: "Solutions Engineer Intern · Northwind Cloud",
      company: "Northwind Cloud", domain: "northwind-cloud.example", title: "Solutions Engineer Intern",
      people: [
        ["Jordan Lee", "Director of Solutions Engineering"],
        ["Priya Shah", "Sales Engineering Manager"],
        ["Ana Torres", "Senior Solutions Engineer"],
        ["Marcus Bell", "University Recruiter"],
      ],
    },
    {
      label: "Sales Engineering Intern · Lumen Data",
      company: "Lumen Data", domain: "lumendata.example", title: "Sales Engineering Intern",
      people: [
        ["Chris Nguyen", "VP of Sales Engineering"],
        ["Dana Brooks", "Solutions Architect"],
        ["Leo Ramirez", "Early Careers Recruiter"],
      ],
    },
    {
      label: "Associate Solutions Consultant · Brightpath",
      company: "Brightpath Software", domain: "brightpath.example", title: "Associate Solutions Consultant",
      people: [
        ["Maya Patel", "Head of Solutions Consulting"],
        ["Sam Whitaker", "Principal Solutions Consultant"],
        ["Erin Cho", "Solutions Consultant"],
        ["Tyler Grant", "Campus Recruiting Lead"],
      ],
    },
  ];

  function outreach(root) {
    root.innerHTML =
      '<div class="app">' +
      '<div class="app-bar"><span class="app-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="app-title">Outreach Agent</span><span class="app-note">Demo · sample data</span></div>' +
      '<div class="app-input"><label class="field"><span>Job listing</span><select class="select">' +
      LISTINGS.map(function (l, i) { return '<option value="' + i + '">' + esc(l.label) + "</option>"; }).join("") +
      '</select></label><button type="button" class="btn btn-sm btn-primary" data-act="run">' + PLAY + "<span>Run</span></button></div>" +
      '<ol class="app-steps">' +
      '<li class="app-step" data-s="0"><div class="step-head"><span class="step-n">1</span><b>Find the right people</b><span class="step-s"></span></div><ul class="people"></ul></li>' +
      '<li class="app-step" data-s="1"><div class="step-head"><span class="step-n">2</span><b>Write a personal email to each one</b><span class="step-s"></span></div><div class="bar"><span></span></div><div class="mail"></div></li>' +
      '<li class="app-step" data-s="2"><div class="step-head"><span class="step-n">3</span><b>Send</b><span class="step-s"></span></div><ul class="outbox"></ul></li>' +
      "</ol></div>";

    var sel = root.querySelector("select");
    var btn = root.querySelector('[data-act="run"]');
    var steps = root.querySelectorAll(".app-step");
    var people = root.querySelector(".people");
    var bar = root.querySelector(".bar span");
    var mail = root.querySelector(".mail");
    var outbox = root.querySelector(".outbox");
    var cancel = function () {};

    function status(i, text, done) {
      var s = steps[i];
      s.classList.add("on");
      s.classList.toggle("done", !!done);
      s.querySelector(".step-s").innerHTML = done ? CHECK + esc(text) : '<i class="dot-spin"></i>' + esc(text);
    }
    function reset() {
      cancel();
      steps.forEach(function (s) { s.classList.remove("on", "done"); s.querySelector(".step-s").innerHTML = ""; });
      people.innerHTML = '<li class="people-empty">Press Run to try it.</li>';
      bar.style.width = "0%";
      mail.innerHTML = "";
      outbox.innerHTML = "";
      btn.disabled = false;
      btn.querySelector("span").textContent = "Run";
    }

    function run() {
      reset();
      var L = LISTINGS[+sel.value], n = L.people.length, plan = [];
      btn.disabled = true;
      btn.querySelector("span").textContent = "Running…";
      people.innerHTML = "";

      plan.push([150, function () { status(0, "Searching " + L.domain + "…"); }]);
      L.people.forEach(function (p) {
        plan.push([520, function () {
          var li = document.createElement("li");
          li.innerHTML = '<span class="avatar">' + esc(initials(p[0])) + "</span><span class=\"who\"><b>" + esc(p[0]) + "</b><small>" + esc(p[1]) + '</small></span><span class="tag-ok">Verified</span>';
          people.appendChild(li);
        }]);
      });
      plan.push([350, function () { status(0, "Found " + n + " people", true); status(1, "Writing 0 of " + n); }]);
      for (var k = 1; k <= n; k++) {
        (function (k) {
          plan.push([420, function () {
            bar.style.width = (k / n) * 100 + "%";
            status(1, k === n ? n + " emails written" : "Writing " + k + " of " + n, k === n);
            if (k === 1) {
              var p = L.people[0];
              mail.innerHTML = "<p class=\"mail-sub\">Subject: " + esc(L.title) + " at " + esc(L.company) + "</p>" +
                "<p>Hi " + esc(p[0].split(" ")[0]) + ", I saw " + esc(L.company) + " is hiring a " + esc(L.title) +
                ". I'm a Computer Science student at Cal State San Marcos who likes explaining technical products to the people who buy them. Would you be open to a quick call?</p>";
            }
          }]);
        })(k);
      }
      plan.push([300, function () { status(2, "Sending 0 of " + n); }]);
      for (var j = 0; j < n; j++) {
        (function (j) {
          var p = L.people[j], row;
          plan.push([200, function () {
            row = document.createElement("li");
            row.innerHTML = '<span class="env">' + PLANE + '</span><span class="out-to"><b>To ' + esc(p[0]) + "</b><small>" +
              esc(L.title) + " at " + esc(L.company) + '</small></span><span class="out-state">Sending…</span>';
            outbox.appendChild(row);
          }]);
          plan.push([520, function () {
            row.classList.add("sent");
            row.querySelector(".out-state").outerHTML = '<span class="tag-sent">' + CHECK + "Sent</span>";
            status(2, j + 1 === n ? "" : "Sending " + (j + 1) + " of " + n);
          }]);
        })(j);
      }
      plan.push([250, function () {
        status(2, n + " personal emails sent", true);
        btn.disabled = false;
        btn.querySelector("span").textContent = "Run again";
      }]);
      cancel = timeline(plan);
    }

    btn.addEventListener("click", run);
    sel.addEventListener("change", reset);
    reset();
  }

  /* ------------------------------------------------------------------------
     Fantasy Baseball Pickup Agent
     Story: look up today's projected stat lines, check who's already
     rostered in my league, hand back the top options to pick up.
     ------------------------------------------------------------------------ */
  var PITCHERS = [
    // name, matchup, IP, K, ER, projected points, rostered in my league?
    ["Marco Diaz", "vs. PIT", "6.2", 9, 1, 21.4, true],
    ["Luis Varela", "vs. MIA", "6.0", 8, 2, 18.6, true],
    ["Sam Ortega", "vs. COL", "6.1", 7, 2, 17.8, false],
    ["Ben Calloway", "@ KC", "5.2", 6, 2, 14.2, false],
    ["Drew Hollins", "vs. CWS", "6.0", 6, 3, 13.5, false],
    ["Kyle Brandt", "@ SEA", "5.0", 4, 3, 9.1, false],
  ];

  function fantasy(root) {
    root.innerHTML =
      '<div class="app">' +
      '<div class="app-bar"><span class="app-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="app-title">Pickup Agent</span><span class="app-note">Demo · sample data</span></div>' +
      '<div class="app-input"><div class="field"><span>Daily run</span><span class="today">Today\'s starting pitchers · My league</span></div>' +
      '<button type="button" class="btn btn-sm btn-primary" data-act="run">' + PLAY + "<span>Run</span></button></div>" +
      '<ol class="app-steps">' +
      '<li class="app-step" data-s="0"><div class="step-head"><span class="step-n">1</span><b>Look up projected stat lines</b><span class="step-s"></span></div>' +
      '<div class="ptable" role="table" aria-label="Projected pitcher stat lines"><div class="prow phead" role="row"><span>Pitcher</span><span>IP</span><span>K</span><span>ER</span><span>Pts</span><span></span></div></div></li>' +
      '<li class="app-step" data-s="1"><div class="step-head"><span class="step-n">2</span><b>Check who\'s rostered in my league</b><span class="step-s"></span></div></li>' +
      '<li class="app-step" data-s="2"><div class="step-head"><span class="step-n">3</span><b>Email me the top options</b><span class="step-s"></span></div>' +
      '<div class="pmail"><div class="pmail-head"><span class="env">' + PLANE + '</span><span class="out-to"><b class="mail-subj"></b><small>From: Pickup Agent · To: Ethan</small></span><span class="out-state"></span></div><div class="mail-body"></div></div></li>' +
      "</ol></div>";

    var btn = root.querySelector('[data-act="run"]');
    var steps = root.querySelectorAll(".app-step");
    var table = root.querySelector(".ptable");
    var mailBody = root.querySelector(".mail-body");
    var pmail = root.querySelector(".pmail");
    var cancel = function () {};

    function status(i, text, done) {
      var s = steps[i];
      s.classList.add("on");
      s.classList.toggle("done", !!done);
      s.querySelector(".step-s").innerHTML = done ? CHECK + esc(text) : '<i class="dot-spin"></i>' + esc(text);
    }
    function reset() {
      cancel();
      steps.forEach(function (s) { s.classList.remove("on", "done"); s.querySelector(".step-s").innerHTML = ""; });
      table.querySelectorAll(".prow:not(.phead)").forEach(function (r) { r.remove(); });
      table.classList.remove("filled");
      mailBody.innerHTML = "";
      pmail.classList.remove("show", "sent");
      pmail.querySelector(".out-state").innerHTML = "";
      btn.disabled = false;
      btn.querySelector("span").textContent = "Run";
    }

    function run() {
      reset();
      btn.disabled = true;
      btn.querySelector("span").textContent = "Running…";
      var rows = [], plan = [];
      var available = PITCHERS.filter(function (p) { return !p[6]; });

      plan.push([150, function () { status(0, "Pulling today's starters…"); table.classList.add("filled"); }]);
      PITCHERS.forEach(function (p) {
        plan.push([380, function () {
          var r = document.createElement("div");
          r.className = "prow";
          r.setAttribute("role", "row");
          r.innerHTML = '<span class="pname"><b>' + esc(p[0]) + "</b><small>" + esc(p[1]) + "</small></span><span>" + p[2] + "</span><span>" + p[3] +
            "</span><span>" + p[4] + '</span><span class="pts">' + p[5].toFixed(1) + '</span><span class="pstate"></span>';
          table.appendChild(r);
          rows.push(r);
        }]);
      });
      plan.push([400, function () { status(0, PITCHERS.length + " pitchers projected", true); status(1, "Checking my league…"); }]);
      PITCHERS.forEach(function (p, k) {
        plan.push([330, function () {
          var r = rows[k];
          r.classList.add(p[6] ? "taken" : "open");
          r.querySelector(".pstate").innerHTML = p[6] ? '<span class="tag-taken">Rostered</span>' : '<span class="tag-sent">' + CHECK + "Available</span>";
        }]);
      });
      var best = available[0], others = available.slice(1, 4);
      function line(html, cls) {
        return function () {
          var el = document.createElement(cls === "list" ? "ol" : "div");
          el.className = "mail-line " + (cls || "");
          el.innerHTML = html;
          mailBody.appendChild(el);
        };
      }
      plan.push([450, function () {
        status(1, available.length + " still available", true);
        status(2, "Writing the email…");
        pmail.querySelector(".mail-subj").textContent = "Your pickup for today: " + best[0];
        pmail.classList.add("show");
      }]);
      plan.push([400, line("Hey Ethan,")]);
      plan.push([450, line("Today you should pick up <b>" + esc(best[0]) + "</b>. He's pitching " + esc(best[1]) +
        " and he's still available in your league. Here's his projected stat line:")]);
      plan.push([450, line(
        '<span><small>IP</small><b>' + best[2] + "</b></span><span><small>K</small><b>" + best[3] +
        "</b></span><span><small>ER</small><b>" + best[4] + '</b></span><span class="statline-pts"><small><i class="hide-sm">Fantasy </i>pts</small><b>' + best[5].toFixed(1) + "</b></span>",
        "statline")]);
      plan.push([450, line("If he gets picked up first, here are your other options:")]);
      plan.push([450, line(others.map(function (p) {
        return "<li><b>" + esc(p[0]) + "</b> " + esc(p[1]) + '<span class="mail-dim"> · ' + p[2] + " IP, " + p[3] + " K, " + p[4] + " ER · </span><b>" + p[5].toFixed(1) + " pts</b></li>";
      }).join(""), "list")]);
      plan.push([400, line("Good luck today,<br>Pickup Agent", "sign")]);
      plan.push([500, function () {
        status(2, "Sending…");
        pmail.querySelector(".out-state").textContent = "Sending…";
      }]);
      plan.push([700, function () {
        pmail.classList.add("sent");
        pmail.querySelector(".out-state").outerHTML = '<span class="tag-sent">' + CHECK + "Sent to my inbox</span>";
        status(2, "Emailed", true);
        btn.disabled = false;
        btn.querySelector("span").textContent = "Run again";
      }]);
      cancel = timeline(plan);
    }

    btn.addEventListener("click", run);
    reset();
  }

  window.Demos = {
    mount: function (type, el) {
      if (type === "outreach") return outreach(el);
      if (type === "fantasy") return fantasy(el);
    },
  };
})();
