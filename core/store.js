/* core/store.js — portfolio data, persistence, seed data
   Everything is stored in localStorage so the site works from VS Code with no backend.
   Portfolios are readable at  #/p/<slug>  */

/* The storage namespace is deliberately still "portfolioly.v1". Renaming it would
   orphan every portfolio already saved in a user's browser. Bump to .v2 only with
   a migration that copies the old keys across. */
export const NS = 'portfolioly.v1';
const K_INDEX   = `${NS}.index`;
const K_DATA    = `${NS}.data`;      // { id: portfolio }
const K_CURRENT = `${NS}.current`;   // id of the portfolio being edited

/* ------------------------------- storage -------------------------------- */
/* Checked at call time, not import time: ES module imports are hoisted, so a
   caller that installs its own localStorage (tests, or a polyfill) would
   otherwise be captured as "no storage available". */
function hasStore() {
  try { return typeof globalThis.localStorage !== 'undefined' && !!globalThis.localStorage; }
  catch { return false; }
}

function read(key, fallback) {
  if (!hasStore()) return fallback;
  try {
    const raw = globalThis.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function write(key, value) {
  if (!hasStore()) return false;
  try { globalThis.localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.error('storage write failed', e); return false; }
}

/* ------------------------------- shape ---------------------------------- */
export function blankPortfolio(overrides = {}) {
  return {
    id: `pf_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    slug: '',
    templateId: 'dev-dark',
    updatedAt: Date.now(),
    labels: {},            // user overrides for section headings — see core/labels.js
    meta: {
      title: '',
      description: '',
      favicon: '',
      analytics: '',
      customCss: '',
      footerNote: 'Built with Soft_Tech PortfoGen',
      credit: true,
    },
    theme: {
      accent: '#6366f1',
      font: 'sans',
      radius: 14,
      dark: true,
      containerWidth: 1100,
      heroPhoto: false,    // use the profile photo as the big hero image
    },
    profile: {
      name: 'Your Name',
      role: 'Your role / headline',
      tagline: 'One sentence about what you do.',
      photo: '',
      about: '',
      location: '',
      email: '',
      phone: '',
      resumeUrl: '',
      availability: 'Available for work',
      cvLabel: 'Download CV',
    },
    stats: [],          // { label, value }
    skills: [],         // { name, level }
    services: [],       // { title, description, icon }
    projects: [],       // { title, description, image, tags, liveUrl, repoUrl }
    experience: [],     // { role, company, period, location, description }
    education: [],      // { degree, school, period, detail }
    testimonials: [],   // { quote, name, role, photo }
    socials: [],        // { label, url, icon }
    sections: {
      about: true, stats: true, skills: true, services: true, projects: true,
      experience: true, education: true, testimonials: true, contact: true,
    },
    ...overrides,
  };
}

/* ------------------------------- CRUD ----------------------------------- */
export const store = {
  list() {
    const data = read(K_DATA, {});
    return Object.values(data).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  },

  get(idOrSlug) {
    const data = read(K_DATA, {});
    if (!idOrSlug) return null;
    if (data[idOrSlug]) return data[idOrSlug];
    return Object.values(data).find(p => p.slug === idOrSlug) || null;
  },

  save(pf) {
    const data = read(K_DATA, {});
    const next = { ...pf, updatedAt: Date.now() };
    data[next.id] = next;
    write(K_DATA, data);
    write(K_INDEX, Object.keys(data));
    return next;
  },

  remove(id) {
    const data = read(K_DATA, {});
    delete data[id];
    write(K_DATA, data);
    write(K_INDEX, Object.keys(data));
    if (store.getCurrentId() === id) setCurrent(null);
    return true;
  },

  duplicate(id) {
    const src = store.get(id);
    if (!src) return null;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = `pf_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    copy.slug = uniqueSlug(`${copy.slug || 'portfolio'}-copy`);
    copy.profile = { ...copy.profile, name: `${copy.profile?.name || 'Portfolio'} (copy)` };
    copy.updatedAt = Date.now();
    store.save(copy);
    return copy;
  },

  getCurrentId() { return hasStore() ? globalThis.localStorage.getItem(K_CURRENT) : null; },
  setCurrent(id) { return setCurrent(id); },

  /** Make sure the demo portfolios exist the very first time someone opens the site. */
  seedIfEmpty() {
    if (store.list().length) return false;
    const seed = samplePortfolios();
    seed.forEach(p => store.save(p));
    return true;
  },

  /** Replace everything with an exported JSON blob. */
  importJSON(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    const items = Array.isArray(parsed) ? parsed : [parsed];
    items.forEach(item => {
      const pf = blankPortfolio(item);
      // keep nested objects intact
      Object.assign(pf, item, { id: item.id || pf.id, updatedAt: Date.now() });
      pf.slug = uniqueSlug(pf.slug || pf.profile?.name || 'portfolio');
      store.save(pf);
    });
    return items.length;
  },

  exportAll() {
    return JSON.stringify(store.list(), null, 2);
  },
};

function setCurrent(id) {
  if (!hasStore()) return false;
  if (id) globalThis.localStorage.setItem(K_CURRENT, id);
  else globalThis.localStorage.removeItem(K_CURRENT);
  return true;
}

export function uniqueSlug(base) {
  const data = read(K_DATA, {});
  const taken = new Set(Object.values(data).map(p => p.slug).filter(Boolean));
  let slug = base || 'portfolio';
  let i = 2;
  while (taken.has(slug)) slug = `${base}-${i++}`;
  return slug;
}

/* ------------------------------ samples --------------------------------- */
export function samplePortfolios() {
  const mk = (o) => blankPortfolio(o);

  const dev = mk({
    slug: 'aisha-khan',
    templateId: 'dev-dark',
    theme: { accent: '#4a4b52', font: 'sans', radius: 14, dark: true, containerWidth: 1100 },
    meta: { title: 'Sanjay — Full-stack developer', description: 'Full-stack developer from Bengaluru building fast, reliable web products.', footerNote: 'Built with Soft_Tech PortfoGen', customCss: '', favicon: '', analytics: '' },
    profile: {
      name: 'Sanjay',
      role: 'Full-stack Developer',
      tagline: 'I build fast, reliable web products — from database schema to pixel.',
      photo: '',
      about: 'I am a full-stack developer with 4 years of experience shipping products used by thousands of people every day.\n\nI care about clean architecture, fast load times and interfaces that feel obvious. Currently focused on React, Node and Postgres, and always happy to mentor juniors.',
      location: 'Bengaluru, India',
      email: 'sanjay@example.com',
      phone: '+91 98765 43210',
      resumeUrl: '',
      availability: 'Open to freelance',
      cvLabel: 'Download CV',
    },
    stats: [
      { label: 'Years experience', value: '4+' },
      { label: 'Projects shipped', value: '30' },
      { label: 'Happy clients', value: '18' },
    ],
    skills: [
      { name: 'JavaScript / TypeScript', level: 92 },
      { name: 'React & Next.js', level: 88 },
      { name: 'Node.js & Express', level: 84 },
      { name: 'PostgreSQL', level: 76 },
    ],
    services: [
      { title: 'Web apps', description: 'End-to-end product builds — auth, database, dashboard, deploy.', icon: '🧩' },
      { title: 'Frontend rebuilds', description: 'Turn a slow, messy UI into a fast, accessible one.', icon: '⚡' },
      { title: 'API design', description: 'Clean REST/GraphQL APIs with docs your team will actually read.', icon: '🔌' },
    ],
    projects: [
      { title: 'InvoicePilot', description: 'Billing tool for freelancers. Handles GST invoices, reminders and UPI payments.', image: '', tags: 'Next.js, Postgres, Razorpay', liveUrl: 'https://example.com', repoUrl: 'https://github.com' },
      { title: 'Trackr', description: 'Open-source habit tracker with offline-first sync and a 40kb bundle.', image: '', tags: 'React, IndexedDB, PWA', liveUrl: 'https://example.com', repoUrl: 'https://github.com' },
      { title: 'Kite CLI', description: 'Deploy static sites to any S3-compatible bucket with one command.', image: '', tags: 'Node, TypeScript', liveUrl: '', repoUrl: 'https://github.com' },
    ],
    experience: [
      { role: 'Senior Frontend Engineer', company: 'Nimbus Labs', period: '2023 — Present', location: 'Bengaluru', description: 'Lead the design-system team. Cut build time by 45% and shipped a component library used by 6 product squads.' },
      { role: 'Full-stack Developer', company: 'Cartwheel', period: '2021 — 2023', location: 'Remote', description: 'Built the merchant dashboard from scratch. Grew it to 40k monthly active users.' },
    ],
    education: [
      { degree: 'B.E. Computer Science', school: 'Gopalan College of Engineering', period: '2017 — 2021', detail: 'Graduated with distinction' },
    ],
    testimonials: [
      { quote: 'Sanjay shipped our dashboard in six weeks and it has not needed a rewrite since. Rare combination of speed and judgement.', name: 'Rohit Menon', role: 'CTO, Cartwheel', photo: '' },
    ],
    socials: [
      { label: 'GitHub', url: 'https://github.com', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { label: 'X', url: 'https://x.com', icon: 'x' },
    ],
  });

  const photo = mk({
    slug: 'meera-visuals',
    templateId: 'photo-light',
    theme: { accent: '#b45309', font: 'serif', radius: 4, dark: false, containerWidth: 1200 },
    meta: { title: 'Meera Nair — Photographer', description: 'Editorial and travel photographer based in Goa.', footerNote: 'Built with Soft_Tech PortfoGen', customCss: '', favicon: '', analytics: '' },
    profile: {
      name: 'Meera Nair',
      role: 'Photographer',
      tagline: 'Editorial & travel photographer. Available for commissions worldwide.',
      photo: '',
      about: 'I photograph people and places with natural light. My work has appeared in travel magazines and brand campaigns across India and South-East Asia.\n\nFor bookings, rates and full galleries, write to me.',
      location: 'Goa, India',
      email: 'studio@meera.example',
      phone: '+91 90000 11111',
      resumeUrl: '',
      availability: 'Booking for 2026',
      cvLabel: 'Rate card (PDF)',
    },
    stats: [
      { label: 'Years shooting', value: '9' },
      { label: 'Editorials', value: '42' },
      { label: 'Countries', value: '14' },
    ],
    skills: [
      { name: 'Editorial portraiture', level: 95 },
      { name: 'Travel & landscape', level: 90 },
      { name: 'Studio lighting', level: 80 },
    ],
    services: [
      { title: 'Editorial', description: 'Magazine features, interviews and cover shoots.', icon: '📰' },
      { title: 'Brand campaigns', description: 'Half-day and full-day shoots with a small crew.', icon: '🎞️' },
      { title: 'Retouching', description: 'Colour grading and retouching on your existing frames.', icon: '🖌️' },
    ],
    projects: [
      { title: 'Monsoon, Konkan', description: 'A six-week road trip through the Konkan coast during the rains.', image: '', tags: 'Travel, 2025', liveUrl: '', repoUrl: '' },
      { title: 'Hands at Work', description: 'Portraits of artisans in Kutch for a craft collective.', image: '', tags: 'Editorial', liveUrl: '', repoUrl: '' },
      { title: 'City Lights', description: 'Night architecture series shot entirely on available light.', image: '', tags: 'Architecture', liveUrl: '', repoUrl: '' },
    ],
    experience: [
      { role: 'Contributing Photographer', company: 'Wander India', period: '2021 — Present', location: 'Pan-India', description: 'Lead visual features, averaging two long-form stories a quarter.' },
      { role: 'Studio Assistant', company: 'Frame & Co.', period: '2017 — 2020', location: 'Mumbai', description: 'Assisted on commercial shoots and learned studio lighting from the ground up.' },
    ],
    education: [{ degree: 'Diploma in Photography', school: 'Sir J.J. Institute of Applied Art', period: '2015 — 2017', detail: '' }],
    testimonials: [{ quote: 'Meera has an unusual patience with light. The frames came back better than the brief.', name: 'Anaya Rao', role: 'Art Director', photo: '' }],
    socials: [{ label: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }, { label: 'Behance', url: 'https://behance.net', icon: 'behance' }],
  });

  const student = mk({
    slug: 'arjun-rao',
    templateId: 'student-clean',
    theme: { accent: '#0f766e', font: 'sans', radius: 10, dark: false, containerWidth: 980 },
    meta: { title: 'Arjun Rao — CSE Student', description: 'Final-year CSE student, looking for 2026 new-grad roles.', footerNote: 'Built with Soft_Tech PortfoGen', customCss: '', favicon: '', analytics: '' },
    profile: {
      name: 'Arjun Rao',
      role: 'Final-year CSE Student',
      tagline: 'Looking for a software engineer role — starting 2026.',
      photo: '',
      about: 'Final-year computer science student. I like building small useful things and writing about what I learn. Looking for a new-grad backend or full-stack role.',
      location: 'Mysuru, India',
      email: 'arjun.rao@example.com',
      phone: '+91 88888 77777',
      resumeUrl: '',
      availability: 'Available from June 2026',
      cvLabel: 'Download Resume',
    },
    stats: [
      { label: 'CGPA', value: '8.7' },
      { label: 'Projects', value: '7' },
      { label: 'Hackathons', value: '5' },
    ],
    skills: [
      { name: 'Python', level: 85 },
      { name: 'Java', level: 70 },
      { name: 'SQL', level: 78 },
      { name: 'Git & GitHub', level: 80 },
    ],
    services: [],
    projects: [
      { title: 'Campus Marketplace', description: 'Buy/sell platform for my college with 400+ users. Django + SQLite + HTMX.', image: '', tags: 'Django, HTMX', liveUrl: '', repoUrl: 'https://github.com' },
      { title: 'Attendance via QR', description: 'Professor scans a QR each lecture; students check in from their phones.', image: '', tags: 'Python, Flask', liveUrl: '', repoUrl: 'https://github.com' },
    ],
    experience: [
      { role: 'SDE Intern', company: 'BrightStack', period: 'May 2025 — Jul 2025', location: 'Bengaluru (Hybrid)', description: 'Wrote tests and fixed bugs across the payments service. Owned one small feature end to end.' },
    ],
    education: [
      { degree: 'B.E. Computer Science', school: 'Vidya Vardhaka College of Engineering', period: '2022 — 2026', detail: 'CGPA 8.7 / 10' },
      { degree: 'Class XII (PCM + CS)', school: 'Delhi Public School, Mysuru', period: '2020 — 2022', detail: '92.4%' },
    ],
    testimonials: [{ quote: 'Arjun picked up our codebase in a week and asked better questions than most full-timers.', name: 'Sneha Iyer', role: 'Engineering Manager, BrightStack', photo: '' }],
    socials: [{ label: 'GitHub', url: 'https://github.com', icon: 'github' }, { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }],
  });

  return [dev, photo, student];
}
