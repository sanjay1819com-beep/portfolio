/* main.js — hash router. Routes: #/  |  #/edit/:id  |  #/p/:slug */

import { store } from './core/store.js';
import { setRouter } from './core/router.js';
import { MOTION_CSS, MOTION_JS } from './core/motion.js';
import { renderGallery } from './pages/gallery.js';
import { renderEditor } from './pages/editor.js';
import { renderPortfolio, teardownPortfolio } from './pages/portfolio.js';

const app = () => document.getElementById('app');

/* The app shell gets the same motion engine as an exported portfolio, so the
   tool and the thing it builds feel like one product. */
(function bootMotion() {
  const style = document.createElement('style');
  style.id = 'motion-css';
  style.textContent = MOTION_CSS;
  document.head.appendChild(style);

  const script = document.createElement('script');
  script.textContent = MOTION_JS;
  document.body.appendChild(script);

  document.documentElement.classList.add('grain');
})();

function parse(hash) {
  const clean = String(hash || '').replace(/^#\/?/, '');
  const [head, ...rest] = clean.split('/');
  if (!head) return { name: 'gallery', params: {} };
  if (head === 'edit') return { name: 'editor', params: { id: rest[0] } };
  if (head === 'p') return { name: 'portfolio', params: { slug: decodeURIComponent(rest[0] || '') } };
  return { name: 'gallery', params: {} };
}

let lastRoute = null;

export function route() {
  const root = app();
  if (!root) return;
  const { name, params } = parse(location.hash);

  if (lastRoute === 'portfolio' && name !== 'portfolio') teardownPortfolio();
  if (name !== 'portfolio') document.body.classList.remove('has-pub');

  root.innerHTML = '';
  if (name === 'editor') renderEditor(root, params);
  else if (name === 'portfolio') renderPortfolio(root, params);
  else renderGallery(root);

  lastRoute = name;
  window.scrollTo(0, 0);

  /* Re-bind motion for the freshly rendered screen: reveals, tilt and counters
     only see elements that exist at the moment they run. */
  requestAnimationFrame(() => {
    if (typeof window.__motion === 'function') window.__motion();
    const vh = window.innerHeight || 900;
    root.querySelectorAll('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add('is-in');
    });
  });
}

setRouter(route);

/* first run: create the demo portfolios so the gallery has something to show */
store.seedIfEmpty();

window.addEventListener('hashchange', route);
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', route);
else route();
