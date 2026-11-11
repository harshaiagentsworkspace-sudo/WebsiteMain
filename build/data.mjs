/* ===========================================================================
   OSTENDIC — CONTENT DATA
   Single source of truth for every page.

   Rules for this file:
   - Real Ostendic facts only. Nothing here is invented: no client names,
     results, numbers, testimonials or contact details that have not been
     supplied by the business.
   - A missing fact is `null`. Components that depend on it render nothing
     (or a safe fallback) until it is filled in, and `build.mjs` prints a
     PENDING list on every build so the gaps stay visible.
   - Anything that needs confirmation before it can go public carries
     `publish: false` and a `hold` note explaining why.

   Positioning: a digital studio with two service areas —
     01  Web Development and UI/UX Design
     02  Agentic AI Workflows
   Ostendic builds the digital experience customers use and the connected
   systems a business runs behind it. It is not positioned as an AI agency.
   (OSTENDIC_UPDATED_WEBSITE_CONTENT.md describes an older AI-strategy
   positioning and is superseded.)
   =========================================================================== */

export const site = {
  name: 'Ostendic',
  url: 'https://www.ostendic.com',
  email: 'harsh@ostendic.com',

  /* ---- contact channels: fill these in to switch the matching UI on ----
     phone:    display + dial string, e.g. { display: '+91 98xxx xxxxx', tel: '+9198xxxxxxxx' }
     whatsapp: international number, digits only, e.g. '9198xxxxxxxx'
     booking:  a 30-minute event on Calendly or Cal.com, e.g.
               'https://calendly.com/ostendic/30min'  or  'https://cal.com/ostendic/30min'
               The provider is detected from the URL. Availability, time slots and
               confirmation all come from the provider; nothing is simulated here.
               (BOOKING_URL in the environment overrides this, for local testing only.) */
  phone: null,      // PENDING: business phone number
  whatsapp: null,   // PENDING: business WhatsApp number
  booking: globalThis.process.env.BOOKING_URL || null,   // PENDING: Calendly or Cal.com event link

  /* [label, url] — only real profile URLs. Empty = no social links shown. */
  social: [],       // PENDING: LinkedIn / Instagram profile URLs

  principal: 'Harsh Dubey',
  principalRole: 'Founder',
  principalImage: 'assets/harsh-dubey.jpg',

  /* Brand mark. The supplied artwork is a black wordmark on a wide white
     canvas; `ink` is the wordmark's bounding box inside it. The header and
     footer crop to `ink` in CSS so the file itself is never edited. */
  logo: {
    src: 'assets/ostendic-logo.jpg',
    w: 1746, h: 901,
    ink: { x: 296, y: 330, w: 1159, h: 223 },
  },

  /* meta description + structured data */
  sub: 'Ostendic is a digital studio that designs and builds websites and web applications, and the AI workflows businesses run behind them.',
  footer: 'A digital studio for websites, web applications and the AI workflows behind them.',
};

/* Derived contact helpers — every CTA goes through these, so a CTA can never
   point at an empty or invented destination. */
const bookingHost = site.booking ? new URL(site.booking).hostname.replace(/^www\./, '') : '';
export const bookingProvider = bookingHost === 'calendly.com' ? 'calendly'
  : (bookingHost === 'cal.com' || bookingHost === 'app.cal.com') ? 'cal'
  : null;
if (site.booking && !bookingProvider) throw new Error(`site.booking must be a calendly.com or cal.com URL: ${site.booking}`);

export const links = {
  whatsapp: site.whatsapp ? `https://wa.me/${site.whatsapp}` : null,
  tel: site.phone ? `tel:${site.phone.tel}` : null,
  /* The main "start" CTA: the /book page (real scheduler) if one is
     configured, otherwise the enquiry form. The label follows the destination. */
  start: site.booking ? '/book' : '/contact',
  startLabel: site.booking ? 'Book a 30-minute call' : 'Start a conversation',
};

/* ---------- HERO ---------- */
export const heroCopy = {
  lines: ['Websites your customers use,', '{and the systems behind them.}'],
  lead: 'Ostendic is a small digital studio. We design and build websites and web applications, and set up AI workflows that handle the follow-ups, routing and admin that happen after a customer gets in touch.',
};

/* ---------- SERVICES ----------
   Exactly two service areas. Each carries the same information model so
   visitors can compare them: who it helps, the problem, what we build,
   what an engagement includes. `services` is the fuller list used on the
   service's own page. */
export const pillars = [
  {
    slug: 'web-development', n: '01',
    title: 'Web Development and UI/UX Design',
    short: 'Web development & UI/UX',
    path: '/services/web-development',
    summary: 'Websites, web applications and digital products that explain what a business does, work properly on a phone and make it easy for customers to get in touch or buy.',
    who: 'Businesses that need a new website, a better one, or a web application their customers or team will use every day.',
    problem: 'Many business websites don’t say clearly what the business does, are awkward to use on a phone, or make it hard to enquire or buy. Visitors leave before they ever get in touch.',
    build: ['Business websites', 'Landing pages', 'E-commerce stores', 'Shopify and WordPress sites', 'Custom web applications', 'Website redesigns'],
    includes: [
      'Planning the pages, content and the path a visitor takes',
      'UI/UX design for phone, tablet and desktop',
      'Development as a custom build, or on WordPress or Shopify if you want to manage it yourself',
      'Testing across devices and browsers before launch',
      'Launch, and a handover of everything you need to run it',
    ],
    services: [
      ['Website design and development', 'Business websites planned around what visitors need to understand, then designed and built to load quickly on any device.'],
      ['UI/UX design', 'User flows, wireframes and interface design that make a website or product easier to understand and easier to use.'],
      ['Landing pages', 'Focused pages for a campaign, product or offer, with one clear message and one clear next step.'],
      ['E-commerce development', 'Online stores designed around how customers browse, compare and buy, from product page to checkout.'],
      ['Shopify and WordPress', 'Sites and stores on platforms your team can update without a developer, set up and extended to fit how you work.'],
      ['Custom web applications', 'Portals, booking tools, dashboards and other browser-based software your customers or staff use to get things done.'],
      ['Responsive front-end development', 'Layouts built for the phone first and refined for larger screens, so every visitor gets the complete experience.'],
      ['Redesigns and improvements', 'A review of an existing site, followed by the changes that make it clearer, faster and easier to use.'],
    ],
    principles: [
      ['Clarity first', 'A visitor should understand what you do, who it’s for and what to do next within a few seconds.'],
      ['Designed for the phone', 'Most of your visitors arrive on a phone. We design for that screen first, not as an afterthought.'],
      ['Easy to maintain', 'Sensible platforms and clean structure, so the site stays easy to update after launch.'],
    ],
  },
  {
    slug: 'agentic-ai-workflows', n: '02',
    title: 'Agentic AI Workflows',
    short: 'Agentic AI workflows',
    path: '/services/agentic-ai-workflows',
    summary: 'Connected, AI-powered workflows that coordinate tasks across your tools and take repetitive manual work off your team.',
    who: 'Businesses where the same manual steps repeat every day: answering enquiries, chasing leads, copying information between tools, preparing updates.',
    problem: 'Work gets stuck between tools and people. Leads wait for a reply, customer questions pile up, and someone spends hours moving information from one place to another.',
    build: ['AI agents for business operations', 'Multi-agent systems', 'Lead management and follow-up', 'Sales and marketing workflows', 'Customer support workflows', 'Process automation', 'API and tool integrations', 'Internal business systems'],
    includes: [
      'Mapping the current process and where time is being lost',
      'Designing the workflow, including where a person reviews or approves',
      'Building it and connecting it to the tools you already use',
      'Testing it on real cases before it goes live',
      'Documentation, and adjustments once your team is using it',
    ],
    /* An explanatory example, labelled as such on the page. Not a client
       case and not a product screen. */
    example: {
      title: 'An example: following up new enquiries',
      steps: [
        'A new enquiry arrives through your website form or email.',
        'An agent reads it, pulls out the key details and adds them to your CRM or spreadsheet.',
        'It drafts a reply using your own service and pricing information, and passes it to your team to approve.',
        'If the customer hasn’t replied after a set time, it prepares a follow-up and reminds the right person.',
      ],
    },
    services: [
      ['AI agents for business operations', 'Agents that take on recurring tasks such as sorting requests, preparing documents or updating records, with people reviewing where it matters.'],
      ['Multi-agent systems', 'Several specialised agents working on a larger process, each responsible for one part, with clear handovers between them.'],
      ['Lead management and follow-up', 'New enquiries captured, qualified, routed to the right person and followed up consistently, so fewer leads go cold.'],
      ['Sales and marketing workflows', 'Research, outreach preparation, content drafts and reporting, with your team approving what goes out.'],
      ['Customer support workflows', 'Incoming questions sorted, answered from your own information where appropriate, and passed to a person when one is needed.'],
      ['Process automation', 'Repetitive processes mapped, simplified and automated, so information moves between tools without being re-typed.'],
      ['API and tool integrations', 'Connections between your CRM, forms, email, spreadsheets and other tools, so information reaches the place it’s needed.'],
      ['Internal business systems', 'Purpose-built tools for a process specific to your business, designed around the way your team already works.'],
    ],
    principles: [
      ['Tied to real work', 'Every workflow starts from a task your business does today and the time it currently takes.'],
      ['People stay in control', 'Agents handle routine steps. Anything that needs judgement goes to the right person to review.'],
      ['Built around your tools', 'We connect the CRM, inbox, forms and spreadsheets you already use instead of replacing them.'],
    ],
  },
];

/* ---------- PROCESS ----------
   One process, used once. No durations: timelines are agreed per scope. */
export const process = [
  ['01', 'Conversation', 'You tell us what you need and what isn’t working today. If we’re not the right fit, we’ll say so.',
    'An honest view of whether, and how, we can help'],
  ['02', 'Written scope and price', 'What will be built, what isn’t included, the price and when payments are due, all in writing. Work starts once you’ve agreed to it.',
    'A scope and price you can hold us to'],
  ['03', 'Design and build', 'We share work in progress at agreed review points, so you can comment before anything is final.',
    'Review points before anything is final'],
  ['04', 'Launch and handover', 'We test, launch and hand over everything you need to run what we built.',
    'Logins, access and notes for your team'],
];

/* ---------- STUDIO NUMBERS ----------
   Proposed figures, NOT verified. Nothing in this repository (no CRM export,
   client list, invoices or review records) supports them, so they are not
   published. To publish: record what each number counts and where it comes
   from in `basis`, set `verified: true` on every item, then `publish: true`.
   A rating needs a named public source (e.g. Google Business Profile) and
   the number of reviews it is based on. */
export const stats = {
  publish: false,
  items: [
    { value: '30+', label: 'Projects completed', verified: false,
      basis: null },  // PENDING: count from project records; define "completed"; don't count demo builds as client work
    { value: '20+', label: 'Clients served', verified: false,
      basis: null },  // PENDING: unique paying clients from invoices/CRM; one client with several projects counts once
    { value: '4.6', label: 'Client rating', verified: false,
      basis: null },  // PENDING: public source + number of reviews, e.g. "4.6 on Google, 18 reviews"
  ],
};

/* ---------- ABOUT ---------- */
export const aboutCopy = {
  teaser: [
    'Ostendic is run by Harsh Dubey. When you work with Ostendic, you work with him directly, from the first conversation through to launch.',
    'The studio covers both sides of how a business shows up online: the website or product customers use, and the workflows that handle what happens after they get in touch.',
  ],
  approach: [
    ['Start with the business problem', 'Before choosing a platform, a design direction or an AI tool, we want to understand what isn’t working and what a good result would look like for you.'],
    ['Say what it costs before starting', 'Every piece of work is scoped and priced in writing before it begins, including what is not included.'],
    ['Build what you can keep running', 'We choose platforms and tools your team can live with after launch, and hand over what you need to manage them.'],
    ['Keep people in the loop', 'In AI workflows, routine steps can be automated. Decisions that need judgement stay with a person.'],
  ],
};

/* ---------- WORK ----------
   kind: 'client' | 'demo' | 'sample'. Rendered labels: Client project /
   Demo build / Sample. Only entries with `publish: true` appear, in this
   order. Demo descriptions are limited to what the live product visibly
   does; the client entry uses the project record, with no invented results.

   VMS Careline is shown WITHOUT any website screenshot or live preview: its
   visual is a brand plate built from the official logo file and the two
   colours sampled from it. */
export const projects = [
  {
    slug: 'vms-careline', name: 'VMS Careline', kind: 'client', publish: true,
    url: 'https://vmscareline.com/',
    brand: {
      logo: 'assets/logos/vms-careline.png', w: 900, h: 290,
      colours: [['Careline navy', '#0C6084'], ['Careline teal', '#189C84']],
      verticals: [['VMS Careline', 'Healthcare products'], ['VMS Cart', 'Separate cart vertical']],
    },
    area: 'Healthcare e-commerce · India',
    pillars: ['web-development', 'agentic-ai-workflows'],
    scope: ['Brand structure', 'UI/UX design', 'Website development', 'E-commerce', 'Enquiry automation'],
    what: 'A healthcare e-commerce business in India, restructured into two clear digital verticals: VMS Careline and VMS Cart.',
    problem: 'One digital presence carried two quite different offerings, so customers had to work out which part of the business they were in. Enquiries were handled manually, and how quickly someone got a reply depended on who was available.',
    built: 'Separate verticals, each with its own audience, structure and buying path. A commerce experience rebuilt around how these products are actually chosen, with clearer product discovery and presentation. An automated enquiry path from first contact through first response to follow-up.',
    contribution: 'Client project. Ostendic, led by Harsh Dubey, handled the brand structure, UX, website development and enquiry automation.',
  },
  {
    slug: 'truereview', name: 'TrueReview', kind: 'demo', publish: true,
    caution: 'The live demo still shows unverified figures (“2M+ reviews analysed”, “94% accuracy”, “500+ products”, “4.9 stars”) and “[User Photo]” placeholders. The site uses a screenshot of the tool itself, but visitors who open the demo will see them. Remove them from the demo.',
    url: 'https://tru-review-lilac.vercel.app/',
    images: { desktop: 'assets/work/truereview-desktop.jpg', phone: 'assets/work/truereview-phone.jpg' },
    area: 'Web application · AI analysis',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A free tool that checks the reviews on a product listing before you buy.',
    problem: 'Shoppers can’t easily tell which product reviews to trust, or spot the complaints buried under hundreds of five-star ratings.',
    built: 'Product concept, interface design and front end, plus an AI review flow. You paste a product link or name, and the tool scans its reviews for likely fakes, repeated patterns and buried complaints, then gives a trust score with a breakdown.',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
  {
    slug: 'viralcheck', name: 'ViralCheck', kind: 'demo', publish: true,
    url: 'https://viralcheckcontent.vercel.app/',
    images: { desktop: 'assets/work/viralcheck-desktop.jpg', phone: 'assets/work/viralcheck-phone.jpg' },
    area: 'Web application · AI review',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A free tool that reviews a piece of written content (a post, article or newsletter) before it is published.',
    problem: 'Creators and small marketing teams usually find out whether a post works after publishing it, when it’s too late to change.',
    built: 'Interface design and front end, plus an AI review flow. You paste the content, choose the platform, and get feedback on hook strength, readability, SEO gaps and call-to-action clarity, with suggested rewrites.',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
  {
    slug: 'launchmirror', name: 'LaunchMirror', kind: 'demo', publish: true,
    url: 'https://launchmirror.vercel.app/',
    images: { desktop: 'assets/work/launchmirror-desktop.jpg', phone: 'assets/work/launchmirror-phone.jpg' },
    area: 'Web application · AI analysis',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A free web tool that gives Indian founders a structured first read on a business idea before they commit to building it.',
    problem: 'First-time founders often start building before testing whether an idea holds up. Market timing, competition and cost get checked late, if at all.',
    built: 'Product concept, interface design and front end, plus an AI analysis flow. The founder answers seven questions and receives a viability score out of 100, a market check, short statements on strengths, weaknesses and risk, and a 90-day action plan.',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
];
export const published = projects.filter(p => p.publish);
export const kindLabel = { client: 'Client project', demo: 'Demo build', sample: 'Sample' };

/* ---------- PRICING ----------
   Each package has the same fields. A null value is not published: the
   page shows a neutral fallback instead of an invented figure. Packages
   with `publish: false` do not render at all. */
export const packages = [
  {
    slug: 'diagnostic', name: 'Diagnostic', publish: true,
    for: 'Businesses that know something isn’t working, such as a website that doesn’t bring in enquiries or a process that eats your team’s time, but aren’t sure what to change first.',
    includes: [
      'A review of your website, a product flow or one business process',
      'A written summary of what is getting in the way, in plain language',
      'Prioritised recommendations: what to fix first and what can wait',
      'If you want it, a scoped and priced proposal for the work',
    ],
    excludes: ['Design or development work', 'Building or changing a workflow'],
    price: null,      // PENDING: diagnostic fee (INR)
    timeline: null,   // PENDING: delivery time for the written review
    payment: null,    // PENDING: payment terms
  },
  {
    slug: 'starter', name: 'Starter website', publish: false,
    hold: 'Proposed at ₹12,000 with a five-working-day delivery target. Do not publish until the exact pages, content responsibilities, revision rounds, exclusions and payment terms are confirmed.',
    for: 'Local businesses that need a clear, professional website quickly.',
    includes: [],     // PENDING: exact deliverables (pages, sections, forms)
    excludes: [],     // PENDING: exclusions
    revisions: null,  // PENDING: revision rounds
    price: null,      // proposed ₹12,000 — unconfirmed
    timeline: null,   // proposed 5 working days — unconfirmed
    payment: null,
  },
  {
    slug: 'custom', name: 'Larger and custom projects', publish: true,
    for: 'Larger websites, e-commerce stores, web applications and AI workflows that need a scope of their own.',
    includes: [
      'A written scope that lists what will be built and what won’t',
      'Design, development and testing',
      'Review points while the work is in progress',
      'Launch and handover',
    ],
    excludes: ['Third-party costs (listed below)', 'Changes outside the agreed scope, which are quoted separately before they start'],
    quoted: true,     // custom work is quoted per scope by nature
    price: null,
    timeline: null,
    payment: null,    // PENDING: standard payment schedule (e.g. deposit / milestones)
  },
];
export const thirdPartyCosts = [
  'Domain name registration and renewal',
  'Hosting',
  'Platform subscriptions, such as a Shopify plan',
  'Paid themes, plugins or apps',
  'Usage charges for AI models and other paid APIs',
];

/* ---------- ENQUIRY FORM ---------- */
export const budgets = ['Not sure yet', 'Under ₹15,000', '₹15,000 – ₹50,000', '₹50,000 – ₹1.5 lakh', 'Above ₹1.5 lakh'];
export const interests = [
  'A new website or a redesign',
  'UI/UX design',
  'A web application or online store',
  'An AI workflow or automation',
  'A website and an AI workflow',
  'Not sure yet',
];

/* ---------- NAV ---------- */
export const nav = [
  ['Services', '/services', pillars.map(p => [p.title, p.path])],
  ['Work', '/work'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

/* ---------- PENDING: printed on every build ---------- */
export const pending = [
  !site.phone && 'Phone number (site.phone): click-to-call is hidden until set.',
  !site.whatsapp && 'WhatsApp number (site.whatsapp): WhatsApp buttons are hidden until set.',
  !site.booking && 'Booking link (site.booking): no /book page is generated, and CTAs go to /contact reading "Start a conversation", until a Calendly/Cal.com 30-minute event URL is set.',
  !stats.publish && 'Studio numbers (stats): 30+ projects / 20+ clients / 4.6 rating are unverified and not shown. Add the basis for each and set verified + publish.',
  !site.social.length && 'LinkedIn / Instagram URLs (site.social): no social links shown until set.',
  ...projects.filter(p => !p.publish).map(p => `Work: ${p.name} is held back. ${p.hold}`),
  ...projects.filter(p => p.publish && p.caution).map(p => `Work: ${p.name}. ${p.caution}`),
  ...packages.filter(p => !p.publish).map(p => `Pricing: ${p.name} is held back. ${p.hold}`),
  ...packages.filter(p => p.publish && !p.price && !p.quoted).map(p => `Pricing: ${p.name} has no published price yet.`),
  ...packages.filter(p => p.publish && !p.payment).map(p => `Pricing: ${p.name} has no published payment terms yet.`),
  'CONTACT FORM IS NOT DELIVERING: the Supabase project in db.js (jyikbiiyqixesapwkkfm.supabase.co) does not resolve in public DNS (checked 11 Nov 2026). The form shows an honest failure with the email address. Create a new Supabase project (table "leads": name, email, company, budget, project_description) or switch to a form service, update db.js, then set up and test email notification to harsh@ostendic.com.',
].filter(Boolean);
