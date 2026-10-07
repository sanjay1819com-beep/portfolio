/* core/utils.js — tiny helpers shared everywhere */

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escape a value before it goes into an HTML string. */
export function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a value going into an attribute, and neutralise dangerous URL schemes. */
export function attr(v) {
  const raw = String(v ?? '').trim();
  if (!raw) return '';
  // data: is allowed for inline images (including SVG, which cannot execute
  // scripts when loaded through <img>), but never for anything executable.
  const scheme = raw.slice(0, raw.indexOf(':') + 1).toLowerCase();
  const flat = raw.toLowerCase().replace(/[\s\u0000-\u001f]/g, '');
  const BLOCKED = ['javascript:', 'vbscript:', 'livescript:', 'data:text/html', 'data:application/'];
  if (BLOCKED.some(b => flat.startsWith(b))) return '#';
  if (scheme && !['http:', 'https:', 'mailto:', 'tel:', 'data:', 'sms:', 'callto:', '#'].includes(scheme) && !raw.startsWith('#') && !raw.startsWith('/') && !raw.startsWith('.')) {
    return '#';
  }
  return esc(raw);
}

/** "Rahul Kumar" -> "rahul-kumar" */
export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function download(filename, content, type = 'text/html') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

/** Split "Python, Go, Rust" into ["Python","Go","Rust"] */
export function toList(str) {
  return String(str || '')
    .split(/[,\n]/)
    .map(s => s.trim())
    .filter(Boolean);
}

/** Render a multi-line text block safely, preserving blank-line paragraphs. */
export function paragraphs(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Small floating notification. kind: '' | 'ok' | 'err' */
export function toast(message, kind = '', ms = 2400) {
  const root = document.getElementById('toast-root');
  if (!root) { console.log(message); return; }
  const el = document.createElement('div');
  el.className = `toast ${kind}`.trim();
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s, transform .25s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 260);
  }, ms);
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Deterministic avatar so a portfolio looks finished before a photo is added. */
export function placeholderPhoto(seed = 'A', label) {
  const text = String(label || seed).trim();
  const initials = text
    ? text.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'P';
  const hue = [...text].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 70% 58%)"/><stop offset="1" stop-color="hsl(${(hue + 48) % 360} 70% 44%)"/>
</linearGradient></defs>
<rect width="128" height="128" fill="url(#g)"/>
<text x="64" y="80" font-family="system-ui, sans-serif" font-size="46" font-weight="700" fill="rgba(255,255,255,.95)" text-anchor="middle">${esc(initials || 'P')}</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Deterministic abstract cover so project/work cards never look empty. */
export function placeholderImage(seed = 1, w = 800, h = 600) {
  const n = Math.abs(String(seed).split('').reduce((a, c) => a + c.charCodeAt(0) * 7, 11));
  const hue = n % 360;
  const c1 = `hsl(${hue} 62% 42%)`, c2 = `hsl(${(hue + 70) % 360} 68% 62%)`, c3 = `hsl(${(hue + 180) % 360} 55% 30%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c3}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#bg)"/>
<circle cx="${w * 0.78}" cy="${h * 0.24}" r="${h * 0.42}" fill="${c2}" opacity=".35"/>
<circle cx="${w * 0.18}" cy="${h * 0.86}" r="${h * 0.34}" fill="${c2}" opacity=".22"/>
<rect x="${w * 0.3}" y="${h * 0.52}" width="${w * 0.5}" height="${h * 0.08}" rx="8" fill="rgba(255,255,255,.16)"/>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function img(src, fallbackSeed, alt = '') {
  const s = String(src || '').trim();
  const url = s ? s : placeholderImage(fallbackSeed || alt || 'img');
  return `<img src="${attr(url)}" alt="${attr(alt)}" loading="lazy">`;
}

export function photoSrc(src, name) {
  const s = String(src || '').trim();
  return s || placeholderPhoto(name || 'P', name);
}

export function initialsOf(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || '?';
}

export function link(label, href, cls = '') {
  const h = String(href || '').trim();
  if (!label && !h) return '';
  if (!h) return `<span class="${cls}">${esc(label)}</span>`;
  const ext = /^https?:/i.test(h) ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="${cls}" href="${attr(h)}"${ext}>${esc(label)}</a>`;
}
