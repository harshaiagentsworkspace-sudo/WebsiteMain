/* ===========================================================================
   OSTENDIC — CONTENT DATA
   Single source of truth for every page. Real Ostendic facts only.
   Anything not yet verifiable is marked TEMP-PLACEHOLDER and must be
   replaced during the content pass — never presented as a client claim.
   =========================================================================== */

export const site = {
  name: 'Ostendic',
  tagline: 'Digital studio',
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
  promise: 'Ostendic builds better digital experiences for businesses ready to grow.',
  sub: 'From brand and UI/UX to websites and AI-powered automation, we improve the way customers discover, understand and engage with a business.',
  differentiator: "We don't just make the site look better. We make the system around it work better.",
  journey: ['Visitor', 'Enquiry', 'Response', 'Follow-up', 'Conversion'],
  social: [
    ['LinkedIn', 'https://www.linkedin.com/'],   // TEMP-PLACEHOLDER: real profile URLs
    ['Instagram', 'https://www.instagram.com/'],
    ['Behance', 'https://www.behance.net/'],
    ['Dribbble', 'https://dribbble.com/'],
  ],
};

/* ---------- SERVICES ---------- */
export const services = [
  {
    slug: 'ui-ux-design', nav: 'UI/UX Design',
    art: 'assets/categories/ui-ux-design.svg',
    title: 'UI/UX Design', kicker: 'Interfaces people understand',
    hero: ['UI/UX design built around', 'how customers actually decide'],
    lead: 'We map the path a customer takes through your product or site, then design the screens that remove the friction on it — not just the ones that look good in a portfolio.',
    capabilities: ['UX audit', 'User flows & journey mapping', 'Wireframing & prototyping', 'Visual UI design', 'Design systems', 'Usability testing'],
    problems: [
      ['People drop off mid-flow', 'Visitors start a signup, a booking or a checkout and abandon it before the end — usually because a step asks for more than it needs to.'],
      ['The interface says too much at once', 'Every option competes for attention, so nothing reads as the next thing to do.'],
      ['Features nobody finds', 'Work that was expensive to build sits behind navigation that hides it.'],
      ['Design decided by opinion', 'Changes get argued rather than measured, so the same debate repeats every quarter.'],
    ],
    outcome: 'A product people can move through without being taught.',
  },
  {
    slug: 'web-development', nav: 'Web Development',
    art: 'assets/categories/web-development.svg',
    title: 'Web Development', kicker: 'Sites built to a date',
    hero: ['Websites built to a date,', 'measured from day one'],
    lead: 'Fast, accessible, well-structured builds with analytics and tracking in place before launch — so the first week produces data, not guesses.',
    capabilities: ['Marketing sites', 'Web applications', 'CMS integration', 'Performance & Core Web Vitals', 'Accessibility (WCAG-conscious)', 'Analytics & tracking setup'],
    problems: [
      ['The site is slow on a real phone', 'It tests fine on a desktop and loses people on a mid-range Android over 4G.'],
      ['Nothing is measured', 'There is no baseline, so no change can be shown to have worked.'],
      ['Content changes need a developer', 'Small edits queue behind engineering time.'],
      ['It breaks when it grows', 'Each new page is a one-off, so the site gets harder to maintain rather than easier.'],
    ],
    outcome: 'A site that is fast, editable, and instrumented from launch.',
  },
  {
    slug: 'brand-design', nav: 'Brand & Identity',
    art: 'assets/categories/brand-design.svg',
    title: 'Brand & Visual Identity', kicker: 'A structure people recognise',
    hero: ['Brand structure that makes', 'the business legible'],
    lead: 'Clear positioning, a usable visual system, and the structure to separate distinct offerings so customers know which part of the business they are in.',
    capabilities: ['Brand strategy & positioning', 'Visual identity', 'Logo & wordmark', 'Design system & guidelines', 'Brand architecture', 'Collateral'],
    problems: [
      ['Two businesses wearing one coat', 'Distinct offerings share one presence, so every visitor has to work out which one applies to them.'],
      ['Inconsistent from page to page', 'Type, spacing and colour drift, and the result reads as unfinished.'],
      ['Looks like every competitor', 'Nothing in the identity is specific enough to be remembered.'],
      ['No system to build on', 'Every new asset is designed from scratch.'],
    ],
    outcome: 'An identity that holds together across every surface.',
  },
  {
    slug: 'ai-automation', nav: 'AI & Automation',
    art: 'assets/categories/ai-automation.svg',
    title: 'AI & Automation', kicker: 'The system behind the site',
    hero: ['Automation for the work', 'between enquiry and sale'],
    lead: 'AI earns its place when it removes work. We automate the handling around a lead — intake, routing, first response, follow-up — so response time stops depending on who is available.',
    capabilities: ['Lead capture & routing', 'Automated first response', 'Follow-up sequences', 'CRM & tool integration', 'Internal workflow automation', 'Handover documentation'],
    problems: [
      ['Enquiries wait for a human', 'Response time depends on who is at their desk, and the slowest replies lose the most business.'],
      ['The same data typed twice', 'Information is re-keyed between a form, a spreadsheet and a CRM.'],
      ['Follow-up depends on memory', 'Leads go cold because nobody owned the second message.'],
      ['Nobody can explain the automation', 'A previous vendor left a black box the team cannot maintain.'],
    ],
    outcome: 'A process that runs without supervision and that your team can own.',
  },
  {
    slug: 'ecommerce', nav: 'E-commerce',
    art: 'assets/categories/ecommerce.svg',
    title: 'E-commerce', kicker: 'Discovery through checkout',
    hero: ['Stores built around', 'how people actually shop'],
    lead: 'Product discovery, trust surfaces and a checkout flow designed around the real buying decision — with the analytics to show what changed.',
    capabilities: ['Storefront design & build', 'Product discovery & navigation', 'Trust & compliance surfaces', 'Checkout optimisation', 'Payments & integrations', 'Post-purchase flows'],
    problems: [
      ['Traffic that does not convert', 'People arrive, browse, and leave without ever reaching a product page that answers their question.'],
      ['Customers cannot find the product', 'Categories reflect how the business is organised rather than how customers search.'],
      ['Trust is missing at the decision point', 'Nothing on the page answers "is this safe to buy from".'],
      ['Checkout loses people', 'Too many steps, or a surprise at the last one.'],
    ],
    outcome: 'A store where the path to purchase is obvious.',
  },
  {
    slug: 'saas-product-design', nav: 'SaaS & Product',
    art: 'assets/categories/saas-product-design.svg',
    title: 'SaaS & Product Design', kicker: 'Complex made usable',
    hero: ['Product design for tools', 'that carry real work'],
    lead: 'Dashboards, onboarding and workflows for software people use every day — designed so density stays readable and the next action is always clear.',
    capabilities: ['Dashboard & data UI', 'Onboarding flows', 'Information architecture', 'Design systems', 'Prototyping', 'Design QA with engineering'],
    problems: [
      ['The dashboard shows everything and says nothing', 'Data is present but no view answers the question the user opened the app to ask.'],
      ['Onboarding loses new users', 'People reach the product and never get to the first useful moment.'],
      ['Every screen drifts', 'Without a system, each release adds another variant of the same component.'],
      ['Design and engineering disagree late', 'Handover happens at the end, so problems surface in build.'],
    ],
    outcome: 'Software that stays understandable as it grows.',
  },
  {
    slug: 'mvp-development', nav: 'MVP Development',
    art: 'assets/categories/saas-product-design.svg',
    title: 'MVP Development', kicker: 'Smallest useful version',
    hero: ['The smallest version', 'that proves the idea'],
    lead: 'Scope cut to what actually tests the hypothesis, built to a fixed date so you learn something real before the budget is gone.',
    capabilities: ['Scoping & prioritisation', 'Clickable prototype', 'Core build', 'Auth, payments & data', 'Launch & instrumentation', 'Iteration plan'],
    problems: [
      ['Scope keeps growing', 'The launch date moves every time a new idea arrives.'],
      ['Building before validating', 'Months of work go into features nobody has asked for yet.'],
      ['No way to tell if it worked', 'The MVP ships without the measurement that would answer the question.'],
      ['Prototype code becomes the product', 'A throwaway build turns into the thing that has to scale.'],
    ],
    outcome: 'A working product, on a date, with a way to read the result.',
  },
  {
    slug: 'motion-design', nav: 'Motion Design',
    art: 'assets/categories/ui-ux-design.svg',
    title: 'Motion Design', kicker: 'Movement with a job',
    hero: ['Motion that explains,', 'not decorates'],
    lead: 'Interface motion, product demos and short-form video used where movement makes something clearer — state changes, comparisons, how a thing works.',
    capabilities: ['Interface motion', 'Product demo video', 'Explainer animation', 'Loading & transition states', 'Social & ad motion', 'Motion guidelines'],
    problems: [
      ['Animation for its own sake', 'Effects slow the page down without helping anyone understand it.'],
      ['The product is hard to explain', 'A static screenshot cannot show what the software actually does.'],
      ['Inconsistent movement', 'Every transition has a different speed and feel.'],
      ['Motion breaks accessibility', 'Nothing respects a reduced-motion preference.'],
    ],
    outcome: 'Movement that carries information, and stops when asked to.',
  },
  {
    slug: 'creative-marketing', nav: 'Creative Marketing',
    art: 'assets/categories/web-development.svg',
    title: 'Creative Marketing', kicker: 'Assets that carry the brand',
    hero: ['Campaign work that looks', 'like the same company'],
    lead: 'Landing pages, ad creative and campaign assets built on the same design system as the product, so acquisition and experience stop contradicting each other.',
    capabilities: ['Landing pages', 'Ad creative', 'Campaign systems', 'Email design', 'Social templates', 'A/B test setup'],
    problems: [
      ['Ads promise what the site does not deliver', 'The click lands somewhere that feels like a different company.'],
      ['Every campaign starts from zero', 'No templates, no system, so cost repeats.'],
      ['No test structure', 'Variants ship without a way to compare them.'],
      ['Landing pages built by whoever is free', 'Quality depends on availability.'],
    ],
    outcome: 'Acquisition work that reinforces the brand instead of diluting it.',
  },
  {
    slug: 'dashboard-design', nav: 'Dashboard Design',
    art: 'assets/categories/saas-product-design.svg',
    title: 'Dashboard Design', kicker: 'Data people can act on',
    hero: ['Dashboards that answer', 'the question first'],
    lead: 'Reporting and admin interfaces organised around the decisions people make with them, so the important number is the one you see first.',
    capabilities: ['Information hierarchy', 'Data visualisation', 'Filtering & segmentation', 'Admin & settings UI', 'Empty & error states', 'Export & reporting'],
    problems: [
      ['Every metric weighted the same', 'Nothing on the screen indicates what matters.'],
      ['Charts that mislead', 'Scales, colours and labels that make the data harder to read, not easier.'],
      ['No empty or error states', 'The first-run experience looks broken.'],
      ['Built for the database, not the user', 'The layout mirrors the schema rather than the job.'],
    ],
    outcome: 'A view that tells you what to do next.',
  },
];

/* ---------- CLIENT / LOGO WALL ----------
   `clients` are real Ostendic client brands. The marks below are typographic
   wordmarks drawn in-house; set `src` to an official logo file (e.g.
   'assets/logos/vms-careline.svg') to render that artwork instead.

   `placeholderLogos` are TEMP-PLACEHOLDER. Every name is fictitious and
   invented purely to complete the layout at full scale. They are NOT
   Ostendic clients, no copy on the page describes them as clients, and the
   section carries a visible marker saying so. Delete them as real, cleared
   logos replace them — the grid reflows on its own. */
export const clients = [
  { name: 'VMS Careline', mark: 'careline', src: '' },
  { name: 'VMS',          mark: 'vms',      src: '' },
];

export const placeholderLogos = [
  'Northlane', 'Velora', 'Aveniq', 'Formly', 'Nexora', 'Kivo', 'Luma Labs',
  'Arcwell', 'Morrow', 'Fluxen', 'Brightfold', 'Cavora', 'Delune', 'Harborly',
  'Junctio', 'Keelway', 'Latticera', 'Meridan', 'Norvex', 'Opalfield',
  'Pentwood', 'Quillon', 'Rowanex', 'Sablebridge', 'Tidemere', 'Ulvara',
  'Vanthos', 'Westfen', 'Ovrik', 'Yarrowfield', 'Zephric', 'Calderra', 'Emberly',
];

/* ---------- HOMEPAGE CAPABILITY BLOCKS ----------
   Slugs only. Every word rendered in the section comes from `services`
   above, so the homepage can never drift from the service pages. */
export const homeCapabilities = ['ui-ux-design', 'web-development', 'mvp-development', 'ai-automation'];

/* ---------- WORK ---------- */
export const projects = [
  {
    slug: 'vms-careline', name: 'VMS Careline', kind: 'client',
    category: 'E-commerce', sector: 'Healthcare e-commerce',
    market: 'India', year: '2026',
    url: 'https://vmscareline.com/',
    image: 'assets/work/vms-careline.jpg',
    summary: 'Brand structure, digital experience and lead handling rebuilt across two business verticals.',
    disciplines: ['Brand', 'UI/UX', 'Web Development', 'AI & Automation'],
    before: 'One undifferentiated digital presence carried two quite different offerings. Customers arriving for either had to work out which part of the business they were in. Enquiries were handled manually, and time to first response depended on who was available.',
    decision: 'Separate the business into distinct digital verticals — VMS Careline and VMS Cart — each with its own audience, structure and buying path. Rebuild the commerce experience around how these products are actually chosen, and automate the enquiry path so response time stops depending on availability.',
    after: 'A healthcare e-commerce experience with clearer product discovery and stronger presentation, a separate cart vertical, and an automated path from enquiry through first response to follow-up.',
    result: 'The business reports an improved conversion ratio following the rebuild.',
    resultState: 'client-reported',
    resultNote: 'Baseline measurement in place. First published figure due once a full comparable period has elapsed.',
  },
  {
    slug: 'trureview', name: 'TruReview', kind: 'demo',
    category: 'SaaS & Product', sector: 'Review platform concept',
    market: '—', year: '2026',
    url: 'https://tru-review-lilac.vercel.app/',
    image: 'assets/work/trureview.jpg',
    summary: 'A review-collection interface built as a working demonstration of the product design approach.',
    disciplines: ['UI/UX', 'Web Development'],
  },
  {
    slug: 'viralcheck', name: 'ViralCheck Content', kind: 'demo',
    category: 'SaaS & Product', sector: 'Content analysis concept',
    market: '—', year: '2026',
    url: 'https://viralcheckcontent.vercel.app/',
    image: 'assets/work/viralcheck.jpg',
    summary: 'A content-scoring tool built as a working demonstration of AI-assisted product interfaces.',
    disciplines: ['UI/UX', 'Web Development', 'AI & Automation'],
  },
];

export const workCategories = ['All', 'E-commerce', 'SaaS & Product', 'Brand', 'Web Development'];

/* ---------- ENGAGEMENT / PRICING ---------- */
export const engagements = [
  {
    name: 'Diagnostic', price: 'Fixed fee', unit: 'one week',
    lead: 'For teams who know something is not working but not what.',
    desc: 'A short paid engagement producing a written diagnosis: what the site is doing to conversion, where enquiries are lost, the measured baseline, and a scoped, priced plan.',
    includes: ['Analytics & funnel review', 'UX and accessibility audit', 'Measured performance baseline', 'Written findings and priorities', 'Scoped plan with fixed pricing', 'Credited against a build if you proceed'],
    cta: 'Start with a diagnostic',
  },
  {
    name: 'Project', price: 'Scoped', unit: 'fixed fee, fixed date',
    lead: 'For defined work with a clear outcome and a deadline.',
    desc: 'A brand, site or product build delivered against an agreed scope and a date we hold. Design and development run in parallel rather than in sequence.',
    includes: ['Fixed scope agreed up front', 'A delivery date we commit to', 'Design and build in one team', 'Analytics and tracking at launch', 'Two weeks of post-launch tuning', 'Handover documentation'],
    featured: true,
    cta: 'Scope a project',
  },
  {
    name: 'Ongoing', price: 'Monthly', unit: 'retained capacity',
    lead: 'For teams that need continuing design and build capacity.',
    desc: 'Retained time each month across design, development and automation — for roadmaps that keep moving after launch.',
    includes: ['Agreed monthly capacity', 'Priorities set with you each cycle', 'Design, build and automation', 'Direct access to the principal', 'Adjust or pause with notice', 'No long lock-in'],
    cta: 'Talk about retained work',
  },
];

/* ---------- PROCESS ---------- */
export const process = [
  ['01', 'Diagnose', 'We look at what the site and the process behind it are actually doing — the funnel, the friction, the baseline numbers — before proposing anything.'],
  ['02', 'Scope', 'A fixed scope, a fixed fee and a date. What is included, what is not, and what happens if the date slips.'],
  ['03', 'Build', 'Design and development run together rather than in sequence, with regular reviews so nothing lands as a surprise at handover.'],
  ['04', 'Measure', 'We launch with analytics in place and stay on for two weeks of tuning, so the first reading is real rather than anecdotal.'],
];

/* ---------- FAQ ---------- */
export const faqs = [
  ['How long does a project usually take?',
   'Most focused builds run two to four weeks; larger product and commerce work runs longer and is scoped explicitly. We agree the delivery date during scoping and work backwards from it rather than estimating forwards.'],
  ['How do you price work?',
   'Fixed fee against a fixed scope, agreed before anything starts. Retained monthly work is priced on capacity. We do not bill hourly — you should know the number before you commit, and it should not move unless the scope does.'],
  ['What happens if the date slips?',
   'We tell you as soon as we know, not at the deadline. Where the slip is ours, we absorb it. Where it comes from a change in scope, we re-scope and re-price openly before continuing.'],
  ['Do you work with our existing team?',
   'Yes. Most engagements sit alongside an in-house team or an existing developer. We work in whatever tools you already use and you deal directly with the person doing the work, not an account manager.'],
  ['Do you do both design and development?',
   'Yes, and they run in parallel rather than as a handover. That is the main reason the timelines are short — decisions that would normally wait for a handoff get made once, together.'],
  ['Where do you work?',
   `We work with businesses in ${site.markets.slice(0, -1).join(', ')} and ${site.markets.at(-1)}. Delivery is remote, with overlap hours agreed at the start of each engagement.`],
  ['What happens after launch?',
   'Every project includes two weeks of post-launch tuning — fixing what real traffic reveals. After that you can move to retained monthly capacity, or take the work in-house with the handover documentation.'],
  ['Are you the right fit for us?',
   'We are a good fit if you have an existing business, real traffic or real customers, and a specific problem to solve. We are not the right fit for pre-revenue idea-stage work looking for the cheapest possible build, and we will say so early rather than take the project.'],
];

/* ---------- TESTIMONIALS ----------
   TEMP-PLACEHOLDER. These are sample entries used to complete the layout.
   They are NOT real clients and the section renders a visible placeholder
   marker so they cannot be mistaken for endorsements. Replace wholesale with
   attributed quotes once real ones are cleared for publication.
   `avatar` points at a generated illustrative portrait (build/make-art.mjs) —
   swap the path for a real, cleared photograph at the same time. */
export const testimonials = [
  { stars: 5, quote: 'The brief was a site that converts, not a site that wins awards. That is what we got — and the reporting to prove which changes did it.',
    name: 'Aarav Mehta', role: 'Placeholder role, placeholder company', initials: 'AM', avatar: 'assets/avatars/p1.svg' },
  { stars: 5, quote: 'Scope, price and date were agreed up front and none of them moved. The handover documentation meant our own team could take it from there.',
    name: 'Daniel Carter', role: 'Placeholder role, placeholder company', initials: 'DC', avatar: 'assets/avatars/p2.svg' },
  { stars: 5, quote: 'Design and build happened in the same conversation, so decisions that normally take a week took an afternoon.',
    name: 'Maya Sharma', role: 'Placeholder role, placeholder company', initials: 'MS', avatar: 'assets/avatars/p3.svg' },
];

/* ---------- AGGREGATE RATING ----------
   TEMP-PLACEHOLDER. Nothing in this project verifies an average rating or a
   review count, so `verified` is false and the section renders the figures
   inside a visible placeholder marker with a footnote saying so. Set
   `verified: true` ONLY once the figures are backed by a real, citable
   review source — that switch removes the marker and the footnote. */
export const rating = {
  verified: false,
  score: '4.9+',
  reviews: '100+',
  source: '',   // e.g. 'Google Business Profile' once real
};

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

/* ---------- INSIGHTS (structure only — no fabricated publication claims) ---------- */
/* TEMP-PLACEHOLDER: outlines for pieces in progress, not published research.
   Each is marked "Draft" on the page so nothing reads as a live article. */
export const posts = [
  { slug: 'ai-where-it-pays', cat: 'AI & Automation', read: '10 min', draft: true,
    art: 'assets/insights/ai.svg',
    title: 'Where AI actually pays for itself in a small business',
    desc: 'A working note on the difference between automation that removes work and automation that just adds another dashboard to check.' },
  { slug: 'premium-website-feel', cat: 'Design', read: '8 min', draft: true,
    art: 'assets/insights/web.svg',
    title: 'What makes a website feel expensive',
    desc: 'Restraint, typography and evidence — why the sites that look costly are usually the ones doing the least on screen.' },
  { slug: 'enquiry-to-reply', cat: 'Automation', read: '12 min', draft: true,
    art: 'assets/insights/automation.svg',
    title: 'The gap between an enquiry and a reply',
    desc: 'Most businesses lose more at the follow-up stage than on the page itself. How we map that path before touching a design.' },
];
export const postCategories = ['All', 'Design', 'Development', 'Automation', 'Business'];

/* ---------- NAV ---------- */
export const nav = [
  ['Services', '/services'],
  ['Work', '/work'],
  ['Pricing', '/pricing'],
  ['About', '/about'],
  ['Insights', '/blog'],
  ['Resources', '/resources'],
];

export const footerQuick = [
  ['Work', '/work'], ['About', '/about'], ['Pricing', '/pricing'],
  ['Insights', '/blog'], ['Resources', '/resources'], ['Careers', '/careers'], ['Contact', '/contact'],
];
