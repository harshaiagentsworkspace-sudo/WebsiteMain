/* ===========================================================================
   OSTENDIC — STATS BAR
   Values and labels come from content/settings.json (Admin › Settings ›
   Stats bar). The bar on the homepage and the About page both read this.
   =========================================================================== */
import { statsConfig } from './data.mjs';

export const STATS_ARE_PLACEHOLDER = statsConfig.placeholder;
export const stats = statsConfig.items;

/* NODE_ENV is read at BUILD time. A production build refuses to run while
   the values are marked as placeholders; any other build warns. */
const isProduction = globalThis.process?.env?.NODE_ENV === 'production';
if (STATS_ARE_PLACEHOLDER && isProduction) {
  throw new Error('The stats bar is showing placeholder numbers. Replace them with verified figures in Admin › Settings › Stats bar and turn off “These numbers are placeholders”.');
}
if (STATS_ARE_PLACEHOLDER) {
  console.warn('[build] Stats bar is showing placeholder numbers (Admin › Settings › Stats bar). Not for deploy.');
}
export const statsDevWarning = STATS_ARE_PLACEHOLDER && !isProduction
  ? '<script>console.warn("StatsBar is showing placeholder numbers");</script>'
  : '';
