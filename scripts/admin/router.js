/* Ostendic admin: hash routes (#/posts/3). */
export const go = (hash) => { if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = hash; };
export const route = () => (location.hash.replace(/^#\/?/, '') || 'dashboard').split('/');
