/* ===========================================================================
   OSTENDIC — CONTENT DATA
   Single source of truth for every page. Real Ostendic facts only.
   Visible copy follows OSTENDIC_UPDATED_WEBSITE_CONTENT.md — change it there
   first, then here. Anything not yet verifiable is marked TEMP-PLACEHOLDER
   and must be replaced during the content pass.
   =========================================================================== */

export const site = {
  name: 'Ostendic',
  tagline: 'AI strategy & enablement',
  url: 'https://www.ostendic.com',
  email: 'harsh@ostendic.com',
  whatsapp: 'https://wa.me/', // TEMP-PLACEHOLDER: add the real WhatsApp number
  booking: '/contact',        // TEMP-PLACEHOLDER: swap for a real scheduler link if one exists
  principal: 'Harsh Dubey',
  principalImage: 'assets/harsh-dubey.jpg',
  principalRole: 'Founder',
  principalBio: 'Brand & AI Strategist',
  markets: ['United States', 'United Kingdom', 'Europe', 'India'],
  founded: '2024',
  /* Positioning — used for meta descriptions and structured data */
  sub: 'Ostendic helps founders, agency owners, and teams turn AI into a practical business capability through strategy, coaching, training, workflow design, and ongoing advisory.',
  mechanism: 'AI is the mechanism. The outcomes are better decisions, less repetitive work, stronger systems, and more capable teams.',
  footer: 'Ostendic helps businesses turn AI into practical capability through strategy, coaching, training, and intelligent systems.',
  social: [
    ['LinkedIn', 'https://www.linkedin.com/'],   // TEMP-PLACEHOLDER: real profile URLs
    ['Instagram', 'https://www.instagram.com/'],
  ],
};

/* ---------- PRIMARY CTAs ---------- */
export const cta = {
  primary: 'Book an AI Strategy Call',
  header: 'Start an AI Conversation',
  email: 'Send an Email',
};

/* ---------- HERO ---------- */
export const heroCopy = {
  eyebrow: 'AI strategy, enablement & practical implementation',
  lines: ['Turn AI into a capability', 'your business can {rely on.}'],
  lead: 'Ostendic helps founders, agency owners, and teams understand where AI can create real leverage—and turn that understanding into practical workflows, trained people, and systems that improve how the business operates.',
  secondary: 'See How We Help',
  support: ['Strategy', 'Coaching', 'Team Training', 'AI Systems'],
};

/* ---------- INTRO ---------- */
export const intro = {
  lines: ['Most businesses do not need', '{more AI tools.}'],
  lead: 'They need a clearer way to decide what is useful, what is noise, and how AI should fit into the way they already work.',
  body: [
    'Ostendic helps you move from experimenting with AI to using it with purpose.',
    'We work across strategy, education, workflows, and implementation so your people can make better use of AI every day.',
  ],
};

/* ---------- SERVICES ----------
   `focus` lists the areas each description already names, so the card
   visual never introduces a claim the copy does not make. */
export const services = [
  {
    slug: 'ai-strategy', title: 'AI Strategy', icon: 'layers',
    desc: 'Identify where AI can create the greatest advantage across sales, research, operations, finance, and customer experience.',
    focus: ['Sales', 'Research', 'Operations', 'Finance', 'Customer experience'],
  },
  {
    slug: 'ai-coaching', title: 'AI Coaching', icon: 'spark',
    desc: 'Work directly with founders, freelancers, and agency owners to build better systems for research, lead generation, proposals, content, and delivery.',
    focus: ['Research', 'Lead generation', 'Proposals', 'Content', 'Delivery'],
  },
  {
    slug: 'team-training', title: 'Team Training', icon: 'grid',
    desc: 'Teach employees how to use generative and agentic AI confidently, responsibly, and effectively in their existing roles.',
    focus: ['Generative AI', 'Agentic AI', 'Confidently', 'Responsibly', 'Effectively'],
  },
  {
    slug: 'ai-workflow-design', title: 'AI Workflow Design', icon: 'flow',
    desc: 'Turn repetitive processes into practical AI-assisted workflows, including research systems, sales assistants, internal knowledge systems, and AI employees.',
    focus: ['Research systems', 'Sales assistants', 'Internal knowledge systems', 'AI employees'],
  },
  {
    slug: 'ongoing-advisory', title: 'Ongoing Advisory', icon: 'compass',
    desc: 'Get an experienced strategic partner who helps your business keep improving as the technology and opportunities change.',
    focus: ['Strategic partner', 'Keep improving', 'As technology changes', 'As opportunities change'],
  },
];
export const servicesHead = ['From AI curiosity to', '{practical capability.}'];

/* ---------- WHO WE HELP ---------- */
export const audiences = [
  { title: 'Freelancers & New Agency Owners', icon: 'rocket',
    desc: 'Find better prospects, understand them faster, improve your outreach, and build delivery systems that give you more capacity.' },
  { title: 'Growing Businesses', icon: 'bolt',
    desc: 'Find the parts of your business where AI can reduce friction, improve decision-making, and help your team work with more leverage.' },
  { title: 'Leadership & Operations Teams', icon: 'mark',
    desc: 'Create a practical AI roadmap and help your people adopt AI in a way that is useful, safe, and connected to business priorities.' },
];
export const audiencesHead = ['Built for people who want to use AI well—', '{not simply use more of it.}'];

/* ---------- SIGNATURE OUTCOME ---------- */
export const signature = {
  lines: ['Build the AI advantage', '{inside your business.}'],
  examples: [
    'That might mean helping a freelancer identify and qualify 100 relevant prospects in an afternoon.',
    'It might mean creating an AI research assistant, sales assistant, finance assistant, or internal knowledge system.',
    'Or it might mean giving an entire team the confidence to use AI properly in their daily work.',
  ],
  close: [
    'The technology is only one part of the work.',
    'The real value comes from knowing what to build, how to use it, and where human judgment still matters.',
  ],
};

/* ---------- PROCESS ---------- */
export const processHead = ['A practical approach', 'to {AI adoption.}'];
export const process = [
  ['01', 'Understand', 'We learn how your business works, where time is being lost, and where decisions are getting stuck.'],
  ['02', 'Prioritise', 'We identify the opportunities that are most useful, realistic, and valuable—not simply the most impressive.'],
  ['03', 'Design', 'We create the strategy, workflows, prompts, training, or AI systems needed to support the opportunity.'],
  ['04', 'Enable', 'We train the people who will use the system and make sure it fits naturally into the way they work.'],
  ['05', 'Improve', 'We review what is working, what is not, and how the system should evolve over time.'],
];

/* ---------- POINT OF VIEW ---------- */
export const pov = {
  lines: ['No AI theatre.', '{Just useful progress.}'],
  body: [
    'You do not need another presentation filled with predictions about the future of AI.',
    'You need someone who can understand your business, explain the opportunities clearly, and help you turn them into something your people can actually use.',
    'Ostendic combines strategic thinking, practical experimentation, and hands-on coaching to make AI useful in the real world.',
  ],
};

/* ---------- ABOUT ---------- */
export const aboutCopy = {
  lines: ['AI strategy with a', '{human point of view.}'],
  body: [
    'Ostendic was founded by Harsh Dubey to help people and businesses make sense of a rapidly changing technological landscape.',
    'The goal is not to replace human thinking with automation.',
    'It is to remove unnecessary effort, improve the quality of decisions, and give people more capacity to do meaningful work.',
  ],
};

/* ---------- FINAL CTA ---------- */
export const finalCta = {
  lines: ['You do not need to transform', 'your entire business {overnight.}'],
  body: [
    'Start with one process, one team, or one clear opportunity.',
    'We will help you understand what is possible and decide what is worth doing next.',
  ],
};

/* ---------- CLIENT / LOGO WALL ----------
   `clients` are real Ostendic client brands and the only company names on
   the deck. The marks are typographic wordmarks drawn in-house; set `src`
   to an official logo file (e.g. 'assets/logos/vms-careline.svg') to render
   that artwork instead. Add real, cleared clients here as they come.

   `teamTypes` fill the remaining cards. They are the audiences named in the
   content spec, rendered as plain descriptors with a UI icon — deliberately
   not styled as logos, so no card implies a client relationship. */
export const clients = [
  { name: 'VMS Careline', mark: 'careline', src: '' },
  { name: 'VMS',          mark: 'vms',      src: '' },
];

export const teamTypes = [
  'Founders', 'Freelancers', 'Agency owners', 'Growing businesses',
  'Leadership teams', 'Operations teams', 'Sales teams', 'Research teams',
  'Finance teams', 'Customer experience', 'New agencies', 'Delivery teams',
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
  { slug: 'ai-where-it-pays', cat: 'Strategy', read: '10 min',
    art: 'assets/insights/ai.svg',
    title: 'Where AI actually pays for itself in a small business',
    desc: 'A working note on the difference between AI that removes effort and AI that just adds another tool to check.' },
  { slug: 'after-the-workshop', cat: 'Training', read: '8 min',
    art: 'assets/insights/web.svg',
    title: 'Why AI adoption stalls after the first workshop',
    desc: 'Most teams do not lack access to AI. They lack a shared sense of when to use it, and where human judgment still matters.' },
  { slug: 'one-process-first', cat: 'Workflows', read: '12 min',
    art: 'assets/insights/automation.svg',
    title: 'Start with one process, not a transformation',
    desc: 'How to choose the first AI-assisted workflow worth building — and how to tell whether it is actually working.' },
];
export const postCategories = ['All', 'Strategy', 'Training', 'Workflows', 'Leadership'];

/* ---------- NAV ---------- */
export const nav = [
  ['What We Do', '/#what-we-do'],
  ['Who We Help', '/#who-we-help'],
  ['How It Works', '/#how-it-works'],
  ['Insights', '/blog'],
  ['About', '/about'],
  ['Book a Conversation', '/contact'],
];

export const footerQuick = [
  ['About', '/about'], ['Insights', '/blog'], ['Resources', '/resources'],
  ['Careers', '/careers'], ['Contact', '/contact'],
];
