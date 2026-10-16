# Ethan Okelberry · Interactive Resume

**Live site:** https://okelberrye-cloud.github.io/Ethan_Okelberry_Personal_Website/

A personal site for Sales Engineering and Solutions Consulting roles, built around one idea: *I build it. I sell it.*

## What's on it

| Section | What it does |
| --- | --- |
| **Hero** | Name, headline, phone, resume download, plus Cisco and AWS logos and the startup numbers. |
| **01 Discovery** | A recruiter picks what the role needs and gets proof, a copyable summary and a pre-filled email. |
| **02 Experience** | Cisco, AWS, Flash Bang Authentics, Granite Bay, plus education. |
| **03 Projects** | Cisco AI Infrastructure presentation (links to the live deck), plus demos of the outreach agent and the fantasy baseball pickup agent. |
| **04 Skills** | A plain list by category. |
| **05 Contact** | Phone, email (with copy button), LinkedIn, resume and a recruiter TL;DR. |

## Editing the content

**All text lives in [`js/content.js`](js/content.js).** Edit it, commit and push; the site updates in about a minute. There's no build step.

After editing CSS or JS, bump the `?v=` number on the file links in `index.html` so browsers load the new version instead of a cached one.

- New job: add an entry to `experience`.
- New project: add an entry to `projects`. `visual` can be `"outline"` (numbered list), `"outreach"` or `"fantasy"`.
- New skill: add it to the right group under `skills`.
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
js/demos.js       agent demos (sample data)
js/logos.js       Cisco and AWS logos
assets/           headshot, resume PDF, fonts, Flash Bang + Granite Bay logos
og-image.png      link preview image (1200x630)
404.html          custom not-found page
```

Fonts: [Space Grotesk](https://github.com/floriankarsten/space-grotesk), [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), all under the SIL Open Font License, self-hosted via Fontsource.
