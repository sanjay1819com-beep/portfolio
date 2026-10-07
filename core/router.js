/* core/router.js — navigation helper, kept separate so pages/ can use it
   without importing main.js (which imports pages/ → circular dependency). */

let routeFn = null;

/** main.js registers the real router here at startup. */
export function setRouter(fn) { routeFn = fn; }

export function navigate(hash) {
  if (typeof location === 'undefined') return;
  if (location.hash === hash) { if (routeFn) routeFn(); return; }
  location.hash = hash;
}
