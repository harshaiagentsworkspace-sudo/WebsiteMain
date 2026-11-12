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
     booking:  Calendly (or Cal.com) scheduling URL. Read at BUILD time from
               NEXT_PUBLIC_CALENDLY_URL (see .env.example), falling back to the
               Ostendic Calendly page. The provider is detected from the URL.
               Availability, time slots and confirmation all come from the
               provider; nothing is simulated here.
     formKey:  Web3Forms access key for the contact form (messages are emailed
               to the address the key was created with). Read at BUILD time
               from WEB3FORMS_ACCESS_KEY, else the value here. It is a public
               key by design: it can only send to that inbox. */
  formKey: globalThis.process.env.WEB3FORMS_ACCESS_KEY || 'c9c76618-084b-43ff-b3bb-be8aa2de655a',
  phone: null,      // PENDING: business phone number
  whatsapp: null,   // PENDING: business WhatsApp number
  booking: globalThis.process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/harshkdubeyhd',

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
    /* navbar: same artwork and ink box, transparent background */
    nav: 'assets/ostendic-logo.png',
    w: 1746, h: 901,
    /* the box carries a little air on every side (12px left/right, 8px
       top/bottom): the wordmark's anti-aliased edges (the O's curve, the
       C's right) sit just outside the solid ink and were being clipped at
       small sizes. --brand-h values in CSS are scaled to match (x 239/223)
       so the wordmark renders at the same size as before. */
    ink: { x: 284, y: 322, w: 1183, h: 239 },
  },

  /* meta description + structured data */
  sub: 'Ostendic designs and builds websites and web applications, and the AI workflows businesses run behind them.',
  footer: 'Ostendic builds websites, web applications and the AI workflows behind them.',
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
  startLabel: site.booking ? 'Book a quick call' : 'Start a conversation',
};

/* ---------- HERO ---------- */
export const heroCopy = {
  lines: ['Websites your customers use,', '{and the systems behind them.}'],
  lead: 'Ostendic designs and builds websites and web applications, and sets up AI workflows that handle the follow-ups, routing and admin that happen after a customer gets in touch.',
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
    /* Short copy for the service panels on the homepage and /services.
       The fields above stay as the fuller copy on this service's own page. */
    panel: {
      summary: 'Websites and web apps that explain what you do, work well on a phone, and make it easy to get in touch or buy.',
      who: 'You need a new website, a better one, or a web app your customers use.',
      problem: 'Visitors can’t tell what you do, or how to get in touch. So they leave.',
      build: 'Business websites, landing pages, online stores, Shopify and WordPress sites, custom web apps, redesigns.',
      includes: [
        'Planning the pages and the visitor’s path',
        'Design for phone, tablet and desktop',
        'A custom build, or WordPress and Shopify',
        'Testing before launch',
      ],
    },
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
      /* short lines for the homepage ring only; `steps` stays the full text
         used by /services and the Agentic AI page */
      ring: ['New enquiry arrives', 'Agent logs the details', 'Reply drafted, team approves', 'Follow-up prepared, person reminded'],
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
    panel: {
      summary: 'AI workflows that connect your tools and take the repetitive work off your team.',
      who: 'Teams stuck repeating manual steps: answering enquiries, chasing leads, copying data between tools.',
      problem: 'Leads wait for a reply. Questions pile up. Someone spends hours moving data from one tool to another.',
      build: 'AI agents for business operations, lead follow-up, support workflows, process automation, tool integrations.',
      includes: [
        'Mapping where time gets lost',
        'Designing it, including where a person approves',
        'Building it and connecting it to your tools',
        'Testing on real cases before going live',
      ],
    },
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

/* Homepage version of the process: shorter copy, no "You receive" row.
   /services keeps the full `process` above. */
export const processHome = {
  heading: 'Four steps. Nothing hidden.',
  steps: [
    ['01', 'Talk it through', 'Tell us what’s not working. We’ll say if we can’t help.'],
    ['02', 'Agree it in writing', 'Scope, price and dates on paper before any work starts.'],
    ['03', 'Build, with check-ins', 'You see progress at set points, not just at the end.'],
    ['04', 'Launch and hand over', 'You get the logins and notes to run it yourself.'],
  ],
};

export const aboutCopy = {
  /* About page hero (homepage teaser below keeps its own copy) */
  hero: {
    lead: 'Ostendic builds websites and AI workflows that help small businesses look credible, get noticed and run smoothly.',
    body: [
      'We cover both sides of how a business shows up online: the website customers see, and the workflows that handle what happens after they get in touch.',
      'Ostendic is small by design. Every project is scoped in writing, built with care and handed over in a form your team can run.',
    ],
  },
  teaser: [
    'Ostendic builds websites and AI agentic workflows for businesses that want to look credible and run smoothly.',
    'Your site brings people in. Your workflows handle what happens next. We build both, and hand them over so your team can run them.',
  ],
  /* [title, description, icon file in workflow-ring-v2/] */
  approach: [
    ['Start with the business problem', 'Before choosing a platform, a design direction or an AI tool, we want to understand what isn’t working and what a good result would look like for you.', 'principle-1-problem.svg'],
    ['Say what it costs before starting', 'Every piece of work is scoped and priced in writing before it begins, including what is not included.', 'principle-2-cost.svg'],
    ['Build what you can keep running', 'We choose platforms and tools your team can live with after launch, and hand over what you need to manage them.', 'principle-3-keep-running.svg'],
    ['Keep people in the loop', 'In AI workflows, routine steps can be automated. Decisions that need judgement stay with a person.', 'principle-4-people.svg'],
  ],
};

/* ---------- WORK ----------
   kind: 'client' | 'demo' | 'sample'. Rendered labels: Client project /
   Demo build / Sample. Only entries with `publish: true` appear, in this
   order. Demo descriptions are limited to what the live product visibly
   does; the client entry uses the project record, with no invented results.

   VMS Careline's visual is a brand plate: the official logo over a faded
   capture of its homepage. `colours` only tints the plate's frame; the
   names and hex codes are not shown.

   heroImage (optional, any project): { src, w, h }. When set, the card shows
   that image faded behind the project's logo (brand.logo) or name. When not
   set, the card keeps its current visual. */
export const projects = [
  {
    slug: 'vms-careline', name: 'VMS Careline', kind: 'client', publish: true,
    url: 'https://vmscareline.com/',
    brand: {
      logo: 'assets/logos/vms-careline.png', w: 900, h: 290,
      colours: [['Careline navy', '#0C6084'], ['Careline teal', '#189C84']],
      verticals: [['VMS Careline', 'Healthcare Ecommerce Platform']],
    },
    heroImage: { src: 'assets/work/vms-careline.jpg', w: 1200, h: 800 },
    area: 'Healthcare e-commerce · India',
    pillars: ['web-development', 'agentic-ai-workflows'],
    scope: ['UI/UX design', 'Website development', 'E-commerce', 'Enquiry automation'],
    what: 'The website and brand structure for VMS Careline, a healthcare e-commerce business in India.',
    problem: 'Two kinds of customers, one tangled site. Products were hard to find, and enquiries had no clear path to a reply.',
    built: 'Two separate verticals: VMS Careline and VMS Cart. A store built around how people choose products. An automated path from first enquiry to follow-up.',
    linkLabel: 'Visit the live site',
    contribution: 'Client project. Ostendic, led by Harsh Dubey, handled the brand structure, UX, website development and enquiry automation.',
  },
  {
    slug: 'truereview', name: 'TrueReview', kind: 'demo', publish: true,
    caution: 'The live demo still shows unverified figures (“2M+ reviews analysed”, “94% accuracy”, “500+ products”, “4.9 stars”) and “[User Photo]” placeholders. The site uses a screenshot of the tool itself, but visitors who open the demo will see them. Remove them from the demo.',
    url: 'https://tru-review-lilac.vercel.app/',
    images: { desktop: 'assets/work/truereview-desktop.jpg', phone: 'assets/work/truereview-phone.jpg' },
    area: 'Web application · AI analysis',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A demo tool that helps shoppers decide if a product is worth buying.',
    problem: 'Online reviews are hard to trust, so it’s hard to know what’s actually worth buying.',
    built: 'A working tool where you ask about a product and get a score based on its genuine reviews.',
    linkLabel: 'Try the demo',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
  {
    slug: 'viralcheck', name: 'ViralCheck', kind: 'demo', publish: true,
    url: 'https://viralcheckcontent.vercel.app/',
    images: { desktop: 'assets/work/viralcheck-desktop.jpg', phone: 'assets/work/viralcheck-phone.jpg' },
    area: 'Web application · AI review',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A demo tool we built that scores a piece of content.',
    problem: 'Creators guess what will work, then post and hope.',
    built: 'A working tool with an AI-assisted interface that scores your content.',
    linkLabel: 'Try the demo',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
  {
    slug: 'launchmirror', name: 'LaunchMirror', kind: 'demo', publish: true,
    url: 'https://launchmirror.vercel.app/',
    images: { desktop: 'assets/work/launchmirror-desktop.jpg', phone: 'assets/work/launchmirror-phone.jpg' },
    area: 'Web application · AI analysis',
    pillars: ['web-development', 'agentic-ai-workflows'],
    what: 'A demo tool that gives you a structured first read on a business idea before you commit to building it.',
    problem: 'It’s easy to start building before you’ve checked whether an idea holds up. Market timing, competition and cost often get checked late, if at all.',
    built: 'A working tool where you answer seven questions about your idea. You get a viability score out of 100, a market check, a short read on strengths, weaknesses and risks, and a 90-day action plan.',
    linkLabel: 'Try the demo',
    contribution: 'Designed and built in-house by Ostendic as a demonstration product.',
  },
];
export const published = projects.filter(p => p.publish);
export const kindLabel = { client: 'Client project', demo: 'Demo build', sample: 'Sample' };

/* ---------- ENQUIRY FORM ---------- */
export const budgets = ['Not sure yet', 'Under ₹15,000', '₹15,000 to ₹50,000', '₹50,000 to ₹1.5 lakh', 'Above ₹1.5 lakh'];
export const interests = [
  'A new website or a redesign',
  'UI/UX design',
  'A web app or online store',
  'An AI workflow or automation',
  'A website and an AI workflow',
  'Not sure yet',
];

/* ---------- NAV ---------- */
export const nav = [
  ['Services', '/services', pillars.map(p => [p.title, p.path])],
  ['Work', '/work'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

/* ---------- PENDING: printed on every build ---------- */
export const pending = [
  !site.phone && 'Phone number (site.phone): click-to-call is hidden until set.',
  !site.whatsapp && 'WhatsApp number (site.whatsapp): WhatsApp buttons are hidden until set.',
  !site.booking && 'Booking link (site.booking): no /book page is generated, and CTAs go to /contact reading "Start a conversation", until a Calendly/Cal.com 30-minute event URL is set.',
  !site.social.length && 'LinkedIn / Instagram URLs (site.social): no social links shown until set.',
  ...projects.filter(p => !p.publish).map(p => `Work: ${p.name} is held back. ${p.hold}`),
  ...projects.filter(p => p.publish && p.caution).map(p => `Work: ${p.name}. ${p.caution}`),
  !site.formKey && 'CONTACT FORM IS NOT DELIVERING: no Web3Forms access key (site.formKey in build/data.mjs, or WEB3FORMS_ACCESS_KEY). Messages fail with an honest error until it is set.',
].filter(Boolean);
