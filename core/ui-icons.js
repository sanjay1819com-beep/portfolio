/* core/ui-icons.js — hand-drawn stroke icons for the app chrome.
   Drawn as plain SVG paths so the UI never falls back to platform emoji,
   which is the fastest way to make a product look generated. */

const svg = (body, sw = 1.6) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const UI = {
  // steps
  palette: svg('<path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.4 0 2-.9 2-1.8 0-1.3-1-1.7-1-2.7 0-.8.7-1.4 1.6-1.4h1.5a4.7 4.7 0 0 0 4.7-4.7C20.8 6 16.9 3.2 12 3.2Z"/><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="9.6" r="1" fill="currentColor" stroke="none"/>'),
  pencil: svg('<path d="M16.4 3.9 20 7.5 8.6 18.9l-4.4.9.9-4.4L16.4 3.9Z"/><path d="m14.6 5.7 3.6 3.6"/>'),
  rocket: svg('<path d="M13.6 4.4c3-1.6 6-1.4 6-1.4s.2 3-1.4 6c-1.3 2.4-3.6 4.4-6 5.6l-2.8-2.8c1.2-2.4 3.2-4.7 5.6-6Z"/><path d="M9.4 11.8 6.2 12.6l-1.8 2.6 2.8.6"/><path d="m12.2 14.6-.8 3.2 2.6-1.8.6-2.8"/><circle cx="15.4" cy="8.6" r="1.3"/>'),

  // toolbar
  download: svg('<path d="M12 3.5v11.5M7.5 10.5 12 15l4.5-4.5M4.5 20h15"/>'),
  upload: svg('<path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5M4.5 20h15"/>'),
  link: svg('<path d="M10.5 13.5a3.6 3.6 0 0 0 5.2 0l2.6-2.6a3.7 3.7 0 0 0-5.2-5.2l-1.2 1.2"/><path d="M13.5 10.5a3.6 3.6 0 0 0-5.2 0l-2.6 2.6a3.7 3.7 0 0 0 5.2 5.2l1.2-1.2"/>'),
  copy: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 5.5H6.7a2.2 2.2 0 0 0-2.2 2.2v8.8"/>'),
  print: svg('<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/>'),
  external: svg('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14.5v3.8a1.7 1.7 0 0 1-1.7 1.7H6.2a1.7 1.7 0 0 1-1.7-1.7V8.2A1.7 1.7 0 0 1 6.2 6.5H10"/>'),
  eye: svg('<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.9"/>'),
  trash: svg('<path d="M4.5 6.5h15M9.5 6.5V4.8h5v1.7M6.5 6.5l.9 12.1a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.1"/>'),
  duplicate: svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 5.5H6.7a2.2 2.2 0 0 0-2.2 2.2v8.8"/>'),
  check: svg('<path d="m4.5 12.5 5 5L20 6.5"/>'),
  spark: svg('<path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  shield: svg('<path d="M12 3.5 19 6v6c0 4-3 7.2-7 8.5-4-1.3-7-4.5-7-8.5V6l7-2.5Z"/><path d="m9 12 2.2 2.2L15.2 10"/>'),
  layers: svg('<path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3L12 3.5Z"/><path d="m3.5 12.2 8.5 4.3 8.5-4.3"/><path d="m3.5 16.4 8.5 4.3 8.5-4.3"/>'),
  plus: svg('<path d="M12 5.5v13M5.5 12h13"/>'),
};

/** Convenience: UI.download rendered at a given size. */
export function icon(name, size = 15) {
  return (UI[name] || '').replace('<svg ', `<svg width="${size}" height="${size}" `);
}
