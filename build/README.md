# Ostendic site build

Static generator. No framework, no runtime JS framework, no build step required
on the host — HTML is generated into the project root and served directly.

    node build/build.mjs

| file | role |
|---|---|
| `data.mjs`  | all content. Single source of truth. Placeholders marked `TEMP-PLACEHOLDER`. |
| `ui.mjs`    | primitives: buttons, eyebrows, headings, cards, FAQ, header, footer, page shell |
| `pages.mjs` | page compositions — each page varies its own section rhythm |
| `build.mjs` | writes `.html`, `sitemap.xml`, `robots.txt`, `favicon.svg` |

Runtime: `styles/ostendic.css` + `scripts/site.js` (progressive enhancement only —
every page is fully readable and navigable with JS disabled).
The contact form posts through the existing `db.js` Supabase client; a failed
submission is reported as a failure, never as success.
