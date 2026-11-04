/* ===========================================================================
   OSTENDIC — CONTENT DATA
   Single source of truth for every page. Real Ostendic facts only.
   Positioning: a digital studio with two service pillars —
     01  Web Development & UI/UX Design
     02  Agentic AI Workflows
   Both carry equal weight; no section should read as AI-only or as
   web-only. (OSTENDIC_UPDATED_WEBSITE_CONTENT.md describes the earlier
   AI-strategy positioning and is superseded by this file.)
   Anything not yet verifiable is marked TEMP-PLACEHOLDER and must be
   replaced during the content pass — never presented as a client claim.
   =========================================================================== */

export const site = {
  name: 'Ostendic',
  tagline: 'Web development, UI/UX design & agentic AI workflows',
  url: 'https://www.ostendic.com',
  email: 'harsh@ostendic.com',
  whatsapp: 'https://wa.me/', // TEMP-PLACEHOLDER: add the real WhatsApp number
  booking: '/contact',        // TEMP-PLACEHOLDER: swap for a real scheduler link if one exists
  principal: 'Harsh Dubey',
  principalImage: 'assets/harsh-dubey.jpg',
  principalRole: 'Founder',
  principalBio: 'Brand & AI Strategist',
  /* Brand mark. The supplied artwork is a black wordmark on a wide white
     canvas, so `ink` records the wordmark's own bounding box inside it. The
     header and footer lockups pass these numbers to CSS as custom properties
     and crop to `ink`, which keeps the artwork's exact aspect ratio and means
     the source file is never edited, recoloured or re-exported. */
  logo: {
    src: 'assets/ostendic-logo.jpg',
    w: 1746, h: 901,                          // intrinsic pixel size
    ink: { x: 296, y: 330, w: 1159, h: 223 }, // wordmark bounds within it
  },
  markets: ['United States', 'United Kingdom', 'Europe', 'India'],
  founded: '2024',
  /* Positioning — used for meta descriptions and structured data */
  sub: 'Ostendic is a digital studio for website design and development, UI/UX design and agentic AI workflows. We help businesses build better digital experiences and smarter business systems.',
  approach: 'Every engagement starts with the business problem, not the technology. Sometimes the answer is a better website or digital product. Sometimes it is an intelligent workflow. Often it is both.',
  footer: 'Ostendic is a digital studio that designs and builds websites, digital products and agentic AI workflows for businesses ready to grow.',
  social: [
    ['LinkedIn', 'https://www.linkedin.com/'],   // TEMP-PLACEHOLDER: real profile URLs
    ['Instagram', 'https://www.instagram.com/'],
  ],
};

/* ---------- PRIMARY CTAs ---------- */
export const cta = {
  primary: 'Book a 30-minute call',
  header: 'Book a 30-minute call',
  secondary: 'Explore our services',
  email: 'Send an Email',
};

/* ---------- HERO ---------- */
export const heroCopy = {
  eyebrow: 'A digital studio for web experiences and intelligent systems',
  lines: ['Build better {digital experiences.}', 'Create smarter {business systems.}'],
  lead: 'From UI/UX design and web development to agentic AI workflows, Ostendic helps businesses build the digital experiences and intelligent systems they need to move forward.',
  support: ['UI/UX Design', 'Web Development', 'Agentic AI Workflows'],
};

/* ---------- INTRO ---------- */
export const intro = {
  lines: ['Your customers see the website.', '{Your team runs what sits behind it.}'],
  lead: 'Most businesses need both to work well: a digital experience that explains what they do and earns trust, and systems that handle the repetitive work between an enquiry and a delivered result.',
  body: [
    'Ostendic works across both.',
    'We design and build websites, web applications and digital products — and the agentic AI workflows that connect your tools, coordinate tasks and reduce manual effort. Some businesses need one. Some need both.',
  ],
};

/* ---------- SERVICE PILLARS ----------
   The two pillars are the whole service offer. `focus` is the short,
   grouped list shown in the homepage stack (kept to six so the card never
   reads as a directory); `services` is the full list on the pillar page. */
export const pillars = [
  {
    slug: 'web-development', n: '01', icon: 'code',
    title: 'Web Development & UI/UX Design',
    short: 'Web Development & UI/UX',
    path: '/services/web-development',
    kicker: 'Digital experiences that communicate clearly',
    desc: 'We design and develop websites, applications and digital products that combine thoughtful user experiences with reliable technology.',
    long: [
      'We do not simply create attractive websites. We design and build digital experiences that are intuitive, functional, responsive and aligned with what the business needs them to do.',
      'That means understanding your customers and your offer first, structuring the experience around how people actually decide, and building it on technology your team can rely on and maintain.',
    ],
    focus: ['Website design & development', 'UI/UX design', 'Web applications', 'E-commerce', 'SaaS & MVP development', 'Redesigns & improvements'],
    services: [
      ['Website Design and Development', 'Business websites planned around what visitors need to understand, designed with care and built to load quickly on every device.'],
      ['UI/UX Design', 'User flows, wireframes, prototypes and interface design that make websites and products easier to understand and easier to use.'],
      ['Custom Website Development', 'Hand-built sites for requirements a template cannot meet — custom layouts, interactions, integrations and content structures.'],
      ['Web Application Development', 'Browser-based tools, portals and dashboards that your customers or your team use to get real work done.'],
      ['Landing Page Design and Development', 'Focused pages for a campaign, product or offer, with one clear message and one clear next step.'],
      ['E-commerce Development', 'Online stores designed around how customers browse, compare and buy, from product discovery through to checkout.'],
      ['WordPress and Shopify Development', 'Sites and stores on platforms your team can update without a developer, configured and extended to fit the business.'],
      ['SaaS and MVP Development', 'Product design and development for software ideas, scoped to the smallest version that is genuinely useful.'],
      ['Website Redesign and Digital Experience Improvements', 'A structured review of an existing site or product, followed by the changes that make it clearer, faster and easier to use.'],
      ['Responsive and Mobile-First Development', 'Layouts designed for the phone first and refined for larger screens, so every visitor gets a complete experience.'],
    ],
    principles: [
      ['Clarity before decoration', 'Visitors should understand what you do, who it is for and what to do next within a few seconds.'],
      ['Designed for real use', 'Interfaces are shaped around the tasks people come to complete, on the devices they actually use.'],
      ['Built to be maintained', 'Clean structure and sensible platforms, so the site or product stays easy to update as the business grows.'],
    ],
  },
  {
    slug: 'agentic-ai-workflows', n: '02', icon: 'flow',
    title: 'Agentic AI Workflows',
    short: 'Agentic AI Workflows',
    path: '/services/agentic-ai-workflows',
    kicker: 'Intelligent systems that perform coordinated work',
    desc: 'We build intelligent AI-powered workflows that connect tools, coordinate tasks and help businesses operate more efficiently.',
    long: [
      'An agentic workflow is a system in which AI agents take on defined steps of a business process — reading incoming information, making routine decisions, updating your tools and handing work on to the next step or to a person.',
      'We design these systems around practical business work: handling enquiries, following up with leads, supporting customers, processing information and producing reports. Not experimental research, and not a generic chatbot.',
    ],
    focus: ['AI agents for operations', 'Multi-agent systems', 'Process automation', 'Lead management & follow-up', 'Customer support workflows', 'API & tool integrations'],
    services: [
      ['Agentic AI Workflow Development', 'Workflows where AI agents take on defined steps — reading inputs, making routine decisions and passing work to the next tool or person.'],
      ['AI Agents for Business Operations', 'Agents that handle recurring operational tasks such as sorting requests, preparing documents or updating records, with people reviewing where it matters.'],
      ['Multi-Agent Systems', 'Several specialised agents working together on a larger process, each responsible for one part, with clear handovers between them.'],
      ['AI-Powered Business Process Automation', 'Repetitive processes mapped, simplified and automated, so work moves between your tools without being re-typed.'],
      ['Lead Management and Follow-up Automation', 'New enquiries captured, qualified, routed to the right person and followed up consistently, so fewer leads go cold.'],
      ['AI-Powered Customer Support Workflows', 'Incoming questions sorted, answered from your own information where appropriate, and escalated to your team when a person is needed.'],
      ['Content and Marketing Automation', 'Workflows that help research, draft, adapt and schedule content, with your team approving what gets published.'],
      ['Intelligent Data Processing and Reporting', 'Information extracted from documents, forms and spreadsheets, organised consistently and turned into regular reports.'],
      ['API and Third-Party Integrations', 'Connections between your CRM, forms, email, spreadsheets and other tools, so information reaches the place it is needed.'],
      ['Custom AI Business Systems', 'Purpose-built systems for a process specific to your business, designed around the way your team already works.'],
    ],
    principles: [
      ['Practical, not experimental', 'Every workflow is tied to a real task the business performs today, and to the time or effort it should save.'],
      ['People stay in control', 'Agents handle the routine steps. Decisions that need judgment are routed to the right person for review.'],
      ['Connected to your tools', 'Workflows are built around the CRM, inbox, forms and spreadsheets you already use rather than replacing them.'],
    ],
  },
];
export const servicesHead = ['Two disciplines.', '{One studio.}'];

/* ---------- WHAT YOU CAN COME TO US FOR ---------- */
export const audiences = [
  { title: 'A website or digital product', icon: 'globe',
    desc: 'A new website, landing page, online store, web application or MVP — designed and built around your customers and your goals.' },
  { title: 'UI/UX design', icon: 'layers',
    desc: 'User research, flows, wireframes and interface design for a new product, or a clearer experience for an existing one.' },
  { title: 'An intelligent workflow or AI agent', icon: 'flow',
    desc: 'An agentic workflow that takes repetitive work off your team — from lead follow-up to support, data processing and reporting.' },
  { title: 'Web and AI, together', icon: 'bolt',
    desc: 'A website or product with intelligent workflows behind it, so the experience customers see and the system your team runs work as one.' },
];
export const audiencesHead = ['Come to us with a website, a workflow,', '{or both.}'];

/* ---------- SIGNATURE OUTCOME ---------- */
export const signature = {
  lines: ['One studio for the experience', '{and the system behind it.}'],
  examples: [
    'That might mean a redesigned website that explains what you do in seconds and works properly on every screen.',
    'It might mean an agentic workflow that captures new enquiries, qualifies them, updates your CRM and drafts the follow-up for your team to review.',
    'Or it might mean a web application with intelligent automation behind it, handling the repetitive steps so your people can focus on the work that needs them.',
  ],
  close: [
    'Design, development and automation are only valuable when they serve the business.',
    'The real work is understanding what needs to change — then building the right thing, and building it well.',
  ],
};

/* ---------- PROCESS ----------
   Written so it fits a website project, an AI workflow, or both. */
export const processHead = ['Understand the business first.', '{Then choose the right solution.}'];
export const process = [
  ['01', 'Discover', 'We understand the business, its objectives, its users and the challenges it is facing today.'],
  ['02', 'Strategize', 'We define the experience, architecture, workflow and implementation approach that fits the requirement.'],
  ['03', 'Design & Build', 'We create the website, interface, application or intelligent workflow, with regular reviews along the way.'],
  ['04', 'Launch & Optimize', 'We test, deploy, measure and improve the solution once real people are using it.'],
];

/* ---------- POINT OF VIEW ---------- */
export const pov = {
  lines: ['Not just attractive.', '{Genuinely useful.}'],
  body: [
    'A website can look impressive and still fail to explain what a business does. An AI tool can be clever and still add work instead of removing it.',
    'We design digital experiences that are intuitive, functional and aligned with business objectives — and intelligent systems that perform real, coordinated tasks.',
    'Whether the answer is a better website, a smarter workflow or both, the test is the same: does it help the business work better?',
  ],
};

/* ---------- ABOUT ---------- */
export const aboutCopy = {
  lines: ['Where brand, technology', 'and {intelligent systems meet.}'],
  body: [
    'Ostendic was founded by Harsh Dubey to help businesses build digital experiences and business systems that genuinely work.',
    'How a business presents itself and how it operates are closely connected. Brand, design and technology should not be separate conversations.',
    'Ostendic brings them together — thoughtful UI/UX design, reliable web development and practical agentic AI workflows — so businesses can communicate clearly, serve customers better and spend less time on repetitive work.',
  ],
};

/* ---------- FINAL CTA ---------- */
export const finalCta = {
  lines: ['Start with one page, one product,', 'or {one process.}'],
  body: [
    'Whether you need a better website, a new digital product or an intelligent workflow, a short conversation is the best place to start.',
    'We will help you understand what is possible and decide what is worth doing next.',
  ],
};

/* ---------- CLIENT SHOWCASE (logo marquee) ----------
   Exactly these four brands, in this order, and no others.

   `src` is official logo artwork. VMS Careline uses the supplied
   "Careline Logo_2.png", cropped to its own bounds (transparent margin
   removed, nothing redrawn) as assets/logos/vms-careline.png; w/h are that
   file's pixel size so the slot keeps the logo's exact aspect ratio.

   Brands without a supplied logo file render as a typographic wordmark of
   their exact name. `style` picks one of a few restrained treatments.
   Swap in `src` (+ w/h) when official artwork arrives. */
export const brands = [
  { name: 'VMS Careline',  src: 'assets/logos/vms-careline.png', w: 900, h: 290 },
  { name: 'TrueReview',    style: 'split', parts: ['True', 'Review'] },
  { name: 'Viral Check',   style: 'caps' },
  { name: 'Launch Mirror', style: 'serif' },
];

/* ---------- WORK ----------
   Restored from the project records. Only what was actually delivered is
   described. `kind: 'demo'` marks Ostendic-built demonstration projects —
   they are never presented as client work. The VMS Careline result claim
   that used to sit here (client-reported, no figure) is deliberately not
   rendered until it is confirmed and measurable. */
export const projects = [
  {
    slug: 'vms-careline', name: 'VMS Careline', kind: 'client',
    category: 'E-commerce', sector: 'Healthcare e-commerce',
    market: 'India', year: '2026',
    url: 'https://vmscareline.com/',
    image: 'assets/work/vms-careline.jpg',
    summary: 'Brand structure, e-commerce experience and enquiry handling rebuilt across two business verticals.',
    disciplines: ['Brand', 'UI/UX Design', 'Website Development', 'E-commerce', 'Enquiry Automation'],
    pillars: ['web-development', 'agentic-ai-workflows'],
    before: 'One undifferentiated digital presence carried two quite different offerings. Customers arriving for either had to work out which part of the business they were in. Enquiries were handled manually, and time to first response depended on who was available.',
    decision: 'Separate the business into distinct digital verticals — VMS Careline and VMS Cart — each with its own audience, structure and buying path. Rebuild the commerce experience around how these products are actually chosen, and automate the enquiry path so response time stops depending on availability.',
    after: 'A healthcare e-commerce experience with clearer product discovery and stronger presentation, a separate cart vertical, and an automated path from enquiry through first response to follow-up.',
  },
  {
    slug: 'trureview', name: 'TruReview', kind: 'demo',
    category: 'UI/UX Design', sector: 'Review platform concept',
    market: '—', year: '2026',
    url: 'https://tru-review-lilac.vercel.app/',
    image: 'assets/work/trureview.jpg',
    summary: 'A review-collection interface, built as a working demonstration of our product design and web development approach.',
    disciplines: ['UI/UX Design', 'Web Application'],
    pillars: ['web-development'],
  },
  {
    slug: 'viralcheck', name: 'ViralCheck Content', kind: 'demo',
    category: 'Web Application', sector: 'Content analysis concept',
    market: '—', year: '2026',
    url: 'https://viralcheckcontent.vercel.app/',
    image: 'assets/work/viralcheck.jpg',
    summary: 'A content-scoring tool, built as a working demonstration of an AI-assisted product interface.',
    disciplines: ['UI/UX Design', 'Web Application', 'AI-assisted'],
    pillars: ['web-development', 'agentic-ai-workflows'],
  },
];
export const workCategories = ['All', 'E-commerce', 'UI/UX Design', 'Web Application'];

/* ---------- ENGAGEMENT / PRICING ----------
   Restored from the earlier engagement models. No figures, durations or
   guarantees are published: each engagement is scoped and priced first. */
export const engagements = [
  {
    name: 'Diagnostic', price: 'Fixed fee', unit: 'scoped up front',
    desc: 'A short, paid review that produces a written diagnosis of your website, product or process — what is getting in the way, where time or enquiries are being lost, and a scoped, priced plan.',
    includes: ['Website, UX or workflow review', 'Written findings and priorities', 'Recommended approach — web, AI or both', 'Scoped plan with fixed pricing'],
    cta: 'Start with a diagnostic',
  },
  {
    name: 'Project', price: 'Scoped', unit: 'fixed fee, agreed scope',
    desc: 'A website, digital product or agentic AI workflow delivered against an agreed scope. Design, development and automation are handled by one team rather than handed between vendors.',
    includes: ['Fixed scope agreed up front', 'Websites, products or AI workflows', 'Design and build in one team', 'Testing before launch', 'Handover documentation'],
    featured: true,
    cta: 'Scope a project',
  },
  {
    name: 'Ongoing', price: 'Monthly', unit: 'retained capacity',
    desc: 'Retained time each month across design, development and AI workflows — for websites, products and systems that keep improving after launch.',
    includes: ['Agreed monthly capacity', 'Priorities set with you each cycle', 'Design, development and automation', 'Direct access to the founder', 'Adjust or pause with notice'],
    cta: 'Talk about retained work',
  },
];

/* ---------- RESOURCES ---------- */
export const resources = [
  {
    title: 'AI Income Starter Framework',
    cat: 'Guide', format: 'DOCX', price: 'Free',
    desc: 'A practical framework for building a first AI-assisted income stream — tools, structure and execution order for founders and operators.',
    href: 'AI Income Starter Framework Final.docx',
  },
];
export const resourceCategories = ['All', 'Guide', 'Template', 'Checklist'];

/* ---------- INSIGHTS ---------- */
export const posts = [
  { slug: 'premium-website-feel', cat: 'Web & UX', read: '8 min',
    art: 'assets/insights/web.svg',
    title: 'What makes a website feel expensive',
    desc: 'Restraint, typography and evidence — why the sites that look costly are usually the ones doing the least on screen.' },
  { slug: 'ai-where-it-pays', cat: 'AI Workflows', read: '10 min',
    art: 'assets/insights/ai.svg',
    title: 'Where AI actually pays for itself in a small business',
    desc: 'A working note on the difference between a workflow that removes effort and one that just adds another tool to check.' },
  { slug: 'enquiry-to-reply', cat: 'Business', read: '12 min',
    art: 'assets/insights/automation.svg',
    title: 'The gap between an enquiry and a reply',
    desc: 'Most businesses lose more at the follow-up stage than on the page itself. How we map that path before touching a design or a workflow.' },
];
export const postCategories = ['All', 'Web & UX', 'AI Workflows', 'Business'];

/* ---------- NAV ----------
   [label, href, children?] — Services opens a two-item menu, one per pillar. */
export const nav = [
  ['Services', '/services', pillars.map(p => [p.title, p.path])],
  ['Work', '/work'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
  ['Insights', '/blog'],
  ['Resources', '/resources'],
  ['Contact Us', '/contact'],
];

export const footerQuick = [
  ['Work', '/work'], ['Pricing', '/pricing'], ['About', '/about'],
  ['Insights', '/blog'], ['Resources', '/resources'], ['Careers', '/careers'], ['Contact', '/contact'],
];
