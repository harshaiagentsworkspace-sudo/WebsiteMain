/* Static site generator — writes .html into the project root.
   Run: node build/build.mjs
   Page titles, descriptions, share images and noindex come from
   content/pages.json (Admin › Pages › Search listing); blog posts carry
   their own SEO fields (Admin › Blog › post › Search engine listing). */
import { writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, pageHead, btn } from './ui.mjs';
import { site, pillars, pending, pagesCopy } from './data.mjs';
import * as P from './pages.mjs';
import { posts, BLOG_IS_PLACEHOLDER, plainText, futureDated, src as mediaSrc } from './blog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const written = [];
const add = (rel, html) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
  written.push(rel);
};
const abs = (u) => /^https?:\/\//.test(u) ? u : site.url + mediaSrc(u);
const SEO = pagesCopy.seo;
/* page() arguments from a route's search listing */
const seoFor = (route) => {
  const s = SEO[route];
  return { title: s.title, desc: s.description, ogImage: s.ogImage || '', noindex: s.noindex, current: route,
    ogTitle: s.ogTitle || '', ogDesc: s.ogDescription || '', twTitle: s.twitterTitle || '', twDesc: s.twitterDescription || '' };
};
const crumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + path })),
});

const heroPreload = '<link rel="preload" as="image" href="/assets/hero-vortex-poster.jpg">\n';

/* stable ids, so every page's structured data points at one Organization */
const ORG = { '@id': `${site.url}/#organization` };

add('index.html', page({ ...seoFor('/'), body: P.home(), preload: heroPreload,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url,
    description: SEO['/'].description, inLanguage: 'en-IN', publisher: ORG }] }));
add('services.html', page({ ...seoFor('/services'), body: P.servicesIndex(),
  jsonld: [crumbs([['Home', '/'], ['Services', '/services']])] }));
for (const s of pillars) add(`services/${s.slug}.html`, page({
  ...seoFor(s.path), body: P.pillarPage(s),
  jsonld: [
    { '@context': 'https://schema.org', '@type': 'Service', '@id': `${site.url}${s.path}#service`, name: s.title,
      description: s.summary, serviceType: s.title, url: site.url + s.path, provider: ORG,
      hasOfferCatalog: { '@type': 'OfferCatalog', name: s.servicesHeading,
        itemListElement: s.services.map(([name, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, description } })) } },
    crumbs([['Home', '/'], ['Services', '/services'], [s.title, s.path]]),
  ],
}));
add('work.html', page({ ...seoFor('/work'), body: P.work(), jsonld: [crumbs([['Home', '/'], ['Work', '/work']])] }));
add('about.html', page({ ...seoFor('/about'), body: P.about(), jsonld: [
  { '@context': 'https://schema.org', '@type': 'AboutPage', name: SEO['/about'].title, url: site.url + '/about', about: ORG },
  crumbs([['Home', '/'], ['About', '/about']])] }));
add('contact.html', page({ ...seoFor('/contact'), body: P.contact(), needsForm: true, needsBooking: !!site.booking,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: SEO['/contact'].title, url: site.url + '/contact', about: ORG },
    crumbs([['Home', '/'], ['Contact', '/contact']])] }));

/* booking: only with a real scheduler configured */
if (site.booking) add('book.html', page({ ...seoFor('/book'), body: P.book(), needsBooking: true }));
else if (existsSync(join(ROOT, 'book.html'))) rmSync(join(ROOT, 'book.html'));

/* legal */
const L = pagesCopy.legal;
add('privacy.html', page({ ...seoFor('/privacy'), body: P.legal('Privacy', P.legalParas(L.privacy)) }));
add('terms.html', page({ ...seoFor('/terms'), body: P.legal('Terms', P.legalParas(L.terms)) }));

/* blog: index + one page per published post. While the blog switch is
   off, every blog page is noindex and none is in the sitemap. */
add('blog.html', page({ ...seoFor('/blog'), noindex: BLOG_IS_PLACEHOLDER || SEO['/blog'].noindex, body: P.blogIndex(),
  jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `${site.name} blog`, url: site.url + '/blog',
    blogPost: posts.map(p => ({ '@type': 'BlogPosting', headline: p.title, url: `${site.url}/blog/${p.slug}`, datePublished: p.publishedAt })) }] }));

const suffix = site.seo.titleSuffix || '';
for (const p of posts) {
  const url = `${site.url}/blog/${p.slug}`;
  const S = p.seo;
  const title = S.title || `${p.title}${suffix}`;
  const desc = S.description || p.excerpt;
  const img = S.ogImage || (p.featuredImage && p.featuredImage.src) || '';
  const words = plainText(p).split(/\s+/).filter(Boolean).length;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: p.title.slice(0, 110), description: desc, mainEntityOfPage: url, url,
      datePublished: p.publishedAt, dateModified: p.updatedAt || p.publishedAt,
      author: { '@type': 'Person', name: p.author },
      publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: abs(site.logo.nav) } },
      ...(img ? { image: [abs(img)] } : {}),
      articleSection: p.category, ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}), wordCount: words, inLanguage: 'en-IN' },
    crumbs([['Home', '/'], ['Blog', '/blog'], [p.title, `/blog/${p.slug}`]]),
  ];
  if (p.faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  add(`blog/${p.slug}.html`, page({
    title, desc, current: `/blog/${p.slug}`, body: P.blogPost(p),
    noindex: BLOG_IS_PLACEHOLDER || S.noindex, canonical: S.canonical || '', ogType: 'article', ogImage: img, jsonld: ld, ogTitle: S.ogTitle, ogDesc: S.ogDescription,
    headExtra: [
      `<meta property="article:published_time" content="${p.publishedAt}">`,
      p.updatedAt ? `<meta property="article:modified_time" content="${p.updatedAt}">` : '',
      `<meta property="article:section" content="${esc(p.category)}">`,
      ...p.tags.map(t => `<meta property="article:tag" content="${esc(t)}">`),
    ].filter(Boolean).join('\n') + '\n',
  }));
}
/* a post deleted (or turned back into a draft) in the admin panel loses its page */
const liveSlugs = new Set(posts.map(p => `${p.slug}.html`));
if (existsSync(join(ROOT, 'blog'))) {
  for (const f of readdirSync(join(ROOT, 'blog'))) {
    if (f.endsWith('.html') && !liveSlugs.has(f)) { rmSync(join(ROOT, 'blog', f)); console.log(`Removed blog/${f}`); }
  }
}

/* RSS feed */
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rfc822 = (d) => new Date(d + 'T09:00:00Z').toUTCString();
add('blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${x(site.name)} blog</title>
  <link>${site.url}/blog</link>
  <description>${x(SEO['/blog'].description)}</description>
  <language>en-in</language>
  <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map(p => `  <item>
    <title>${x(p.title)}</title>
    <link>${site.url}/blog/${p.slug}</link>
    <guid>${site.url}/blog/${p.slug}</guid>
    <pubDate>${rfc822(p.publishedAt)}</pubDate>
    <category>${x(p.category)}</category>
    <description>${x(p.excerpt)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`);

/* 404: Vercel serves /404.html, with a 404 status, for any URL that has no
   page. Not indexed, not in the sitemap. */
add('404.html', page({ title: `Page not found${site.seo.titleSuffix || ''}`, desc: 'This page doesn’t exist. It may have moved.',
  noindex: true, current: '/404', body: pageHead({ label: '404', lines: ['This page doesn’t exist.'],
    lead: 'It may have moved, or the link may be mistyped. These will take you somewhere useful.',
    actions: btn('Go to the home page', '/', 'primary') + btn('See our services', '/services', 'ghost') + btn('Contact us', '/contact', 'ghost') }) }));

/* Retired pages: their generated HTML is removed; vercel.json redirects
   the old URLs. A renamed service page (agentic-ai-workflows,
   business-consulting → ai-consulting) loses its old file the same way. */
for (const gone of ['careers.html', 'resources.html', 'services/agentic-ai-workflows.html', 'services/business-consulting.html']) {
  const f = join(ROOT, gone);
  if (existsSync(f)) rmSync(f);
}

/* sitemap + robots. Pages switched to noindex in the admin are left out.
   Pages carry no <lastmod>: the build date isn't when the page changed,
   and a wrong date teaches search engines to ignore the field. Blog posts
   keep theirs (publishedAt / updatedAt). */
const routes = ['/', '/services', ...pillars.map(s => s.path), '/work', '/about',
  ...(BLOG_IS_PLACEHOLDER || SEO['/blog'].noindex ? [] : ['/blog']),
  '/contact', ...(site.booking ? ['/book'] : []), '/privacy', '/terms'].filter(r => !SEO[r].noindex);
const blogUrls = BLOG_IS_PLACEHOLDER ? [] : posts.filter(p => !p.seo.noindex && !p.seo.canonical);
add('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${site.url}${r}</loc></url>`).join('\n')}
${blogUrls.map(p => `  <url><loc>${site.url}/blog/${p.slug}</loc><lastmod>${p.updatedAt || p.publishedAt}</lastmod></url>`).join('\n')}
</urlset>`);
add('robots.txt', `User-agent: *\nAllow: /\nDisallow: /legacy/\nDisallow: /orbix-reference/\nDisallow: /form-studio/\nDisallow: /admin\nDisallow: /api/\nDisallow: /build/\nDisallow: /content/\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${written.length} files:`);
for (const w of written) console.log('  ' + w);
if (futureDated.length) console.log(`\nNote: ${futureDated.length} published post(s) carry a future date and are live now: ${futureDated.map(p => p.slug).join(', ')}`);
if (pending.length) {
  console.log(`\nPENDING (${pending.length}) — business details needed before these parts go live:`);
  for (const p of pending) console.log('  - ' + p);
}
