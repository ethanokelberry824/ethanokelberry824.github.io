/* ==========================================================================
   Terminal: drive the site from a command line (press ` to open)
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(s, n) { s = String(s); return s + new Array(Math.max(1, n - s.length + 1)).join(" "); }

  // Draw lines inside a box, padded so the right edge always lines up.
  function box(lines) {
    var w = Math.max.apply(null, lines.map(function (l) { return l.length; })) + 4;
    var bar = new Array(w + 1).join("─");
    return "┌" + bar + "┐\n" + lines.map(function (l) { return "│  " + pad(l, w - 2) + "│"; }).join("\n") + "\n└" + bar + "┘";
  }

  var SECTIONS = ["discovery", "experience", "demos", "toolkit", "github", "contact"];

  function init(S, app) {
    var overlay = document.getElementById("termOverlay");
    var out = document.getElementById("termOut");
    var form = document.getElementById("termForm");
    var input = document.getElementById("termInput");
    var body = document.getElementById("termBody");
    var closeBtn = document.getElementById("termClose");
    var history = [], hIdx = 0, greeted = false, lastFocus = null;

    function print(html) {
      var pre = document.createElement("pre");
      pre.innerHTML = html;
      out.appendChild(pre);
      body.scrollTop = body.scrollHeight;
    }
    function link(href, label) {
      var ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
      return '<a href="' + esc(href) + '"' + ext + ">" + esc(label || href) + "</a>";
    }
    function mode() { return document.documentElement.getAttribute("data-mode"); }

    var COMMANDS = {
      help: {
        desc: "List commands",
        run: function () {
          var rows = Object.keys(COMMANDS).filter(function (k) { return !COMMANDS[k].hidden; })
            .map(function (k) { return '  <span class="c-acc">' + pad(k, 12) + "</span>" + esc(COMMANDS[k].desc); });
          print("Available commands:\n" + rows.join("\n") + '\n\n<span class="c-dim">Tip: Tab autocompletes, ↑/↓ browse history, Esc closes.</span>');
        },
      },
      whoami: {
        desc: "Who is Ethan?",
        run: function () {
          print('<span class="c-b">' + esc(S.name) + "</span>\n" +
            esc(S.headline) + "\n\n" + esc(S.summary[mode()] || S.summary.tech) + "\n\n" +
            '<span class="c-ok">● ' + esc(S.status) + "</span>");
        },
      },
      experience: {
        desc: "Work history",
        run: function () {
          print(S.experience.map(function (j) {
            return '<span class="c-b">' + esc(j.role) + "</span> @ " + esc(j.company) + '\n<span class="c-dim">' + esc(j.dates) + " · " + esc(j.location) + "</span>\n" +
              j.bullets.map(function (b) { return "  - " + esc(b); }).join("\n");
          }).join("\n\n"));
        },
      },
      projects: {
        desc: "Things I've built",
        run: function () {
          print(S.projects.map(function (p, i) {
            return '<span class="c-acc">[' + (i + 1) + ']</span> <span class="c-b">' + esc(p.title) + '</span> <span class="c-dim">(' + esc(p.when) + ")</span>\n    " +
              esc(p.summary[mode()] || p.summary.tech) + '\n    <span class="c-dim">stack: ' + esc(p.stack.join(", ")) + "</span>";
          }).join("\n\n") + '\n\nRun the live demos with <span class="c-acc">goto demos</span>.');
        },
      },
      skills: {
        desc: "Skills by category",
        run: function () {
          print(S.skills.map(function (g) {
            return '<span class="c-acc">' + esc(g.group) + "</span>\n  " + g.items.map(function (i) { return esc(i.name); }).join(" · ");
          }).join("\n"));
        },
      },
      education: {
        desc: "Schools",
        run: function () {
          print(S.education.map(function (e) {
            return '<span class="c-b">' + esc(e.school) + "</span>\n  " + esc(e.degree) + '\n  <span class="c-dim">' + esc(e.dates) + "</span>";
          }).join("\n\n"));
        },
      },
      contact: {
        desc: "How to reach me",
        run: function () {
          print("email     " + link("mailto:" + S.email, S.email) + "\nlinkedin  " + link(S.linkedin) + "\ngithub    " + link("https://github.com/" + S.githubUser));
        },
      },
      resume: {
        desc: "Open my resume (PDF)",
        run: function () { print("Opening resume…"); window.open(S.resume, "_blank", "noopener"); },
      },
      github: {
        desc: "Live repos from GitHub",
        run: function () {
          print('<span class="c-dim">GET api.github.com/users/' + esc(S.githubUser) + "/repos …</span>");
          window.GitHubFeed.get(S).then(function (d) {
            var rows = d.repos.slice(0, 8).map(function (r) {
              return '  <span class="c-acc">' + pad(r.name, 30) + "</span>" + pad(r.language || "-", 18) + "★ " + r.stars + '  <span class="c-dim">' + window.GitHubFeed.ago(r.pushed) + "</span>";
            });
            print(d.profile.repos + " public repos\n" + (rows.join("\n") || "  (none yet)") + "\n" + link(d.profile.url));
          }).catch(function () {
            print('<span class="c-err">GitHub API unavailable right now.</span> ' + link("https://github.com/" + S.githubUser));
          });
        },
      },
      ls: {
        desc: "List sections",
        run: function () {
          print(SECTIONS.map(function (s) { return '<span class="c-acc">' + s + "/</span>"; }).join("  ") + "  resume.pdf");
        },
      },
      goto: {
        desc: "Jump to a section, e.g. goto demos",
        run: function (arg) {
          var target = (arg || "").replace(/\/$/, "").toLowerCase();
          if (SECTIONS.indexOf(target) === -1) {
            print('<span class="c-err">goto: unknown section "' + esc(target) + '"</span>\nTry: ' + SECTIONS.join(", "));
            return;
          }
          close();
          app.scrollTo("#" + target);
        },
      },
      mode: {
        desc: "Switch audience: mode tech | mode biz",
        run: function (arg) {
          if (arg !== "tech" && arg !== "biz") { print("Current mode: " + mode() + "\nUsage: mode tech | mode biz"); return; }
          app.setMode(arg);
          print('<span class="c-ok">✓</span> Now explaining everything for ' + (arg === "tech" ? "engineers." : "the business side."));
        },
      },
      theme: {
        desc: "Switch theme: theme light | theme dark",
        run: function (arg) {
          if (arg !== "light" && arg !== "dark") { print("Usage: theme light | theme dark"); return; }
          app.setTheme(arg);
          print('<span class="c-ok">✓</span> Theme set to ' + arg + ".");
        },
      },
      hire: {
        desc: "Start the conversation",
        run: function () {
          print('<span class="c-ok">Excellent choice.</span>\n\n' +
            "  ┌────────────────────────────────────────┐\n" +
            "  │  Candidate   Ethan Okelberry           │\n" +
            "  │  Fit         Sales Eng · Solutions     │\n" +
            "  │  Status      Ready for a first call    │\n" +
            "  └────────────────────────────────────────┘\n\n" +
            "Opening your email client… (or write to " + link("mailto:" + S.email, S.email) + ")");
          setTimeout(function () {
            window.location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Let's talk about a role");
          }, 600);
        },
      },
      clear: { desc: "Clear the screen", run: function () { out.innerHTML = ""; } },
      exit: { desc: "Close the terminal", run: function () { close(); } },
      sudo: { hidden: true, run: function () { print('<span class="c-err">Permission denied.</span> Nice try, though. Have you tried <span class="c-acc">hire</span>?'); } },
      cd: { hidden: true, run: function (arg) { COMMANDS.goto.run(arg); } },
      cat: {
        hidden: true,
        run: function (arg) {
          if (arg === "resume.pdf") return COMMANDS.resume.run();
          print('<span class="c-err">cat: ' + esc(arg || "") + ": No such file</span>");
        },
      },
      about: { hidden: true, run: function () { COMMANDS.whoami.run(); } },
    };

    function exec(raw) {
      var line = raw.trim();
      print('<span class="c-acc">ethan@portfolio:~$</span> ' + esc(line));
      if (!line) return;
      history.push(line);
      hIdx = history.length;
      var parts = line.split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(" ");
      var c = COMMANDS[cmd];
      if (c) c.run(arg);
      else print('<span class="c-err">command not found: ' + esc(cmd) + '</span>. Type <span class="c-acc">help</span> to see what I can do.');
    }

    function open() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      if (!greeted) {
        greeted = true;
        print('<span class="c-acc">' + esc(box([S.name.toUpperCase(), "Sales Engineering · Computer Science", S.location])) + "</span>\n" +
          "Interactive resume. Type <span class=\"c-acc\">help</span> to get started, or try <span class=\"c-acc\">whoami</span>, <span class=\"c-acc\">projects</span>, <span class=\"c-acc\">hire</span>.\n");
      }
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      exec(input.value);
      input.value = "";
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        if (hIdx > 0) { hIdx--; input.value = history[hIdx]; }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; }
        else { hIdx = history.length; input.value = ""; }
        e.preventDefault();
      } else if (e.key === "Tab") {
        e.preventDefault();
        var v = input.value.trim().toLowerCase();
        var parts = v.split(/\s+/);
        if (parts.length === 2 && (parts[0] === "goto" || parts[0] === "cd")) {
          var sm = SECTIONS.filter(function (s) { return s.indexOf(parts[1]) === 0; });
          if (sm.length === 1) input.value = parts[0] + " " + sm[0];
          return;
        }
        var matches = Object.keys(COMMANDS).filter(function (k) { return !COMMANDS[k].hidden && k.indexOf(v) === 0; });
        if (matches.length === 1) input.value = matches[0] + " ";
        else if (matches.length > 1) print(matches.join("  "));
      }
    });
    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      if (e.key === "Tab" && e.target !== input) { e.preventDefault(); input.focus(); }
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    body.addEventListener("click", function (e) { if (!window.getSelection().toString() && e.target.tagName !== "A") input.focus(); });
    closeBtn.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (e.key === "`" && overlay.hidden && !/INPUT|TEXTAREA|SELECT/.test(tag) && !e.target.isContentEditable) {
        e.preventDefault();
        open();
      }
    });

    return { open: open, close: close };
  }

  window.Terminal = { init: init };
})();
