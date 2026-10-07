/* core/export.js — turns a portfolio object into a single self-contained .html file
   that anyone can open, host on GitHub Pages/Netlify, or email to a client. */

import { esc } from './utils.js';
import { getTemplate } from '../templates/registry.js';
import { MOTION_CSS, MOTION_JS } from './motion.js';
import { CONTACT, portfolioCreditHTML } from './config.js';

/** Shared font stack — used by the exported file, the editor preview and thumbnails. */
export const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;

/** A complete document for a portfolio — used for download, print and the live page. */
export function buildStandaloneHTML(pf) {
  const tpl = getTemplate(pf.templateId);
  const showCredit = pf.meta?.credit !== false;
  const body = tpl.render(pf) + (showCredit ? `\n<div class="pg-credit-wrap">${portfolioCreditHTML()}</div>` : '');
  const title = pf.meta?.title || `${pf.profile?.name || 'Portfolio'} — ${pf.profile?.role || ''}`.trim();
  const description = pf.meta?.description || pf.profile?.tagline || '';
  const og = pf.profile?.photo && String(pf.profile.photo).startsWith('http') ? pf.profile.photo : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="profile">
${og ? `<meta property="og:image" content="${esc(og)}">` : ''}
${pf.meta?.favicon ? `<link rel="icon" href="${esc(pf.meta.favicon)}">` : ''}
${FONT_LINK}
<style>
${tpl.css(pf)}
${MOTION_CSS}
</style>
${pf.meta?.analytics || ''}
</head>
<body>
${body}
<script>
${MOTION_JS}
</script>
</body>
</html>`;
}

/** The same document, wrapped for a sandboxed preview iframe (animations allowed). */
export function previewDocument(pf, { credit = true } = {}) {
  const tpl = getTemplate(pf.templateId);
  const body = tpl.render(pf) + (credit && pf.meta?.credit !== false ? `\n<div class="pg-credit-wrap">${portfolioCreditHTML()}</div>` : '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FONT_LINK}
<style>
${tpl.css(pf)}
${MOTION_CSS}
</style>
</head>
<body>
${body}
<script>
${MOTION_JS}
</script>
</body>
</html>`;
}

/** Static thumbnail document — no script, so five of them cost nothing to render. */
export function thumbnailDocument(pf) {
  const tpl = getTemplate(pf.templateId);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${FONT_LINK}
<style>
${tpl.css(pf)}
[data-reveal]{opacity:1;transform:none}
.reveal-line>span{transform:none}
</style>
</head>
<body>
${tpl.render(pf)}
</body>
</html>`;
}

export function downloadPortfolioHTML(pf) {
  const html = buildStandaloneHTML(pf);
  const slug = pf.slug || 'portfolio';
  return { html, filename: `${slug}.html` };
}

/** Full backup of every portfolio — JSON you can re-import later. */
export function buildBackupJSON(portfolios) {
  return JSON.stringify({ app: 'portfolioly', version: 1, exportedAt: new Date().toISOString(), portfolios }, null, 2);
}
