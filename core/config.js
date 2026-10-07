/* core/config.js — one place for the product's identity.
   Change anything here and it updates across the whole app. */

export const BRAND = {
  /** Small line above the wordmark. */
  tag: 'Soft_Tech',
  /** Main wordmark. */
  name: 'PortfoGen',
  /** Full name, used in <title> and credits. */
  full: 'Soft_Tech PortfoGen',
  /** Letter inside the square mark. */
  mark: 'S',
  tagline: 'Build your portfolio in 5 minutes',
};

export const CONTACT = {
  /* ⚠️ CHANGE THIS — "sanjay.com" was not a valid email address, so this is a
     placeholder. A mailto: link needs a real address or it will not open. */
  email: 'hello@soft-tech.com',

  /** Shown at the bottom of the PortfoGen website. */
  siteCta: 'Want to publish your portfolio? Talk to us.',
  siteCtaLabel: 'Email us',

  /** Shown in the footer of every generated portfolio. */
  portfolioCta: 'Want a portfolio like this? Build yours free with',
  portfolioCtaBrand: 'Soft_Tech PortfoGen',
};

/** The wordmark markup, so every screen renders it identically. */
export function brandHTML({ compact = false } = {}) {
  return `
    <span class="brand-tag">${esc0(BRAND.tag)}</span>
    <span class="brand-name">${compact ? '' : ''}${esc0(BRAND.name)}</span>`;
}

/** Full topbar brand link. */
export function brandLink() {
  return `<a class="brand" href="#/">
    <span class="brand-mark">${esc0(BRAND.mark)}</span>
    <span class="brand-word">${brandHTML()}</span>
  </a>`;
}

/** The contact line for generated portfolio footers. Returns '' if no email set. */
export function portfolioCreditHTML() {
  if (!CONTACT.email) return '';
  return `<a class="pg-credit" href="mailto:${esc0(CONTACT.email)}">${esc0(CONTACT.portfolioCta)} <b>${esc0(CONTACT.portfolioCtaBrand)}</b></a>`;
}

function esc0(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
