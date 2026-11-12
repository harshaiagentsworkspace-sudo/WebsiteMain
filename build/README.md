# Ostendic site build

Static generator. No framework and no build step on the host: HTML is generated
into the project root and served directly.

    node build/build.mjs        # writes the pages, sitemap.xml, robots.txt
    node build/serve.mjs 3000   # local server mirroring vercel.json (clean URLs, redirects)

| file | role |
|---|---|
| `data.mjs`     | all content and business facts. Single source of truth. |
| `ui.mjs`       | primitives: buttons, header, footer, page shell |
| `sections.mjs` | homepage sections |
| `pages.mjs`    | page compositions |
| `build.mjs`    | writes the files and prints the PENDING list |

Runtime: `styles/ostendic.css` + `scripts/site.js` (progressive enhancement only).

## Switching things on

Missing business details are `null` in `data.mjs`, and the matching UI stays
hidden until they're filled in. Every build prints what is still pending.

- `site.whatsapp` (digits, e.g. `9198xxxxxxxx`): WhatsApp buttons in the header, hero menu, footer, contact page
- `site.phone` (`{ display, tel }`): click-to-call
- `NEXT_PUBLIC_CALENDLY_URL` (see `.env.example`, read at build time; defaults to https://calendly.com/harshkdubeyhd): generates `/book` with the Calendly inline widget, and every "Book a quick call" button links to `/book`
- `site.social` (`[['LinkedIn', url], ...]`): footer links and structured data
- `projects[].publish`: shows a project on the homepage, the Work page and the service pages

The contact form posts through `db.js` (Supabase). A failed submission is
reported as a failure, never as success.
