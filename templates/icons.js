/* templates/icons.js — inline SVG icons, so exported portfolios have zero dependencies */

import { esc, attr } from '../core/utils.js';

const S = (body, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;

export const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.6c0-1.34-.03-3.07-1.94-3.07-1.94 0-2.24 1.46-2.24 2.97V21h-4V9Z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.53 3h3.05l-6.66 7.61L21.75 21h-6.09l-4.77-6.24L5.44 21H2.38l7.13-8.14L2.25 3h6.24l4.31 5.7L17.53 3Zm-1.07 16.16h1.69L7.62 4.75H5.8l10.66 14.41Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  dribbble: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M5 7.5c4.2 1 8.6.4 12-1.8M3.6 13.6c4.6-1.4 9.4.1 12 4M8.4 3.4c3 3.6 5 8 5.6 13.4"/></svg>`,
  behance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2.5 6h5.2a2.8 2.8 0 0 1 0 5.6H2.5V6Zm0 5.6h5.9a2.9 2.9 0 0 1 0 5.8H2.5v-5.8Z"/><path d="M15 13.2h6.3c0-2.4-1.3-4.3-3.2-4.3s-3.3 1.9-3.3 4.3 1.4 4.2 3.3 4.2c1.4 0 2.5-.7 3-1.9"/><path d="M16.2 6.6h4.4"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 4.9 12 4.9 12 4.9s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12c0 1.6.13 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.9c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.9c.27-1.6.4-3.2.4-4.8s-.13-3.2-.4-4.8ZM10 15.2V8.8l5.3 3.2-5.3 3.2Z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l7.6 9.6L4.3 20M20 4l-7.4 8.2M9 4l11 16"/></svg>`,
  medium: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="7.5" cy="12" r="4.6"/><ellipse cx="16.4" cy="12" rx="2.3" ry="4.4"/><ellipse cx="21.2" cy="12" rx="1" ry="3.6"/></svg>`,
  figma: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3H8.6a2.6 2.6 0 0 0 0 5.2H12V3ZM12 8.2H8.6a2.6 2.6 0 0 0 0 5.2H12V8.2ZM12 13.4H8.6a2.6 2.6 0 0 0 0 5.2H12v-5.2ZM12 3h3.4a2.6 2.6 0 0 1 0 5.2H12V3Z"/><circle cx="15.4" cy="10.8" r="2.6"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3.2 20.8 4.6 16A8.6 8.6 0 1 1 8 19.4l-4.8 1.4Z"/><path d="M9 9.2c.3 2 1.7 3.6 3.8 4.3.6.2 1.2-.2 1.4-.7l-1.5-1.1-.9.7c-1-.5-1.7-1.2-2.1-2.2l.7-.8-1-1.4c-.3.3-.5.7-.4 1.2Z"/></svg>`,
  website: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"/>'),
  email: S('<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/>'),
  phone: S('<path d="M6.2 3.5h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.4 6.4l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z"/>'),
  map: S('<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  arrow: S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowUp: S('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  mail: S('<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/>'),
  download: S('<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>'),
  code: S('<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>'),
  spark: S('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>'),
  check: S('<path d="m4 12.5 5 5L20 6.5"/>'),
  quote: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.5 5.5C6.5 7 4.8 9.7 4.8 13.4c0 3.2 1.8 5.1 4.2 5.1 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.4 0-.7 0-1 .2.3-1.7 1.6-3.2 3.4-4.2l-2.3-2.4Zm9.2 0c-3 1.5-4.7 4.2-4.7 7.9 0 3.2 1.8 5.1 4.2 5.1 2 0 3.5-1.4 3.5-3.4 0-1.9-1.3-3.2-3.1-3.2-.4 0-.7 0-1 .2.3-1.7 1.6-3.2 3.4-4.2l-2.3-2.4Z"/></svg>`,
};

/** Look up an icon by key, tolerating anything the user typed. */
export function icon(name, cls = '') {
  const key = String(name || '').trim().toLowerCase();
  const body = ICONS[key] || ICONS.website;
  return `<span class="icon ${cls}">${body}</span>`;
}

/** Social row used by most templates. */
export function socialRow(socials, cls = '') {
  if (!socials || !socials.length) return '';
  const items = socials
    .filter(s => s && (s.url || s.label))
    .map(s => {
      const label = s.label || s.icon || 'link';
      const href = attr(s.url || '#') || '#';
      return `<a class="soc" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}">${icon(s.icon)}<span>${esc(label)}</span></a>`;
    })
    .join('');
  return items ? `<div class="${cls}">${items}</div>` : '';
}
