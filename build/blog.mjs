/* ===========================================================================
   OSTENDIC — BLOG CONTENT
   Posts live in content/blog.json and are edited from the admin panel
   (/admin). Each post: { slug, category, title, excerpt, draft, body: [...] }.
   /blog lists the published posts in file order; each gets /blog/<slug>.
   Drafts are kept in the file but never built.
   =========================================================================== */
import { loadContent } from './content.mjs';

const blog = loadContent('blog');

/* `indexable` is the admin panel's "Show the blog to search engines" switch.
   While it is off: /blog and every post page carry
   <meta name="robots" content="noindex, nofollow">, and no blog URL is
   written to sitemap.xml. */
export const BLOG_IS_PLACEHOLDER = !blog.indexable;

export const posts = blog.posts.filter(p => !p.draft);

/* reading time from the word count of the body, at ~200 words a minute */
export const readingTime = (post) => {
  const words = post.body.join(' ').trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};
