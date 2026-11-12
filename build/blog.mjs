/* ===========================================================================
   OSTENDIC — BLOG CONTENT
   The only place blog posts live. To add a post, add one entry to `posts`:
   { slug, category, title, excerpt, body: ['paragraph', 'paragraph', ...] }.
   /blog lists them in this order; each gets a page at /blog/<slug>.
   =========================================================================== */

/* PLACEHOLDER POSTS. Replace with real posts and set the flag to false before enabling indexing.
   While true: /blog and every post page carry <meta name="robots" content="noindex, nofollow">,
   and no blog URL is written to sitemap.xml. */
export const BLOG_IS_PLACEHOLDER = true;

export const posts = [
  {
    slug: 'does-your-business-need-a-website',
    category: 'Websites',
    title: 'Does your business really need a website?',
    excerpt: 'A quick way to tell, and what to do if the answer is yes.',
    body: [
      'If customers search for you before they call, you need a website. That’s the simple test.',
      'Think about the last time you looked up a restaurant, a clinic or a shop. You probably checked Google first. If you found nothing, or only a map pin, you may have gone somewhere else.',
      'A good small-business site doesn’t need to be big. It needs to say what you do, show where you are and make it easy to call or message you. One clear page can do that.',
      'Start there. Add more once people are using it.',
    ],
  },
  {
    slug: 'why-visitors-leave-before-getting-in-touch',
    category: 'Websites',
    title: 'Why visitors leave before they get in touch',
    excerpt: 'Four common reasons a website loses people, and how to fix each one.',
    body: [
      'Most visitors don’t leave because your business is wrong for them. They leave because the site made things hard.',
      'Four things cause most of it. The page doesn’t say what you do. It’s awkward on a phone. There’s no clear next step, like a call button or a short form. Or it loads too slowly to wait for.',
      'Pick one and fix it this week. Open your site on your phone and ask a friend to find your phone number. If it takes more than a few seconds, you’ve found your first fix.',
    ],
  },
  {
    slug: 'what-an-ai-workflow-actually-does',
    category: 'AI workflows',
    title: 'What an AI workflow actually does',
    excerpt: 'A plain example of how a new enquiry gets followed up without anything slipping.',
    body: [
      'An AI workflow is a set of steps that runs by itself in the background. It doesn’t replace your team. It handles the boring parts.',
      'Here’s a simple example. A new enquiry arrives. The workflow saves the details, drafts a reply and asks a person to approve it. Then it sets a reminder to follow up.',
      'Nothing waits in an inbox. Nothing gets forgotten. And a person still decides what gets sent.',
      'That’s the idea behind what we build: software does the repetitive steps, and people keep the decisions.',
    ],
  },
];

/* reading time from the word count of the body, at ~200 words a minute */
export const readingTime = (post) => {
  const words = post.body.join(' ').trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};
