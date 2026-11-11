# Ostendic website refinement: audit and implementation report

Date: 11 November 2026. The source of truth for content is `build/data.mjs`. Run `node build/build.mjs`.

## 1. Audit (before)

| Area | Issue found |
|---|---|
| Content credibility | "Brands we have worked with" listed four names. LaunchMirror began as a placeholder attached to a fabricated testimonial (git `1bc18cc`); TrueReview and ViralCheck are Ostendic's own demos; VMS Careline is the founder's employer, with no record of permission. The Insights section showed three articles, with read times, that don't exist. The footer claimed "Working with US, UK, Europe, India". |
| Portfolio | The TrueReview demo itself shows invented figures (2M+ reviews analysed, 94% accuracy, 500+ products, 4.9 stars) and visible `[User Photo]` placeholders. |
| Repetition | The two services appeared four times on the homepage (intro spread, pinned 3D stack, four-card grid, glass "chat window"). There were two process blocks and two founder blocks. |
| Visual patterns | Eyebrow pills above nearly every heading; a purple/indigo gradient section with glassmorphism; cards with gradient icons; a scroll-pinned 3D card stack; scroll reveals on every element. |
| Navigation / IA | Insights, Resources and Careers were in the navigation with no real content or process behind them. |
| Conversion | "Book a 30-minute call" led to a form (no booking link exists). The WhatsApp link was `https://wa.me/` with no number. Social links went to the LinkedIn and Instagram homepages. Budgets were in USD. There was no spam protection. |
| Contact form | **The Supabase project in `db.js` no longer exists** (`jyikbiiyqixesapwkkfm.supabase.co` is NXDOMAIN on Cloudflare and Google DNS), so the live form cannot deliver. |
| Pricing | Said "fixed fee" without giving any amounts. |
| Performance | The 3 MB hero video and a 1.7 MB marquee video autoplayed on every device. `motion.css` (920 lines) and `motion.js` existed almost entirely for decorative sections. |
| Accessibility | The logo link tap target was 21px; the burger close icon was malformed. |

## 2. Design direction

Principles adopted from editorial studio sites (no layout copied):
- Typography does the work. Instrument Sans for everything; Instrument Serif italic is kept for two moments only (hero, About teaser).
- Hairline-ruled lists and definition rows instead of cards. Cards are used only where items are compared (pricing) or form a contained panel (the contact form).
- Warm light ground, one dark band per page for rhythm, one petrol accent used for meaning (status, ticks, focus).
- Real imagery only: the founder photo and real screenshots of live demos.
- Motion is limited to the hero atmosphere video (desktop only) and hover states.

## 3. What changed

Homepage, in order: Hero → Selected work → Services (two chapters) → Process → About teaser → Footer CTA.
- **Hero:** new headline ("Websites your customers use, and the systems behind them."), with both services introduced in the lead and a two-link service index below. The founder photo stays in the primary CTA. The video is now attached by JS only at ≥768px, without reduced motion or data-saver, and pauses off-screen. A poster image paints immediately. The letterbox bars and corner watermark are cropped out.
- **Selected work:** replaces the logo marquee. It shows LaunchMirror and ViralCheck, each labelled **Demo build**, with real desktop and phone screenshots captured on 11 Nov 2026 and descriptions limited to what the live product visibly does.
- **Services:** one section with exactly two chapters, each covering who it helps, the problem, what we build and what a project can include. The AI chapter has a worked example in plain sentences, labelled as an illustration and not a client case.
- **Process:** one four-step sequence with no durations.
- **About teaser:** the founder portrait appears once at full size.
- **Header:** Services ▾ / Work / Pricing / About / Contact. WhatsApp and phone appear automatically once configured. On phones the CTA shortens to "Contact".
- **Footer:** Careers, placeholder socials and the geography claim are removed. The CTA block is hidden on /contact to avoid repeating the page.
- **Work page:** each project gets a consistent structure (what it is, the problem, what was built, who built it, live link), plus a note on how client work is handled.
- **Pricing page:** packages show who it's for, what's included and not included, timeline, payment, and third-party costs outside our fee, with all prices in INR. Values that aren't confirmed show a neutral statement, never an invented figure.
- **Contact page:** the direct routes (WhatsApp, call, booking, email) render when configured. The form is shorter and has an optional phone field, INR budget bands, inline validation with focus management, a loading state, a 15-second timeout, honest success and error messages, and spam protection (honeypot plus a minimum time on the page).
- **About page:** one founder introduction, four working principles, and links to the two services. No inflated biography.
- **Service pages:** a ruled "what we build" list, the worked example (AI page), what an engagement includes, related work, and a link to the other service.

## 4. Removed (recoverable from git)
- Pages: `blog.html`, `careers.html`, `resources.html`. `vercel.json` now redirects `/blog` and `/resources` to `/`, and `/careers` to `/contact`.
- Homepage sections: logo marquee, intro spread, 3D pillar stack, four-card grid, gradient "signature" window, roadmap visual, point-of-view block, second founder block, Insights.
- `styles/motion.css` and `scripts/motion.js`. The old `site.js` scroll reveal.
- Copy: "Brand & AI Strategist", market claims, "One business day" response promise, USD budgets.

**Kept:** the static generator architecture, logo crop system, founder-face CTA, hero video, Services dropdown, Supabase client (`db.js`), all asset files (including VMS Careline, TrueReview, the old video masters and the `.docx`).

## 5. Unverified or held back (render nothing until confirmed in `data.mjs`)
1. **Contact form backend is dead.** See the audit table. Create a new Supabase project (table `leads`: name, email, company, budget, project_description) or switch to a form service, update `db.js`, then set up and test the email notification to harsh@ostendic.com.
2. WhatsApp number, phone number, booking link (Calendly/Cal.com), LinkedIn/Instagram URLs.
3. VMS Careline: needs written permission and the exact personal contribution.
4. TrueReview: remove the invented figures and placeholders from the demo, then publish.
5. LaunchMirror and ViralCheck are labelled demo builds "designed and built by Ostendic". Confirm this is accurate.
6. Pricing: the Diagnostic fee and timeline, payment terms for both packages, and the Starter package (proposed ₹12,000 / 5 days, held back until scope, revisions, exclusions and payment terms are confirmed).
7. A substantiated founder bio (background, previous roles), if you want one on /about.

**Not built:** `/starter` and `/schools`. The brief requires a confirmed scope and offer first.

## 6. QA performed (headless Chrome 157, local server)
- Pages: `/`, `/services`, both service pages, `/work`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`.
- Widths 360, 390, 768, 1024, 1440, 1920: no horizontal overflow on any page (scrollWidth equals viewport), no console errors, no failed requests.
- Visual review of rendered screenshots: desktop for all pages, mobile for home, contact, pricing and the menu.
- Link crawl: 22 internal targets plus in-page anchors, 0 broken. Live demo URLs return 200. Old URLs redirect.
- Form: empty submit flags all three required fields and focuses the first; an invalid email is caught; the honeypot drops the submission with no network request; a genuine submit shows "Sending…" and then the honest error, because the backend doesn't resolve.
- Mobile menu: opens with focus on its first link, Escape closes it and returns focus to the burger, and it is `inert` while closed. The hero video does not load on phones.
- **Not measured:** Core Web Vitals (LCP, INP, CLS). Run PageSpeed Insights after deploying. Expected improvements: the video doesn't load on mobile, one stylesheet replaces two, `motion.js` is gone, and image dimensions are reserved.

---

## Revision 2 (11 Nov 2026)

**1. Selected work.** VMS Careline is first, labelled **Client project**, and its copy is taken from the project record (two verticals, commerce rebuild, enquiry automation). It has no results or figures. Its visual is a brand plate made from the official logo file, the two colours sampled from it (#0C6084, #189C84) and the two verticals. There is no website screenshot or preview. TrueReview, ViralCheck and LaunchMirror sit in a separate **Demo builds** row, with copy saying they are in-house products and not client work. TrueReview uses a new screenshot of the tool's own input screen, avoiding the invented numbers in its hero.

**2. Overlapping text.** The cause was `position: sticky` on `.chap__head`. A sticky grid item is limited by the whole grid container, so the pinned heading stayed stuck while the example box in the next row scrolled under it. The heading and facts now sit in their own `.chap__main` container, which releases the heading before the example. The live site (ostendic.com) has a separate case: 36 collisions from the old pinned 3D stack and the roadmap, which the new build no longer contains. A scroll test (every 60px, at 1440, 1024, 768, 390 and 360px) found 0 overlaps on Home, Services, the AI page and Work.

**3. Booking.** `/book` embeds Calendly or Cal.com inline. The provider is detected from `site.booking`. Loading, error and success states come only from the provider's own events. The success panel appears only when the provider reports a booking. With no URL set, no `/book` page is built and CTAs stay "Start a conversation". Tested against Cal.com's public demo event (test build only, nothing booked): desktop and mobile both showed date → 34 real slots → name/email form. The error state appears when the provider is blocked. **Not tested end to end:** the success panel, because that needs a real booking.

**4. Roadmap.** A connected rail with four stages and large stage numbers. Each stage has a "You receive" line. The rail fills on scroll, and reached stages turn petrol. Text is never hidden. The layout is horizontal on desktop and vertical below 860px. The rail is drawn complete with reduced motion or without JS. The workflow example in the AI section uses the same component.

**5. Founder photo.** On the homepage, the portrait is now a 56px circle next to the founder's name, the same size on every screen. The small portrait in the CTA button is unchanged.

**6. Numbers.** 30+ projects, 20+ clients and the 4.6 rating can't be verified from anything in the repository (no CRM export, client list, invoices or review source). The component is built, but `stats.publish = false`, and each figure needs `verified` plus a stated `basis`. Supportable alternatives: a rating quoted with its public source and review count ("4.6 on Google, n reviews"); a count of unique invoiced clients; projects delivered, counted from invoices and excluding demo builds.
