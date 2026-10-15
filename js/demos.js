/* ==========================================================================
   Project demos (sample data only)
   - outreach: mini app walkthrough of the Internship Outreach Agent
   - fantasy:  chat with the Fantasy Baseball Pickup Agent
   Both play once when scrolled into view, then can be replayed.
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

  // Play once when the demo is mostly on screen.
  function autoplay(el, play) {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); play(); }
    }, { threshold: 0.55 });
    io.observe(el);
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
      '<li class="app-step" data-s="2"><div class="step-head"><span class="step-n">3</span><b>Send</b><span class="step-s"></span></div></li>' +
      "</ol></div>";

    var sel = root.querySelector("select");
    var btn = root.querySelector('[data-act="run"]');
    var steps = root.querySelectorAll(".app-step");
    var people = root.querySelector(".people");
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
      people.innerHTML = '<li class="people-empty">Press Run to try it.</li>';
      bar.style.width = "0%";
      mail.innerHTML = "";
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
      plan.push([300, function () { status(2, "Sending…"); }]);
      for (var j = 0; j < n; j++) {
        (function (j) {
          plan.push([330, function () {
            var li = people.children[j];
            if (li) li.querySelector(".tag-ok").outerHTML = '<span class="tag-sent">' + CHECK + "Sent</span>";
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
    autoplay(root, run);
  }

  /* ------------------------------------------------------------------------
     Fantasy Baseball Pickup Agent
     ------------------------------------------------------------------------ */
  function fantasy(root) {
    root.innerHTML =
      '<div class="app chat">' +
      '<div class="app-bar"><span class="app-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="app-title">Pickup Agent</span><span class="app-note">Demo · sample data</span></div>' +
      '<div class="chat-body" aria-live="polite"></div>' +
      '<div class="chat-foot"><button type="button" class="btn btn-sm btn-primary" data-act="ask">' + PLAY + "<span>Ask the agent</span></button></div>" +
      "</div>";

    var body = root.querySelector(".chat-body");
    var btn = root.querySelector('[data-act="ask"]');
    var cancel = function () {};

    function add(html, cls) {
      var d = document.createElement("div");
      d.className = "msg " + cls;
      d.innerHTML = html;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }

    function run() {
      cancel();
      body.innerHTML = "";
      btn.disabled = true;
      btn.querySelector("span").textContent = "Thinking…";
      var work, plan = [];
      var checks = [
        "Pulled today's probable starters from the MLB API",
        "Checked each pitcher's last 3 starts",
        "Compared home and away splits",
        "Looked at how each opponent hits",
      ];
      plan.push([200, function () { add("Who should I pick up today? My pitching is thin this week and I have no idea who's good.", "me"); }]);
      plan.push([700, function () { work = add('<span class="typing"><i></i><i></i><i></i></span>', "bot"); }]);
      plan.push([700, function () { work.innerHTML = '<ul class="checks-live"></ul>'; }]);
      checks.forEach(function (c) {
        plan.push([620, function () {
          var li = document.createElement("li");
          li.innerHTML = CHECK + esc(c);
          work.querySelector("ul").appendChild(li);
          body.scrollTop = body.scrollHeight;
        }]);
      });
      plan.push([800, function () {
        add(
          '<p class="pick-head">Pick up <b>Sam Ortega</b> (SP)</p>' +
          '<dl class="pick"><dt>Today</dt><dd>vs. COL, at home</dd><dt>Last 3 starts</dt><dd>2.31 ERA, 21 strikeouts</dd><dt>Projected</dt><dd><b>17.8</b> fantasy points</dd></dl>' +
          '<p class="pick-alt">Backup: Ben Calloway, 14.2 projected points</p>',
          "bot answer"
        );
        btn.disabled = false;
        btn.querySelector("span").textContent = "Ask again";
      }]);
      cancel = timeline(plan);
    }

    btn.addEventListener("click", run);
    body.innerHTML = '<p class="chat-empty">Press "Ask the agent" to see how it picks a player.</p>';
    autoplay(root, run);
  }

  window.Demos = {
    mount: function (type, el) {
      if (type === "outreach") return outreach(el);
      if (type === "fantasy") return fantasy(el);
    },
  };
})();
