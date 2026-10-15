/* ==========================================================================
   Live GitHub feed
   Uses the public GitHub REST API from the visitor's browser (no token).
   Unauthenticated requests are limited to 60/hour per visitor IP, so results
   are cached in localStorage for an hour.
   ========================================================================== */
(function () {
  "use strict";

  var API = "https://api.github.com";
  var CACHE_KEY = "eo-github-v1";
  var TTL = 60 * 60 * 1000;

  var LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", HTML: "#e34c26",
    CSS: "#663399", SCSS: "#c6538c", Java: "#b07219", "C++": "#f34b7d", C: "#555555",
    "C#": "#178600", Go: "#00ADD8", Rust: "#dea584", Shell: "#89e051", PowerShell: "#012456",
    "Jupyter Notebook": "#DA5B0B", SQL: "#e38c00", TSQL: "#e38c00", PLpgSQL: "#336790",
    Swift: "#F05138", Kotlin: "#A97BFF", Ruby: "#701516", PHP: "#4F5D95", Dart: "#00B4AB",
    Vue: "#41b883", Dockerfile: "#384d54", R: "#198CE7", HCL: "#844FBA", Markdown: "#083fa1",
  };

  var ICON = {
    repo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v16H7.5A2.5 2.5 0 0 0 5 20.5zM5 20.5A2.5 2.5 0 0 0 7.5 23H19v-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/></svg>',
    fork: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 12v5"/></svg>',
    push: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M3 12h5.5M15.5 12H21"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    pr: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v8M18 16V9a3 3 0 0 0-3-3h-4m0 0 2.5-2.5M11 6l2.5 2.5"/></svg>',
    dot: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/></svg>',
    gh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function ago(iso) {
    var d = new Date(iso), s = (Date.now() - d.getTime()) / 1000;
    if (isNaN(s)) return "";
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    if (s < 86400 * 7) return Math.floor(s / 86400) + "d ago";
    if (s < 86400 * 35) return Math.floor(s / (86400 * 7)) + "w ago";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  function getJSON(path) {
    return fetch(API + path, { headers: { Accept: "application/vnd.github+json" } }).then(function (r) {
      if (!r.ok) throw new Error("GitHub API " + r.status);
      return r.json();
    });
  }

  function readCache(user) {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (c && c.user === user && Date.now() - c.at < TTL) return c.data;
    } catch (e) {}
    return null;
  }
  function writeCache(user, data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ user: user, at: Date.now(), data: data })); } catch (e) {}
  }

  var pending = null;

  function fetchAll(user, cfg) {
    var cached = readCache(user);
    if (cached) return Promise.resolve(cached);
    if (pending) return pending;

    var hidden = (cfg.hidden || []).map(function (h) { return h.toLowerCase(); });
    var featured = (cfg.featured || []).map(function (h) { return h.toLowerCase(); });

    pending = Promise.all([
      getJSON("/users/" + user),
      getJSON("/users/" + user + "/repos?per_page=100&sort=pushed"),
      getJSON("/users/" + user + "/events/public?per_page=100").catch(function () { return []; }),
    ]).then(function (res) {
      var profile = res[0], allRepos = res[1], events = res[2];

      var repos = allRepos
        .filter(function (r) { return hidden.indexOf(r.name.toLowerCase()) === -1; })
        .filter(function (r) { return cfg.includeForks || !r.fork; })
        .map(function (r) {
          return {
            name: r.name, url: r.html_url, description: r.description, language: r.language,
            stars: r.stargazers_count, forks: r.forks_count, pushed: r.pushed_at,
            topics: (r.topics || []).slice(0, 3), homepage: r.homepage,
            featured: featured.indexOf(r.name.toLowerCase()) !== -1,
          };
        })
        .sort(function (a, b) {
          var fa = featured.indexOf(a.name.toLowerCase()), fb = featured.indexOf(b.name.toLowerCase());
          if (fa !== -1 || fb !== -1) return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb);
          return new Date(b.pushed) - new Date(a.pushed);
        });

      // Language bytes for the visible repos (falls back to primary language counts).
      var langRepos = repos.slice(0, 8);
      return Promise.all(langRepos.map(function (r) {
        return getJSON("/repos/" + user + "/" + r.name + "/languages").catch(function () { return null; });
      })).then(function (langLists) {
        var totals = {};
        langLists.forEach(function (l, i) {
          if (l && Object.keys(l).length) {
            Object.keys(l).forEach(function (k) { totals[k] = (totals[k] || 0) + l[k]; });
          } else if (langRepos[i].language) {
            totals[langRepos[i].language] = (totals[langRepos[i].language] || 0) + 1;
          }
        });
        var data = {
          profile: {
            login: profile.login, avatar: profile.avatar_url, url: profile.html_url,
            repos: profile.public_repos, followers: profile.followers, created: profile.created_at,
          },
          repos: repos,
          langs: totals,
          events: summarizeEvents(events),
          pushes: events.filter(function (e) { return e.type === "PushEvent"; }).length,
        };
        writeCache(user, data);
        return data;
      });
    });
    pending.catch(function () { pending = null; });
    return pending;
  }

  function shortRepo(full) { return String(full || "").split("/").pop(); }

  // Turn raw events into short, readable lines; merge back-to-back pushes.
  function summarizeEvents(events) {
    var out = [];
    (events || []).forEach(function (e) {
      var repo = shortRepo(e.repo && e.repo.name), p = e.payload || {}, item = null;
      switch (e.type) {
        case "PushEvent":
          var commits = p.commits || [];
          var msg = commits.length ? commits[commits.length - 1].message.split("\n")[0] : "";
          var prev = out[out.length - 1];
          if (prev && prev.kind === "push" && prev.repo === repo) { prev.count++; return; }
          item = { kind: "push", repo: repo, count: 1, msg: msg };
          break;
        case "CreateEvent":
          item = p.ref_type === "repository"
            ? { kind: "create", repo: repo, text: "Created repository" }
            : { kind: "create", repo: repo, text: "Created " + (p.ref_type || "ref") + " " + (p.ref || "") + " in" };
          break;
        case "PullRequestEvent":
          var merged = p.action === "closed" && p.pull_request && p.pull_request.merged;
          item = { kind: "pr", repo: repo, text: (merged ? "Merged" : p.action === "opened" ? "Opened" : "Updated") + " a pull request in", msg: p.pull_request && p.pull_request.title };
          break;
        case "PublicEvent":
          item = { kind: "create", repo: repo, text: "Open-sourced" };
          break;
        case "ReleaseEvent":
          item = { kind: "create", repo: repo, text: "Published a release of", msg: p.release && (p.release.name || p.release.tag_name) };
          break;
        case "ForkEvent":
          item = { kind: "fork", repo: repo, text: "Forked" };
          break;
        case "WatchEvent":
          item = { kind: "star", repo: repo, text: "Starred" };
          break;
        default:
          return;
      }
      item.at = e.created_at;
      out.push(item);
    });
    return out.slice(0, 7);
  }

  function langBar(langs) {
    var keys = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a]; });
    var total = keys.reduce(function (s, k) { return s + langs[k]; }, 0);
    if (!total) return "";
    var top = keys.slice(0, 5), rest = keys.slice(5).reduce(function (s, k) { return s + langs[k]; }, 0);
    var parts = top.map(function (k) { return { name: k, pct: (langs[k] / total) * 100, color: LANG_COLORS[k] || "#8b95a7" }; });
    if (rest) parts.push({ name: "Other", pct: (rest / total) * 100, color: "#6b7280" });
    return '<div><p class="mini-label" style="margin-bottom:10px">Languages</p>' +
      '<div class="lang-bar" role="img" aria-label="' + esc(parts.map(function (p) { return p.name + " " + p.pct.toFixed(0) + "%"; }).join(", ")) + '">' +
      parts.map(function (p) { return '<i style="width:' + p.pct.toFixed(2) + "%;background:" + p.color + '"></i>'; }).join("") +
      '</div><ul class="lang-legend">' +
      parts.map(function (p) { return '<li><span class="lang-dot" style="background:' + p.color + '"></span>' + esc(p.name) + " " + p.pct.toFixed(p.pct < 1 ? 1 : 0) + "%</li>"; }).join("") +
      "</ul></div>";
  }

  function feedHtml(items, user) {
    if (!items.length) return '<p class="demo-note">No public activity in the last 90 days.</p>';
    return '<ul class="feed">' + items.map(function (it) {
      var icon = it.kind === "push" ? ICON.push : it.kind === "pr" ? ICON.pr : it.kind === "fork" ? ICON.fork : it.kind === "star" ? ICON.star : ICON.plus;
      var repoLink = '<b><a href="https://github.com/' + esc(user) + "/" + esc(it.repo) + '" target="_blank" rel="noopener">' + esc(it.repo) + "</a></b>";
      var text = it.kind === "push"
        ? "Pushed " + (it.count > 1 ? it.count + " times " : "") + "to " + repoLink
        : esc(it.text) + " " + repoLink;
      return "<li>" + icon + '<span class="what">' + text + (it.msg ? '<span class="msg">' + esc(it.msg) + "</span>" : "") +
        '</span><time datetime="' + esc(it.at) + '">' + ago(it.at) + "</time></li>";
    }).join("") + "</ul>";
  }

  function repoCard(r, cfg) {
    var desc = r.description || (cfg.descriptions && cfg.descriptions[r.name]) || "No description yet.";
    var color = LANG_COLORS[r.language] || "#8b95a7";
    return '<a class="card repo" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
      '<span class="repo-name">' + ICON.repo + "<span>" + esc(r.name) + "</span>" + (r.featured ? '<span class="repo-feat">Featured</span>' : "") + "</span>" +
      "<p>" + esc(desc) + "</p>" +
      (r.topics.length ? '<span class="tags">' + r.topics.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</span>" : "") +
      '<span class="repo-meta">' +
      (r.language ? '<span><span class="lang-dot" style="background:' + color + '"></span>' + esc(r.language) + "</span>" : "") +
      "<span>" + ICON.star + r.stars + "</span>" +
      (r.forks ? "<span>" + ICON.fork + r.forks + "</span>" : "") +
      "<span>Updated " + ago(r.pushed) + "</span></span></a>";
  }

  function render(root, data, site) {
    var cfg = site.github || {};
    var p = data.profile;
    var since = new Date(p.created).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    var repos = data.repos.slice(0, cfg.maxRepos || 6);

    root.innerHTML =
      '<div class="gh-top">' +
      '<div class="card gh-profile">' +
      '<div class="gh-id"><img src="' + esc(p.avatar) + '" alt="" width="64" height="64" loading="lazy">' +
      "<div><h3>" + esc(site.name) + '</h3><a href="' + esc(p.url) + '" target="_blank" rel="noopener">@' + esc(p.login) + "</a></div></div>" +
      '<div class="gh-stats"><div><strong>' + p.repos + "</strong><span>Public repos</span></div>" +
      "<div><strong>" + data.pushes + "</strong><span>Pushes, 90 days</span></div>" +
      "<div><strong>" + since + "</strong><span>On GitHub since</span></div></div>" +
      langBar(data.langs) +
      '<a class="btn btn-sm" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + ICON.gh + "Follow on GitHub</a>" +
      "</div>" +
      '<div class="card gh-activity"><h3>Recent activity</h3>' + feedHtml(data.events, p.login) + "</div>" +
      "</div>" +
      (repos.length
        ? '<div class="repos">' + repos.map(function (r) { return repoCard(r, cfg); }).join("") + "</div>"
        : '<p class="gh-error">No public repositories yet.</p>') +
      '<div class="gh-foot"><a class="btn" href="' + esc(p.url) + '?tab=repositories" target="_blank" rel="noopener">See all repositories →</a></div>';
  }

  function renderError(root, site) {
    var user = site.githubUser, cfg = site.github || {};
    var url = "https://github.com/" + user;
    var featured = (cfg.featured || []).map(function (name) {
      var desc = (cfg.descriptions && cfg.descriptions[name]) || "";
      return '<a class="card repo" href="' + esc(url + "/" + name) + '" target="_blank" rel="noopener">' +
        '<span class="repo-name">' + ICON.repo + "<span>" + esc(name) + '</span><span class="repo-feat">Featured</span></span>' +
        (desc ? "<p>" + esc(desc) + "</p>" : "") + "</a>";
    }).join("");
    root.innerHTML =
      '<div class="gh-error"><p>GitHub\'s API isn\'t answering right now (it limits how often one browser can ask). The repos are still one click away.</p>' +
      '<p><a class="btn btn-sm" href="' + url + '" target="_blank" rel="noopener">' + ICON.gh + "Open my GitHub profile</a></p></div>" +
      (featured ? '<div class="repos">' + featured + "</div>" : "");
  }

  window.GitHubFeed = {
    init: function (root, site) {
      var started = false;
      function go() {
        if (started) return;
        started = true;
        fetchAll(site.githubUser, site.github || {})
          .then(function (data) { render(root, data, site); })
          .catch(function () { renderError(root, site); });
      }
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { io.disconnect(); go(); }
        }, { rootMargin: "800px 0px" });
        io.observe(root);
      } else {
        go();
      }
    },
    // Used by the terminal's `github` command.
    get: function (site) { return fetchAll(site.githubUser, site.github || {}); },
    ago: ago,
  };
})();
