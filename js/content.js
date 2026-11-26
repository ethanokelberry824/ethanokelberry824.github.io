/* ==========================================================================
   SITE CONTENT
   --------------------------------------------------------------------------
   Everything on the site is rendered from this file. To update the site
   (new job, new project, new number), edit the data below and push.
   There's no build step.
   ========================================================================== */

window.SITE = {
  name: "Ethan Okelberry",
  location: "San Marcos, CA",
  email: "ethanokelberry824@gmail.com",
  phone: "(916) 300-3650",
  phoneHref: "+19163003650",
  linkedin: "https://www.linkedin.com/in/ethan-okelberry",
  githubUser: "ethanokelberry824",
  resume: "assets/Ethan_Okelberry_Resume.pdf",

  status: "Open to Sales Engineer & Solutions Engineer roles · May 2027",

  // Rotating line under the name in the hero.
  roles: [
    "Aspiring Sales Engineer",
    "ex-Cisco Technical Sales Engineering Intern",
    "Incoming AI Club President",
    "First hire, live commerce startup",
    "CS @ Cal State San Marcos",
  ],

  headline: "I build it. I sell it.",

  summary:
    "I'm a Computer Science senior at Cal State San Marcos going after Sales Engineer, Solutions Engineer and Solutions Architect roles. I interned as a Technical Sales Engineer at Cisco, where I built an AI demo and presented it to Cisco's Head of AI, and I was the first hire at a live commerce startup where I sold at 2× quota.",

  // Logo strip under the hero.
  credentials: [
    { logo: "cisco", title: "Technical Sales Engineering Intern", note: "Summer 2026" },
    { logo: "aws", title: "Student Builder Campus Leader", note: "Aug – Nov 2026 · via Next Gen Team" },
  ],

  // The startup numbers strip under the logos.
  startup: {
    label: "First hire at a live commerce startup",
    stats: [
      { value: 2, suffix: "×", label: "Quota on average" },
      { value: 100, suffix: "+", label: "Live sales streams hosted" },
      { value: 200, suffix: "+", label: "Peak live viewers" },
      { value: 3, suffix: "", label: "Sellers I led" },
    ],
  },

  /* ------------------------------------------------------------------------
     DISCOVERY: a recruiter picks what the role needs and gets proof.
     ------------------------------------------------------------------------ */
  defaultNeeds: ["demo"],
  needs: [
    {
      id: "demo",
      label: "Runs technical demos & presentations",
      evidence: [
        { src: "Cisco", text: "Demoed ThousandEyes live to 30+ Cisco sellers, tracing a replayed AWS outage to root cause in under 15 minutes.", href: "#exp-cisco" },
        { src: "Cisco", text: "Built Corro, a working AI demo, and presented it to Cisco's Head of AI.", href: "#exp-cisco" },
        { src: "Cisco AI deck", text: "Built a 10-minute Cisco AI Infrastructure talk with a live simulation of how one slow network link stalls a GPU cluster.", href: "#project-cisco-ai" },
        { src: "Flash Bang Authentics", text: "Hosted 100+ live TikTok sales streams, with peaks of 200+ viewers.", href: "#exp-flashbang" },
      ],
    },
    {
      id: "translate",
      label: "Translates tech into business value",
      evidence: [
        { src: "Cisco", text: "Built Corro to draft the CCW discount justifications AEs used to write by hand. Sellers estimated it saves 1.5 hours a week.", href: "#exp-cisco" },
        { src: "Cisco", text: "Co-wrote the SE and AE enablement doc for integrating LMS platforms (LTI) with Webex Control Hub.", href: "#exp-cisco" },
        { src: "Cisco AI deck", text: "Turned a full AI infrastructure stack (GPUs, networking, storage, management) into a 10-minute talk anyone can follow.", href: "#project-cisco-ai" },
      ],
    },
    {
      id: "sell",
      label: "Handles objections & closes",
      evidence: [
        { src: "Flash Bang Authentics", text: "Pitched and upsold in real time on live streams to hit 2× quota on average.", href: "#exp-flashbang" },
        { src: "Flash Bang Authentics", text: "Wrote the scripts and offers my team of 3 pitched from, lifting the team from 50% to 100% of quota.", href: "#exp-flashbang" },
        { src: "Cisco", text: "In a 39-seller survey, 97% said they'd send Corro's draft.", href: "#exp-cisco" },
        { src: "AWS", text: "Pitched AWS Builder Center to 5 student clubs and reached 300+ students.", href: "#exp-aws" },
      ],
    },
    {
      id: "technical",
      label: "Has hands-on technical depth",
      evidence: [
        { src: "NBA Points Predictor", text: "Built and deployed a full-stack ML app (Python, FastAPI, Next.js) whose model beats a last-5-games baseline by 7%.", href: "#project-nba" },
        { src: "F1 lap timer", text: "Built the Python dashboard that reads live lap data from an STM32 board over USB serial.", href: "#project-f1" },
        { src: "WudjaBudja", text: "Built the Gemini integration that turns each traveler's budget and interests into one group itinerary.", href: "#project-wudjabudja" },
        { src: "Education", text: "B.S. in Computer Science at CSUSM, May 2027 (3.5 GPA).", href: "#education" },
      ],
    },
    {
      id: "ai",
      label: "Proficient in AI tools",
      evidence: [
        { src: "Outreach Agent", text: "Built an AI agent with Claude, Gemini and Make.com that manages 800+ contacts across 10+ company pipelines.", href: "#project-outreach" },
        { src: "Cisco", text: "Built Corro, an AI demo that drafts discount justifications for Cisco sellers.", href: "#exp-cisco" },
        { src: "WudjaBudja", text: "Wired the Gemini API into a team app to plan one trip around everyone's budget.", href: "#project-wudjabudja" },
        { src: "Claude", text: "Builds custom Claude skills, like one that pulls lecture transcripts from Otter and files them in Google Drive." },
      ],
    },
    {
      id: "lead",
      label: "Leads & takes ownership",
      evidence: [
        { src: "AI Club", text: "Incoming president: secured a faculty advisor and 25+ member signups, and I'm planning a 12-session Spring 2027 program.", href: "#exp-aiclub" },
        { src: "WudjaBudja", text: "Product lead and Scrum master for a 4-person team. Cut scope to an MVP and shipped a working itinerary flow in 5 sprints.", href: "#project-wudjabudja" },
        { src: "Flash Bang Authentics", text: "The startup's first employee. Led a team of 3 sellers.", href: "#exp-flashbang" },
        { src: "Cisco", text: "Took Corro from idea to working demo and presented it to Cisco's Head of AI.", href: "#exp-cisco" },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
     EXPERIENCE
     logo: "cisco" or "aws" uses js/logos.js. Otherwise `mark` shows as a badge.
     group: "Leadership" puts the entry under the Leadership label.
     ------------------------------------------------------------------------ */
  experience: [
    {
      id: "exp-cisco",
      logo: "cisco",
      company: "Cisco",
      role: "Technical Sales Engineering Intern",
      dates: "Jun 2026 – Aug 2026",
      location: "Remote",
      color: "#1ba0d7",
      stats: [
        { value: "97%", label: "of 39 sellers would send Corro's draft" },
        { value: "30+", label: "sellers at my ThousandEyes demo" },
      ],
      bullets: [
        "Built Corro, a working AI demo that drafts the CCW discount justifications AEs used to write by hand. In a 39-seller survey, 97% said they'd send its draft and estimated 1.5 hours a week saved. Presented it to Cisco's Head of AI.",
        "Co-wrote the SE and AE enablement doc for integrating LMS platforms (LTI) with Webex Control Hub.",
        "Demoed ThousandEyes live to 30+ Cisco sellers, tracing a replayed AWS outage to root cause in under 15 minutes.",
      ],
    },
    {
      id: "exp-flashbang",
      mark: "FB",
      img: "assets/logo-flashbang.png",
      company: "Flash Bang Authentics",
      companyNote: "Live commerce startup",
      role: "Sports Break Host / Founding Team Member",
      dates: "Sep 2025 – May 2026",
      location: "San Marcos, CA",
      color: "#e5484d",
      bullets: [
        "Hosted 100+ live TikTok sales streams of football memorabilia as the startup's first employee, pitching and upselling in real time to hit 2× quota on average, with peaks of 200+ viewers.",
        "Led a team of 3 sellers across 40+ combined stream hours a week, writing the scripts and offer structures they pitched from and lifting the team from 50% to 100% of quota.",
      ],
    },
    {
      id: "exp-granitebay",
      mark: "GB",
      img: "assets/logo-granitebay.png",
      company: "Granite Bay Golf Club",
      role: "Guest Services / Member Relations",
      dates: "May 2022 – May 2025",
      location: "Granite Bay, CA",
      color: "#30a46c",
      bullets: [
        "Three years of high-touch service for about 200 club members. Helped onboard new staff and was trusted with opening and closing the club.",
      ],
    },
    {
      id: "exp-aiclub",
      group: "Leadership",
      mark: "AI",
      company: "CSUSM AI Club",
      role: "Incoming President",
      dates: "Starting Jan 2027",
      location: "San Marcos, CA",
      color: "#8b5cf6",
      bullets: [
        "Secured a faculty advisor and 25+ member signups. Planning a 12-session program for Spring 2027.",
      ],
    },
    {
      id: "exp-aws",
      group: "Leadership",
      logo: "aws",
      company: "AWS Student Builder Program",
      companyNote: "via Next Gen Team",
      role: "Student Builder Campus Leader",
      dates: "Aug 2026 – Nov 2026",
      location: "San Marcos, CA",
      color: "#ff9900",
      bullets: [
        "Reached 300+ students through 12 classroom announcements and 5 AWS Builder Center pitches to student clubs.",
        "Created AWS content for LinkedIn and Instagram, earning 5,200+ LinkedIn impressions.",
      ],
    },
  ],

  education: [
    {
      school: "California State University San Marcos",
      degree: "B.S. in Computer Science · 3.5 GPA",
      dates: "Jan 2026 – May 2027 (expected)",
      location: "San Marcos, CA",
      detail: "Coursework: Embedded Systems, Database Systems, Intro to AI, Software Engineering, Data Structures and Algorithms",
    },
    {
      school: "Palomar College",
      degree: "Associate Degree in Computer Science · Dean's List",
      dates: "Aug 2023 – Dec 2025",
      location: "San Marcos, CA",
      detail: "Transferred from Sierra College",
    },
  ],

  /* ------------------------------------------------------------------------
     PROJECTS
     size: "feature" (full width, with a visual) or "compact" (small card).
     visual: "outline", "results", "outreach" or "fantasy" (js/demos.js).
     links: [{ label, href, kind: "live" | "code" | "video" }] (all optional)
     status: optional badge, like "In progress".
     draft: true hides a project until it's ready.
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: "project-nba",
      size: "feature",
      title: "NBA Player Points Predictor",
      when: "Fall 2026 · Solo · Intro to AI final project",
      summary:
        "Pick a player, an opponent and who's sitting out, and it predicts how many points he scores. I built all of it: the data pipeline, the model, a FastAPI backend and a Next.js site that's live right now.",
      stack: ["Python", "scikit-learn", "FastAPI", "Next.js", "Machine learning"],
      links: [
        { label: "Try it live", href: "https://nba-points.vercel.app/", kind: "live" },
        { label: "Code", href: "https://github.com/ethanokelberry824/nba-points", kind: "code" },
      ],
      visual: "results",
      resultsTitle: "Average points of error on a season it never trained on",
      results: [
        { label: "My model", value: 4.86, best: true },
        { label: "Season average", value: 5.05 },
        { label: "Last 5 games", value: 5.24 },
      ],
      resultsNote: "Lower is better. 7% better than the last-5-games rule, with 35 features from 10 seasons of game logs.",
    },
    {
      id: "project-f1",
      size: "feature",
      title: "Mini F1 Lap Timing System",
      when: "Fall 2026 · 3-person team · CS 435 Embedded Systems capstone",
      summary:
        "A Hot Wheels race track with automatic lap timing. An STM32 board runs the start lights, detects the car at the finish line and a sector checkpoint, and times every lap to the millisecond over a 3-lap race. I built the Python dashboard that shows the race live on a laptop.",
      team: "Tharun: firmware · Melekai: track and electronics · Me: dashboard",
      stack: ["STM32", "C", "Python", "Tkinter", "PySerial"],
      links: [
        { label: "Watch the demo", href: "https://drive.google.com/file/d/1VIZQU4o0guhosdVaRyIGiSh9OrAJJ5fb/view?usp=sharing", kind: "video" },
      ],
      visual: "outline",
      outlineTitle: "What I built",
      outline: [
        "Live mode reads race data from the board over USB serial on a background thread, so the screen never freezes.",
        "Simulator mode runs a full fake race with no board plugged in, so we could test before the firmware was ready.",
        "Proposed the serial message format the board and dashboard share, with a small, unit-tested parser.",
        "Every line from the board is saved to a CSV test log. Bad lines get skipped instead of crashing the app.",
      ],
    },
    {
      id: "project-outreach",
      size: "feature",
      title: "AI Referral Outreach Agent",
      when: "Feb 2026 – Present",
      summary:
        "An AI agent that researches target companies, rates contacts by how likely they are to help, and drafts a tailored LinkedIn message for each one. Nothing goes out until I approve it. It manages 800+ contacts across 10+ company pipelines, and it landed me an internal AWS referral and an AWS Solutions Architect mentor.",
      stack: ["Claude", "Gemini", "Make.com", "Google Sheets"],
      visual: "outreach",
    },
    {
      id: "project-cisco-ai",
      size: "compact",
      title: "Cisco AI Infrastructure Presentation",
      when: "Oct 2026",
      summary:
        "A 10-minute talk I built from scratch in HTML and JavaScript to teach Cisco AI Infrastructure. It includes a live simulation where one jammed network link drops an 8-GPU cluster from 50 to 21 training steps a minute.",
      stack: ["HTML", "JavaScript", "AI infrastructure"],
      links: [
        { label: "View the deck", href: "https://ethanokelberry824.github.io/cisco-ai-infrastructure/", kind: "live" },
      ],
    },
    {
      id: "project-wudjabudja",
      size: "compact",
      status: "In progress",
      title: "WudjaBudja (What's Your Budget?)",
      when: "Sep 2026 – Present · 4-person team",
      summary:
        "A group trip planner that builds one itinerary around everyone's budget and interests. I'm product lead and Scrum master, and I built the Gemini integration. Miles leads the frontend, George the Spring Boot backend and Lukas the data storage.",
      stack: ["Gemini API", "Spring Boot", "Agile"],
      links: [
        { label: "Team repo", href: "https://github.com/milesbaack/wudjabudja", kind: "code" },
      ],
    },
    {
      id: "project-fantasy",
      size: "compact",
      title: "Fantasy Baseball Pickup Agent",
      when: "2025",
      summary:
        "Every day it looks up each starting pitcher's projected stat line, checks who's already rostered in my league, and emails me the best pickups. Runs on a schedule with GitHub Actions.",
      stack: ["Python", "GitHub Actions", "Email automation"],
    },
    {
      // Hidden until it's ready: fill in the details and links, then set draft to false.
      id: "project-database",
      draft: true,
      size: "compact",
      title: "Database Project",
      when: "Fall 2026 · CS 443 Database Systems",
      summary: "",
      stack: ["SQL"],
      links: [],
    },
  ],

  /* ------------------------------------------------------------------------
     SKILLS (one strip under Experience)
     ------------------------------------------------------------------------ */
  skills: [
    { group: "Sales", items: ["Discovery & qualification", "Consultative selling", "Objection handling", "Public speaking", "Live demos"] },
    { group: "Technical", items: ["Python", "SQL", "REST APIs", "Machine learning", "Data pipelines (ETL)", "LLM APIs (Gemini)", "FastAPI", "Next.js"] },
    { group: "Tools", items: ["Git", "Claude Code", "CLI", "Enablement writing", "Playbooks", "Process mapping"] },
  ],
};
