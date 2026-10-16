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
  githubUser: "okelberrye-cloud",
  resume: "assets/Ethan_Okelberry_Resume.pdf",

  status: "Open to Sales Engineering & Solutions Consulting roles",

  // Rotating line under the name in the hero.
  roles: [
    "Aspiring Sales Engineer",
    "ex-Cisco Technical Sales Engineering Intern",
    "AWS Student Builder Campus Leader",
    "Founding team, live commerce startup",
    "CS @ Cal State San Marcos",
  ],

  headline: "I build it. I sell it.",

  summary:
    "I'm a Computer Science student at Cal State San Marcos going after Sales Engineering and Solutions Consulting roles. I was a Technical Sales Engineering Intern at Cisco, I'm an AWS Student Builder Campus Leader, and I was the first hire at a live commerce startup where I sold at 2× quota.",

  // Logo strip under the hero.
  credentials: [
    { logo: "cisco", title: "Technical Sales Engineering Intern", note: "Summer 2026" },
    { logo: "aws", title: "Student Builder Campus Leader", note: "2026 · via NEXT GEN·TEAM" },
  ],

  // The startup numbers strip under the logos.
  startup: {
    label: "Founding team member at a live digital commerce startup",
    stats: [
      { value: 2, suffix: "×", label: "Quota, hosting live sales streams" },
      { value: 500, suffix: "+", label: "Live viewers per stream" },
      { value: 10, suffix: "+", label: "Sellers as the startup scaled" },
      { value: 4, suffix: "", label: "Sellers I led" },
    ],
  },

  /* ------------------------------------------------------------------------
     01 / DISCOVERY: a recruiter picks what the role needs and gets proof.
     ------------------------------------------------------------------------ */
  defaultNeeds: ["demo"],
  needs: [
    {
      id: "demo",
      label: "Runs technical demos & presentations",
      evidence: [
        { src: "Cisco", text: "Built a 10-minute presentation teaching Cisco AI Infrastructure, with a live simulation of how one slow network link stalls an entire GPU cluster.", href: "#project-cisco-ai" },
        { src: "Cisco", text: "Presented my intern capstone, an AI-driven solution, to Cisco's Head of AI.", href: "#exp-cisco" },
        { src: "Flash Bang Authentics", text: "Hosted live sales streams on TikTok for 500+ viewers at a time.", href: "#exp-flashbang" },
        { src: "AWS", text: "Hosts cloud fundamentals workshops at Cal State San Marcos.", href: "#exp-aws" },
      ],
    },
    {
      id: "translate",
      label: "Translates tech into business value",
      evidence: [
        { src: "Cisco", text: "Researched and wrote customer-facing reference docs for a Cisco product sold to universities.", href: "#exp-cisco" },
        { src: "Cisco", text: "Turned a full AI infrastructure stack (GPUs, networking, storage, management) into a 10-minute talk anyone can follow.", href: "#project-cisco-ai" },
        { src: "Flash Bang Authentics", text: "Explained product value live, in real time, to hundreds of viewers per stream.", href: "#exp-flashbang" },
      ],
    },
    {
      id: "ai",
      label: "Proficient in AI tools",
      evidence: [
        { src: "Claude", text: "Builds custom Claude skills and connectors, like one that pulls lecture transcripts from Otter and files them in Google Drive." },
        { src: "Gemini", text: "Uses Gemini in my outreach agent to write a personal email for every contact it finds.", href: "#project-outreach" },
        { src: "Make.com", text: "Built a 7-module automation that runs the whole outreach process with no manual steps.", href: "#project-outreach" },
        { src: "Sora", text: "Made AI marketing videos with Sora for Flash Bang Authentics.", href: "#exp-flashbang" },
        { src: "Cisco", text: "Led an intern capstone on an AI-driven solution, presented to Cisco's Head of AI.", href: "#exp-cisco" },
      ],
    },
    {
      id: "sell",
      label: "Handles objections & closes",
      evidence: [
        { src: "Flash Bang Authentics", text: "Beat quota by 2× using objection handling and upselling, live on camera.", href: "#exp-flashbang" },
        { src: "Flash Bang Authentics", text: "Led 4 sellers and wrote the stream scripts and offers that made closing more consistent.", href: "#exp-flashbang" },
        { src: "Cisco", text: "Shadowed senior Solutions Engineers through real enterprise sales cycles.", href: "#exp-cisco" },
      ],
    },
  ],

  /* ------------------------------------------------------------------------
     02 / EXPERIENCE
     logo: "cisco" or "aws" uses js/logos.js. Otherwise `mark` shows as a badge.
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
      bullets: [
        "Led an intern capstone to find and build an AI-driven solution, and presented it to Cisco's Head of AI.",
        "Contributed to a new sales enablement project for a Cisco product in higher education, researching, writing and structuring the customer-facing reference docs.",
        "Built a 10-minute presentation teaching Cisco AI Infrastructure, from why the network matters to how Cisco's AI PODs fit together.",
        "Shadowed senior Solutions Engineers and learned how enterprise sales cycles actually run.",
      ],
    },
    {
      id: "exp-aws",
      logo: "aws",
      company: "NEXT GEN·TEAM",
      companyNote: "AWS Student Builder program",
      role: "AWS Student Builder Campus Leader",
      dates: "Aug 2026 – Present",
      location: "San Marcos, CA",
      color: "#ff9900",
      bullets: [
        "Selected to represent the AWS Student Builder program at Cal State San Marcos.",
        "Host cloud fundamentals workshops and get students started on AWS Builder Center, AWS services and certifications.",
        "Set up a CSUSM Discord community for students learning to build on AWS.",
      ],
    },
    {
      id: "exp-flashbang",
      mark: "FB",
      company: "Flash Bang Authentics",
      companyNote: "Live digital commerce startup",
      role: "Sports Break Host / Founding Team Member",
      dates: "Sep 2025 – May 2026",
      location: "San Marcos, CA",
      color: "#e5484d",
      stats: [
        { value: "2×", label: "quota" },
        { value: "500+", label: "viewers per stream" },
        { value: "10+", label: "sellers" },
        { value: "4", label: "sellers led" },
      ],
      bullets: [
        "First employee at a live commerce startup selling licensed sports merchandise on TikTok Live, which grew to 10+ sellers and 500+ viewers per stream.",
        "Beat quota by 2× hosting live sales streams, handling objections and upselling in real time.",
        "Led a team of 4 sellers and built the stream scripts and offer structure that made closing more consistent.",
        "Made AI marketing videos with Sora for the brand.",
      ],
    },
    {
      id: "exp-granitebay",
      mark: "GB",
      company: "Granite Bay Golf Club",
      role: "Guest Services / Member Relations",
      dates: "May 2022 – May 2025",
      location: "Granite Bay, CA",
      color: "#30a46c",
      stats: [{ value: "3", label: "years" }],
      bullets: [
        "Gave high-touch service to club members for three years, building long-term relationships that kept members coming back.",
        "Supported tournaments and events, handling logistics and fixing problems on the spot.",
        "Recognized for reliability and professionalism in a fast-paced, customer-facing job.",
      ],
    },
  ],

  education: [
    {
      school: "California State University San Marcos",
      degree: "B.S. in Computer Science",
      dates: "Jan 2026 – May 2027 (expected)",
      location: "San Marcos, CA",
      detail: "Coursework: Data Structures and Algorithms, Discrete Mathematics, Software Engineering (in progress)",
      extra: "Founders Club member",
      main: true,
    },
    {
      school: "Palomar College",
      degree: "Computer Science coursework · 15 units",
      dates: "Aug 2025 – Dec 2025",
      location: "San Marcos, CA",
    },
    {
      school: "Sierra College",
      degree: "Computer Science coursework · 59 units",
      dates: "Aug 2023 – 2025",
      location: "Rocklin, CA",
      extra: "Ranked in the top 10% of my class · Treasurer of the Chess Club",
    },
  ],

  /* ------------------------------------------------------------------------
     03 / PROJECTS
     visual: "outline" (numbered list), "outreach" or "fantasy" (js/demos.js)
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: "project-cisco-ai",
      title: "Cisco AI Infrastructure Presentation",
      when: "2026 · Cisco internship",
      summary:
        "A 10-minute presentation I built to teach Cisco AI Infrastructure to people who have never set up an AI cluster.",
      stack: ["HTML", "JavaScript", "Presenting", "AI infrastructure"],
      link: { label: "View the presentation", href: "https://okelberrye-cloud.github.io/cisco-ai-infrastructure/" },
      visual: "outline",
      outlineTitle: "What the talk covers",
      outline: [
        "Why companies run AI on their own hardware: control, compliance and cost.",
        "A live simulation where one jammed network link drops an 8-GPU cluster from 50 to 21 training steps a minute.",
        "How Cisco's AI POD fits together: UCS servers with NVIDIA GPUs, Nexus networking, partner storage and validated designs.",
        "Built from scratch in HTML and JavaScript. Runs offline, with a timed talk track.",
      ],
    },
    {
      id: "project-outreach",
      title: "Internship Outreach Agent",
      when: "Feb 2026",
      summary:
        "Give it a job listing and it finds the right people at that company, then emails each of them a personal note. One listing turns into up to 15 tailored emails with no manual work.",
      stack: ["Make.com", "Gemini", "Hunter.io", "Gmail"],
      visual: "outreach",
    },
    {
      id: "project-fantasy",
      title: "Fantasy Baseball Pickup Agent",
      when: "2025",
      summary:
        "Every day I have to pick up a pitcher in fantasy baseball, and I never know who to grab. So I built an agent that looks up each pitcher's projected stat line for the day, checks if they're already rostered in my league, and gives me back the top options to pick up.",
      stack: ["Python", "AI agent", "Fantasy baseball"],
      visual: "fantasy",
    },
  ],

  /* ------------------------------------------------------------------------
     04 / SKILLS
     ------------------------------------------------------------------------ */
  skills: [
    { group: "Sales", items: ["Discovery & qualification", "Consultative selling", "Value messaging", "Objection handling", "Live demos"] },
    { group: "Technical", items: ["Python", "SQL", "REST APIs", "Data pipelines (ETL)", "Pandas", "HTML & JavaScript", "Git"] },
    { group: "AI & cloud", items: ["Claude (custom skills)", "Gemini", "Make.com", "Sora", "AWS fundamentals"] },
    { group: "Communication", items: ["Public speaking", "Executive summaries", "Enablement writing", "Cross-functional teamwork"] },
  ],
};
