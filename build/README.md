# Ostendic site build

Static generator. No framework: HTML is generated into the project root and
served directly. Vercel runs `node build/build.mjs` on every deploy.

    node build/build.mjs        # writes the pages, blog/feed.xml, sitemap.xml, robots.txt
    node build/serve.mjs 3000   # local server mirroring vercel.json, plus the admin API in local mode

## Content lives in `content/*.json`, edited at `/admin`

| file | what it holds |
|---|---|
| `content/settings.json` | business identity, contact channels, search & analytics, form options, stats bar, footer invitation |
| `content/home.json`     | home page hero, problems, service panels, who we help, solutions, benefits, process, About teaser, FAQ |
| `content/services.json` | the four service pages (web-development, ai-automation, ai-agent-development, business-consulting), each with detail sections and an FAQ |
| `content/pages.json`    | per-page search listing (title, description, share image, noindex) and the copy of Services, Work, About, Contact, Book, Blog, Privacy, Terms |
| `content/work.json`     | projects |
| `content/blog.json`     | blog posts (article as blocks, SEO, FAQ, featured image) |
| `content/media.json`    | alt text and size of uploaded images (files in `media/`) |
| `vercel.json` → `redirects` | edited as "Redirects" in the admin |

`build/schema.mjs` describes every file. The build, the admin API and the
admin forms all use it, so a bad edit is refused before it can break the site.

| file | role |
|---|---|
| `schema.mjs`   | content schema, validator, inline HTML sanitiser |
| `content.mjs`  | loads and validates content files |
| `data.mjs`     | shapes content for the templates |
| `blog.mjs`     | posts, block rendering, reading time |
| `ui.mjs`       | primitives: buttons, header, footer, page shell (SEO head) |
| `sections.mjs` | homepage sections |
| `pages.mjs`    | page compositions |
| `build.mjs`    | writes the files and prints the PENDING list |

## Admin panel

`admin.html` + `scripts/admin/*.js` (ES modules, no build step) + `styles/admin.css`,
talking to `api/admin/*.mjs` (Vercel functions). `api/enquiry.mjs` takes
contact-form submissions for the inbox. Setup is in `.env.example`.

Runtime for visitors: `styles/ostendic.css` + `scripts/site.js` (progressive
enhancement only). The contact form posts through `db.js` to Web3Forms (email)
and `/api/enquiry` (inbox). A failed submission is reported as a failure,
never as success.

## SEO and analytics

- One page shell (`ui.mjs` › `page`) writes every page's title, description, canonical, robots, Open Graph, X card and JSON-LD. Per-page values come from `content/pages.json` › `seo` (Admin › Pages › Search listing), including separate social and X titles/descriptions.
- Structured data: Organization (`/#organization`) on every page, WebSite on the home page, Service + BreadcrumbList on each service page, BlogPosting on posts.
- `sitemap.xml` lists indexable pages only, without `<lastmod>` (the build date is not when a page changed); posts keep their own dates.
- `404.html` is served by Vercel for unknown URLs, with a 404 status.
- Service slugs are `SERVICE_SLUGS` in `schema.mjs`. Renaming one changes a public URL: add a permanent redirect in `vercel.json`.
- The stats bar is not rendered while Admin › Settings › Stats bar is marked as placeholders.
- GA4 loads only when a measurement ID is set (Admin › Settings). `scripts/site.js` then sends: `cta_click`, `email_contact_click`, `phone_contact_click`, `whatsapp_contact_click`, `contact_form_submit` + `generate_lead` (on a confirmed send), and `scripts/booking.js` sends `book_consultation` when the scheduler confirms a booking. No personal details are sent.
