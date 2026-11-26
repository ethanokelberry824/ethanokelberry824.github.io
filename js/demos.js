/* ==========================================================================
   Project demos (sample data only)
   - outreach: mini app walkthrough of the AI Referral Outreach Agent
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
  // name, title, why they showed up, [hiring process, likely to reply, referral weight], overall grade
  var LISTINGS = [
    {
      label: "Early career SA program · Northwind Cloud",
      company: "Northwind Cloud", program: "early career Solutions Architect program", scanned: 18,
      people: [
        ["Marcus Bell", "University Recruiter", "Posted the program opening", [10, 8, 6], 10],
        ["Jordan Lee", "Program Manager, Early Careers", "Runs the program", [9, 7, 7], 9],
        ["Ana Torres", "Senior Solutions Architect", "Went through the program, posts about mentoring", [5, 9, 7], 8],
        ["Priya Shah", "Solutions Architect Manager", "Hires from the program", [7, 5, 9], 7],
        ["Lena Park", "VP of Engineering", "Very senior, rarely replies", [2, 2, 9], 4],
        ["Kevin Ruiz", "Account Executive", "No tie to the program", [1, 5, 3], 3],
      ],
    },
    {
      label: "Presales Academy · Lumen Data",
      company: "Lumen Data", program: "Presales Academy", scanned: 14,
      people: [
        ["Leo Ramirez", "Early Careers Recruiter", "Recruits for the academy", [10, 8, 6], 10],
        ["Dana Brooks", "Solutions Engineer", "Posts about taking calls with students", [4, 10, 6], 9],
        ["Chris Nguyen", "Director of Sales Engineering", "Leads the team the academy feeds", [6, 5, 9], 7],
        ["Ben Adler", "Solutions Engineer", "Left Lumen Data in 2025", [0, 7, 0], 2],
        ["Rosa Kim", "Sales Ops Analyst", "Not connected to presales", [1, 6, 2], 3],
      ],
    },
    {
      label: "Solutions Consultant rotation · Brightpath",
      company: "Brightpath Software", program: "Solutions Consultant rotation", scanned: 16,
      people: [
        ["Tyler Grant", "Campus Recruiting Lead", "Shared the posting", [10, 9, 6], 10],
        ["Erin Cho", "Solutions Consultant", "Finished the rotation last year", [5, 9, 6], 8],
        ["Maya Patel", "Head of Solutions Consulting", "Owns the program", [8, 4, 10], 8],
        ["Sam Whitaker", "Principal Solutions Consultant", "Mentors new hires", [4, 6, 8], 6],
        ["Omar Haddad", "Marketing Manager", "Outside the hiring team", [1, 5, 2], 3],
      ],
    },
  ];
  var CRITERIA = ["Hiring process", "Will reply", "Referral weight"];
  var GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>';

  function outreach(root) {
    root.innerHTML =
      '<div class="app">' +
      '<div class="app-bar"><span class="app-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="app-title">Outreach Agent</span><span class="app-note">Demo · sample data</span></div>' +
      '<div class="app-input"><label class="field"><span>Target program</span><select class="select">' +
      LISTINGS.map(function (l, i) { return '<option value="' + i + '">' + esc(l.label) + "</option>"; }).join("") +
      '</select></label><button type="button" class="btn btn-sm btn-primary" data-act="run">' + PLAY + "<span>Run</span></button></div>" +
      '<ol class="app-steps">' +
      '<li class="app-step" data-s="0"><div class="step-head"><span class="step-n">1</span><b>Scour the web for people tied to it</b><span class="step-s"></span></div>' +
      '<ul class="scan"></ul></li>' +
      '<li class="app-step" data-s="1"><div class="step-head"><span class="step-n">2</span><b>Grade each person</b><span class="step-s"></span></div>' +
      '<p class="grade-key"></p><ul class="grades"></ul></li>' +
      '<li class="app-step" data-s="2"><div class="step-head"><span class="step-n">3</span><b>Draft messages for my approval</b><span class="step-s"></span></div>' +
      '<div class="bar"><span></span></div><div class="mail"></div></li>' +
      "</ol></div>";

    var sel = root.querySelector("select");
    var btn = root.querySelector('[data-act="run"]');
    var steps = root.querySelectorAll(".app-step");
    var scan = root.querySelector(".scan");
    var grades = root.querySelector(".grades");
    var key = root.querySelector(".grade-key");
    var bar = root.querySelector(".bar span");
    var mail = root.querySelector(".mail");
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
      scan.innerHTML = '<li class="scan-empty">Press Run to try it.</li>';
      grades.innerHTML = "";
      key.innerHTML = "";
      bar.style.width = "0%";
      mail.innerHTML = "";
      btn.disabled = false;
      btn.querySelector("span").textContent = "Run";
    }
    function tone(g) { return g >= 9 ? "hi" : g >= 7 ? "mid" : g >= 6 ? "ok" : "low"; }

    function run() {
      reset();
      var L = LISTINGS[+sel.value], plan = [];
      var kept = L.people.filter(function (p) { return p[4] >= 6; });
      var sources = [
        "LinkedIn · who posted the " + L.program + " opening",
        L.company + " careers page · program details",
        "LinkedIn posts that mention the " + L.program,
        L.company + " team pages and past program members",
      ];
      btn.disabled = true;
      btn.querySelector("span").textContent = "Running…";
      scan.innerHTML = "";

      plan.push([150, function () { status(0, "Searching…"); }]);
      sources.forEach(function (src, i) {
        var li;
        plan.push([380, function () {
          li = document.createElement("li");
          li.innerHTML = '<span class="scan-ico">' + GLOBE + '</span><span class="scan-src">' + esc(src) + '</span><span class="scan-n"><i class="dot-spin"></i></span>';
          scan.appendChild(li);
        }]);
        plan.push([420, function () {
          var n = Math.round(L.scanned * (i + 1) / sources.length) - Math.round(L.scanned * i / sources.length);
          li.classList.add("done");
          li.querySelector(".scan-n").textContent = n + " profiles";
          status(0, Math.round(L.scanned * (i + 1) / sources.length) + " profiles scanned");
        }]);
      });
      plan.push([300, function () {
        status(0, L.scanned + " profiles scanned, " + L.people.length + " worth a look", true);
        status(1, "Grading…");
        key.innerHTML = CRITERIA.map(function (c, i) { return '<span><i class="k' + i + '"></i>' + esc(c) + "</span>"; }).join("");
      }]);
      L.people.forEach(function (p) {
        var li;
        plan.push([520, function () {
          li = document.createElement("li");
          li.className = "g-" + tone(p[4]);
          li.innerHTML = '<span class="avatar">' + esc(initials(p[0])) + '</span>' +
            '<span class="who"><b>' + esc(p[0]) + "</b><small>" + esc(p[1]) + " · " + esc(p[2]) + "</small>" +
            '<span class="meters">' + p[3].map(function (v, i) {
              return '<span class="meter" title="' + esc(CRITERIA[i]) + ": " + v + '/10"><i class="k' + i + '" data-w="' + (v * 10) + '"></i></span>';
            }).join("") + "</span></span>" +
            '<span class="grade"><b>–</b><small>/10</small></span>';
          grades.appendChild(li);
          requestAnimationFrame(function () {
            li.querySelectorAll(".meter i").forEach(function (m) { m.style.width = m.getAttribute("data-w") + "%"; });
          });
        }]);
        plan.push([360, function () {
          li.querySelector(".grade b").textContent = p[4];
          li.classList.add("graded");
          if (p[4] < 6) li.insertAdjacentHTML("beforeend", '<span class="skip-tag">Skipped</span>');
        }]);
      });
      plan.push([350, function () {
        status(1, "Kept " + kept.length + " rated 6+, skipped " + (L.people.length - kept.length), true);
        status(2, "Drafting 0 of " + kept.length);
      }]);
      kept.forEach(function (p, k) {
        plan.push([420, function () {
          bar.style.width = ((k + 1) / kept.length) * 100 + "%";
          status(2, "Drafting " + (k + 1) + " of " + kept.length);
          if (k === 0) {
            mail.innerHTML = '<p class="mail-sub">LinkedIn message · ' + esc(p[0]) + " · top pick</p>" +
              "<p>Hi " + esc(p[0].split(" ")[0]) + ", I came across " + esc(L.company) + "'s " + esc(L.program) +
              ". I'm a CS senior at Cal State San Marcos and I interned as a Technical Sales Engineer at Cisco this summer. Would you be open to a quick call about what makes someone stand out for it?</p>";
          }
        }]);
      });
      plan.push([400, function () {
        status(2, kept.length + " drafts waiting for my OK", true);
        mail.insertAdjacentHTML("beforeend", '<p class="mail-hold">' + CHECK + "Nothing sends until I approve it.</p>");
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
