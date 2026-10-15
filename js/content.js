/* ==========================================================================
   SITE CONTENT
   --------------------------------------------------------------------------
   Everything on the site is rendered from this file. To update the site
   (new job, new project, new stat), edit the data below and push. There's no
   build step.

   Text that has two versions uses { tech: "...", biz: "..." }. The
   "Technical / Business" switch in the nav picks which one is shown.
   ========================================================================== */

window.SITE = {
  name: "Ethan Okelberry",
  initials: "EO",
  location: "San Marcos, CA",
  email: "ethanokelberry824@gmail.com",
  linkedin: "https://www.linkedin.com/in/ethan-okelberry",
  githubUser: "okelberrye-cloud",
  resume: "assets/Ethan_Okelberry_Resume.pdf",

  // Set to a scheduling link (Calendly, Cal.com, etc.) to show a "Book a call" button.
  bookingUrl: "",

  status: "Open to Sales Engineering & Solutions Consulting roles",

  // Rotating line under the name in the hero.
  roles: [
    "Aspiring Sales Engineer",
    "CS @ Cal State San Marcos",
    "ex-Cisco Technical Sales Engineering Intern",
    "AWS Student Builder Campus Leader",
    "Builder of AI automations",
  ],

  headline: "Technical enough to build it. Clear enough to sell it.",

  summary: {
    tech:
      "I'm a Computer Science student who builds with Python, SQL, REST APIs and generative AI, and I can explain every layer of what I build. Former Technical Sales Engineering Intern at Cisco, current AWS Student Builder Campus Leader.",
    biz:
      "I turn complex technology into clear customer value. Former Technical Sales Engineering Intern at Cisco, AWS Student Builder Campus Leader, and the first hire at a live-commerce startup, where I sold at 2× quota.",
  },

  heroBadges: [
    { label: "Cisco", value: "Technical Sales Engineering Intern" },
    { label: "AWS", value: "Student Builder Campus Leader" },
    { label: "2× quota", value: "Live sales, founding team" },
  ],

  stats: [
    { value: 2, suffix: "×", label: "Quota beaten hosting live sales streams" },
    { value: 500, suffix: "+", label: "Live viewers per stream at a startup I helped found" },
    { value: 10, prefix: "Top ", suffix: "%", label: "Of class in Computer Science coursework" },
    { value: 15, suffix: "", label: "Personalized emails per run from my AI outreach agent" },
  ],

  /* ------------------------------------------------------------------------
     01 / DISCOVERY: a recruiter picks what the role needs and gets evidence.
     ------------------------------------------------------------------------ */
  needs: [
    {
      id: "demo",
      label: "Runs technical demos & presentations",
      evidence: [
        { src: "Cisco", text: "Built and delivered a 10-minute interactive explainer on Cisco AI infrastructure, with a live simulation of GPU-cluster networking.", href: "#project-cisco-ai" },
        { src: "Flash Bang Authentics", text: "Hosted live sales streams for 500+ viewers per stream.", href: "#exp-flashbang" },
        { src: "AWS", text: "Hosts cloud fundamentals workshops at Cal State San Marcos as an AWS Student Builder Campus Leader.", href: "#exp-aws" },
      ],
    },
    {
      id: "translate",
      label: "Translates tech into business value",
      evidence: [
        { src: "Cisco", text: "Researched, wrote and structured customer-facing reference documentation for a sales enablement project aimed at higher education.", href: "#exp-cisco" },
        { src: "Sports Analytics", text: "Published recurring projections with clear metrics, assumptions and limitations, written for non-technical readers.", href: "#project-mlb" },
        { src: "This site", text: "Every project here has a Technical and a Business version. Flip the switch at the top of the page." },
      ],
    },
    {
      id: "sell",
      label: "Discovery, objection handling & closing",
      evidence: [
        { src: "Flash Bang Authentics", text: "Beat quota by 2× through objection handling and upsell strategy.", href: "#exp-flashbang" },
        { src: "Cisco", text: "Shadowed senior Solutions Engineers through enterprise sales cycles.", href: "#exp-cisco" },
        { src: "Granite Bay Golf Club", text: "Three years of high-touch member relations: building trust and solving problems fast.", href: "#exp-granitebay" },
      ],
    },
    {
      id: "technical",
      label: "Hands-on technical depth",
      evidence: [
        { src: "Sports Analytics", text: "Built Python pipelines that ingest, clean and model large historical MLB datasets from public REST APIs.", href: "#project-mlb" },
        { src: "Outreach Agent", text: "Connected the Hunter.io REST API, Gemini and Gmail into a 7-module automated pipeline.", href: "#project-outreach" },
        { src: "Education", text: "B.S. in Computer Science at CSUSM (May 2027). Ranked in the top 10% of class in prior CS coursework.", href: "#education" },
      ],
    },
    {
      id: "ai",
      label: "AI & automation",
      evidence: [
        { src: "Outreach Agent", text: "Uses Gemini to write a personalized email for every verified contact, with no manual steps.", href: "#project-outreach" },
        { src: "Cisco", text: "Leading a capstone project to identify and develop an AI-driven solution, with findings for Cisco's Head of AI.", href: "#exp-cisco" },
        { src: "Cisco AI Infrastructure", text: "Explains why AI training clusters depend on lossless, congestion-aware networking.", href: "#project-cisco-ai" },
      ],
    },
    {
      id: "cloud",
      label: "Cloud & infrastructure",
      evidence: [
        { src: "AWS", text: "Drives student engagement with AWS services and certifications as Campus Leader.", href: "#exp-aws" },
        { src: "Cisco AI Infrastructure", text: "Breaks down a full AI stack for a non-specialist audience: GPU compute, AI networking, partner storage, management and validated designs.", href: "#project-cisco-ai" },
      ],
    },
    {
      id: "enable",
      label: "Enablement & documentation",
      evidence: [
        { src: "Cisco", text: "Wrote customer-facing reference documentation for a new sales enablement project.", href: "#exp-cisco" },
        { src: "Flash Bang Authentics", text: "Wrote stream scripts and offer structure that made closing more consistent across the team.", href: "#exp-flashbang" },
        { src: "Cisco AI Infrastructure", text: "Wrote a timed, click-by-click talk track to go with the deck.", href: "#project-cisco-ai" },
      ],
    },
    {
      id: "lead",
      label: "Leadership & ownership",
      evidence: [
        { src: "Flash Bang Authentics", text: "First employee at a startup that scaled to 10+ sellers. Led a team of 4.", href: "#exp-flashbang" },
        { src: "AWS", text: "Selected as AWS Student Builder Campus Leader for Cal State San Marcos.", href: "#exp-aws" },
        { src: "Cisco", text: "Leading the internship capstone project.", href: "#exp-cisco" },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
     02 / TRACK RECORD
     ------------------------------------------------------------------------ */
  experience: [
    {
      id: "exp-cisco",
      mark: "C",
      company: "Cisco",
      role: "Technical Sales Engineering Intern",
      dates: "Jun 2026 – Aug 2026",
      location: "Remote",
      color: "#1ba0d7",
      bullets: [
        "Shadowed and learned directly from senior Solutions Engineers, gaining insight into enterprise sales cycles.",
        "Contributed to a new sales enablement project for a Cisco product targeting the higher education vertical, researching, authoring and structuring customer-facing reference documentation.",
        "Leading a capstone project to identify and develop an AI-driven solution, with findings to be presented to Cisco's Head of AI.",
      ],
      tags: ["Enterprise sales cycles", "Sales enablement", "Higher-ed vertical", "AI solutions"],
    },
    {
      id: "exp-aws",
      mark: "AWS",
      company: "Amazon Web Services",
      role: "AWS Student Builder Campus Leader",
      dates: "Aug 2026 – Present",
      location: "San Marcos, CA",
      color: "#ff9900",
      bullets: [
        "Selected as an AWS Student Campus Leader at Cal State San Marcos, hosting cloud fundamentals workshops and driving student engagement with AWS services and certifications.",
      ],
      tags: ["Workshops", "Cloud fundamentals", "Community building"],
    },
    {
      id: "exp-flashbang",
      mark: "FB",
      company: "Flash Bang Authentics",
      role: "Sports Break Host / Founding Team Member",
      dates: "Sep 2025 – May 2026",
      location: "San Marcos, CA",
      color: "#e5484d",
      bullets: [
        "First employee at a live commerce startup that scaled to 10+ sellers and 500+ viewers per stream.",
        "Hosted live sales streams, exceeding quota by 2× through objection handling and upsell strategy.",
        "Led a team of 4 sellers, building stream scripts and offer structure to raise close consistency.",
      ],
      tags: ["2× quota", "Objection handling", "Team lead", "Live presenting"],
    },
    {
      id: "exp-granitebay",
      mark: "GB",
      company: "Granite Bay Golf Club",
      role: "Guest Services / Member Relations",
      dates: "May 2022 – May 2025",
      location: "Granite Bay, CA",
      color: "#30a46c",
      bullets: [
        "Delivered high-touch member support and event execution, building strong relationships through clear communication, attention to detail and rapid problem resolution.",
      ],
      tags: ["Relationship building", "Event execution", "Problem resolution"],
    },
  ],

  education: [
    {
      school: "California State University San Marcos",
      degree: "B.S. in Computer Science",
      dates: "Jan 2026 – May 2027 (expected)",
      location: "San Marcos, CA",
    },
    {
      school: "Sierra College / Palomar College",
      degree: "Computer Science coursework · Ranked top 10% of class",
      dates: "Aug 2023 – Dec 2025",
      location: "Rocklin, CA / San Marcos, CA",
    },
  ],

  /* ------------------------------------------------------------------------
     03 / DEMOS: each project has an interactive demo (see js/demos.js).
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: "project-cisco-ai",
      title: "Cisco AI Infrastructure: Interactive Explainer",
      when: "2026 · Cisco internship",
      stack: ["HTML", "CSS", "JavaScript", "Animation", "Technical storytelling"],
      demo: "gpu",
      repo: "cisco-ai-infrastructure",
      summary: {
        tech:
          "A self-contained, offline-ready HTML deck (title card and five slides, 11 scripted builds) that teaches Cisco's AI infrastructure stack. The centerpiece simulates an 8-GPU training ring: every step, the GPUs exchange results, and the step can't finish until the slowest link does. Congest one link and throughput drops from about 50 to 21 steps a minute, which is why lossless, congestion-aware Ethernet matters.",
        biz:
          "A 10-minute talk that makes a complex purchase simple: why companies run AI on their own infrastructure (control, compliance, steady-state cost), why the network decides whether very expensive GPUs sit idle, and how Cisco's pre-validated AI PODs take the integration work off the IT team.",
      },
      points: {
        tech: ["8-GPU ring simulation with live throughput and utilization", "Built-in fonts: runs with no internet connection", "Keyboard and clicker navigation, 11 scripted builds"],
        biz: ["Built for a 10-minute slot, with a timed talk track", "Covers control, compliance and cost", "Ends on business value: buying AI capacity, not parts"],
      },
    },
    {
      id: "project-outreach",
      title: "Autonomous Internship Outreach Agent",
      when: "Feb 2026",
      stack: ["Make.com", "REST APIs", "Python", "Gemini AI", "Hunter.io", "Gmail"],
      demo: "outreach",
      summary: {
        tech:
          "A fully automated pipeline of 7 connected modules. It parses a job listing for the company domain and job title, calls the Hunter.io REST API for verified contacts, prompts Gemini to write a personalized email for each one, and sends through Gmail. It dispatches up to 15 tailored emails per request with no manual input.",
        biz:
          "Finding the right person and writing to them is the slowest part of a job search, and the same is true of sales prospecting. This agent turns it into one step: a single job listing in, up to 15 personalized emails to verified contacts out.",
      },
      points: {
        tech: ["7 connected modules", "Hunter.io domain search → verified contacts", "LLM-personalized copy per recipient"],
        biz: ["Zero manual steps per request", "Up to 15 tailored emails per listing", "The same motion as sales prospecting, automated"],
      },
    },
    {
      id: "project-mlb",
      title: "Sports Analytics & AI Prediction Systems",
      when: "May 2025 – Aug 2025",
      stack: ["Python", "SQL", "REST APIs", "ETL", "Data modeling"],
      demo: "mlb",
      summary: {
        tech:
          "Python data pipelines that ingest, clean and model large historical MLB datasets, using public REST APIs to turn raw inputs into structured features and predictive outputs. The end-to-end ETL runs automatically, with scheduled report delivery.",
        biz:
          "Raw baseball data in, plain-English projections out, on a schedule. Each report spells out its metrics, assumptions and limitations, so non-technical readers know exactly how far to trust it.",
      },
      points: {
        tech: ["Automated end-to-end ETL", "REST API ingestion → feature engineering", "Scheduled report delivery"],
        biz: ["Recurring projections, no manual work", "Clear metrics, assumptions and limitations", "Written for non-technical readers"],
      },
    },
  ],

  /* ------------------------------------------------------------------------
     04 / TOOLKIT: each skill links to where it was used (ids from above).
     ------------------------------------------------------------------------ */
  skills: [
    {
      group: "Sales Engineering",
      items: [
        { name: "Discovery & Qualification", used: ["exp-cisco", "exp-flashbang"] },
        { name: "Consultative Selling", used: ["exp-flashbang", "exp-granitebay"] },
        { name: "Value Messaging", used: ["exp-cisco", "project-cisco-ai"] },
        { name: "Objection Handling", used: ["exp-flashbang"] },
      ],
    },
    {
      group: "Technical",
      items: [
        { name: "Python", used: ["project-mlb", "project-outreach"] },
        { name: "SQL", used: ["project-mlb"] },
        { name: "REST APIs", used: ["project-mlb", "project-outreach"] },
        { name: "Data Pipelines (ETL)", used: ["project-mlb"] },
        { name: "Data Analysis", used: ["project-mlb"] },
        { name: "Relational Databases", used: ["project-mlb"] },
      ],
    },
    {
      group: "AI & Cloud",
      items: [
        { name: "Generative AI (Gemini)", used: ["project-outreach"] },
        { name: "Workflow Automation (Make.com)", used: ["project-outreach"] },
        { name: "AWS Cloud Fundamentals", used: ["exp-aws"] },
        { name: "AI Infrastructure", used: ["project-cisco-ai", "exp-cisco"] },
      ],
    },
    {
      group: "Tools & Docs",
      items: [
        { name: "Git", used: ["project-cisco-ai", "github"] },
        { name: "Markdown", used: ["project-cisco-ai"] },
        { name: "CLI / Terminal", used: ["terminal"] },
        { name: "Enablement Writing", used: ["exp-cisco"] },
        { name: "Playbooks", used: ["exp-flashbang"] },
        { name: "Process Mapping", used: ["project-outreach", "exp-flashbang"] },
      ],
    },
    {
      group: "Communication",
      items: [
        { name: "Public Speaking", used: ["project-cisco-ai", "exp-aws"] },
        { name: "Live Presentations", used: ["exp-flashbang", "exp-aws"] },
        { name: "Executive-Friendly Summaries", used: ["exp-cisco", "project-mlb"] },
        { name: "Cross-Functional Collaboration", used: ["exp-cisco", "exp-flashbang"] },
      ],
    },
  ],

  // Extra entries the Toolkit can point to that aren't jobs or projects.
  extraEvidence: {
    github: { title: "GitHub", detail: "This site and my projects live on GitHub. See the live feed below.", href: "#github" },
    terminal: { title: "This site's terminal", detail: "Press ` (backtick) or the >_ button to drive the site from a command line.", href: "#", action: "terminal" },
  },

  /* ------------------------------------------------------------------------
     05 / GITHUB: pulled live from the public GitHub API in the browser.
     ------------------------------------------------------------------------ */
  github: {
    // Repos to show first, in this order.
    featured: ["cisco-ai-infrastructure"],
    // Repos to leave out (this site's own repo, practice repos, etc.).
    hidden: ["ethan_okelberry_personal_website", "okelberrye-cloud.github.io"],
    maxRepos: 6,
    includeForks: false,
    // Fallback descriptions for repos that don't have one on GitHub.
    descriptions: {
      "cisco-ai-infrastructure": "Interactive 10-minute explainer deck on Cisco AI infrastructure, with a live GPU-network simulation.",
    },
  },
};
