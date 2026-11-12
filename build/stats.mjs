/* ===========================================================================
   OSTENDIC — STATS BAR
   The only place the stats bar's values and labels live. Edit them here;
   the bar on the homepage and the About page both read this list.
   =========================================================================== */

export const STATS_ARE_PLACEHOLDER = true;

/* PLACEHOLDER VALUES FOR LAYOUT PREVIEW ONLY. Replace with verified figures before any deploy. */
/* icon (optional): a file in workflow-ring-v2/, inlined unchanged */
export const stats = [
  { value: '30+', label: 'Projects delivered', icon: 'stat-1-projects.svg' },
  { value: '20+', label: 'Clients served', icon: 'stat-2-clients.svg' },
  { value: '4.6 / 5', label: 'Average client rating', icon: 'stat-3-rating.svg' },
];

/* This site is generated ahead of time (node build/build.mjs), so
   NODE_ENV is read at BUILD time, not in the browser.
   - A production build refuses to run while the values are placeholders.
   - Any other build prints a warning in the terminal, and the bar adds a
     console.warn to every page it renders on (statsDevWarning below). */
const isProduction = globalThis.process?.env?.NODE_ENV === 'production';
if (STATS_ARE_PLACEHOLDER && isProduction) {
  throw new Error('StatsBar is showing placeholder numbers. Replace them with verified figures in build/stats.mjs and set STATS_ARE_PLACEHOLDER = false before a production build.');
}
if (STATS_ARE_PLACEHOLDER) {
  console.warn('[build] StatsBar is showing placeholder numbers (build/stats.mjs). Not for deploy.');
}
export const statsDevWarning = STATS_ARE_PLACEHOLDER && !isProduction
  ? '<script>console.warn("StatsBar is showing placeholder numbers");</script>'
  : '';
