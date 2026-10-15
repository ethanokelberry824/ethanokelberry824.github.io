# Ethan Okelberry · Interactive Resume

**Live site:** https://okelberrye-cloud.github.io/Ethan_Okelberry_Personal_Website/

A personal site for Sales Engineering and Solutions Consulting roles, built around one idea: *technical enough to build it, clear enough to sell it.*

## What's on it

| Section | What it does |
| --- | --- |
| **Technical / Business switch** | Every project is written two ways. Flipping the switch in the nav rewrites the copy, the demo logs and the accent color for an engineer or an executive. |
| **01 Discovery** | A recruiter picks what the role needs; the site builds a fit report with evidence, a copyable summary and a pre-filled email. |
| **02 Experience** | Timeline of roles and education. |
| **03 Demos** | Working demos: a GPU-cluster network simulation (from the Cisco AI Infrastructure deck), plus simulated runs of the outreach agent and the MLB analytics pipeline. |
| **04 Toolkit** | Click any skill to get a "receipt" showing where it was used. |
| **05 GitHub** | Profile, languages, recent activity and repos, pulled live from the GitHub API. |
| **06 Contact** | Email (with copy button), LinkedIn, GitHub, resume download and a recruiter TL;DR. |
| **Terminal** | Press <kbd>`</kbd> (backtick) to drive the site from a command line. Try `help`, `whoami`, `projects`, `hire`. |

Also included: light and dark themes, a mobile layout, reduced-motion support, a social preview image (`og-image.png`) and self-hosted fonts.

## Editing the content

**All text lives in [`js/content.js`](js/content.js).** Edit it, commit and push; the site updates in about a minute. There's no build step.

- New job: add an entry to `experience`.
- New project: add an entry to `projects`. `demo` can be `"gpu"`, `"outreach"`, `"mlb"` or left out.
- New skill: add it under `skills` with `used: [...]` pointing at experience or project ids.
- Feature a repo: put its name in `github.featured`. Hide one with `github.hidden`.
- Add a scheduling link: set `bookingUrl` to show a "Book a 15-min call" button.
- Swap the resume: replace `assets/Ethan_Okelberry_Resume.pdf` (keep the file name, or update `resume`).
- Swap the headshot: replace `assets/headshot-800.jpg`, `headshot-800.webp` and `headshot-480.webp` (4:5 portrait).

## Running it locally

Any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing (GitHub Pages)

1. Repo **Settings → Pages**.
2. **Source:** Deploy from a branch → `main` / `(root)` → Save.
3. The site appears at the URL above within a minute or two.

## Structure

```
index.html        page skeleton, SEO and social tags
css/style.css     all styles (themes, layout, responsive)
js/content.js     all resume content  <- edit this
js/main.js        rendering and interactions
js/demos.js       interactive project demos
js/github.js      live GitHub feed (cached 1h in the browser)
js/terminal.js    the backtick terminal
assets/           headshot, resume PDF, fonts
og-image.png      link preview image (1200x630)
404.html          custom not-found page
```

Fonts: [Space Grotesk](https://github.com/floriankarsten/space-grotesk), [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), all under the SIL Open Font License, self-hosted via Fontsource.
