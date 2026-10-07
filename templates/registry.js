/* templates/registry.js — every template the builder knows about.
   Add a new file in this folder, import it here, and it appears everywhere. */

import devDark from './dev-dark.js';
import photoLight from './photo-light.js';
import studentClean from './student-clean.js';
import founderBold from './founder-bold.js';
import creatorBento from './creator-bento.js';

export const TEMPLATES = [devDark, photoLight, studentClean, founderBold, creatorBento];

const BY_ID = new Map(TEMPLATES.map(t => [t.id, t]));

export function getTemplate(id) {
  return BY_ID.get(id) || TEMPLATES[0];
}

export function templateExists(id) {
  return BY_ID.has(id);
}

export const CATEGORIES = ['All', ...new Set(TEMPLATES.map(t => t.category))];

/** Portfolio data pre-filled for a template, so previews look finished instantly. */
export function demoData(tpl) {
  const th = tpl.previewTheme || {};
  return {
    templateId: tpl.id,
    theme: { accent: '#6366f1', font: 'sans', radius: 14, dark: true, containerWidth: 1100, ...th },
    meta: { title: `${tpl.name} preview`, footerNote: 'Built with Soft_Tech PortfoGen', customCss: '', favicon: '', analytics: '', description: '' },
    profile: {
      name: 'Sanjay',
      role: 'Product Designer',
      tagline: 'I design calm, useful interfaces for products people use every day.',
      photo: '',
      about: 'Designer with six years across fintech and developer tools.\n\nI like small teams, clear writing and shipping on Fridays.',
      location: 'Bengaluru, India',
      email: 'hello@example.com',
      phone: '+91 98765 43210',
      resumeUrl: '',
      availability: 'Available for work',
      cvLabel: 'Download CV',
    },
    stats: [
      { label: 'Years experience', value: '6' },
      { label: 'Products shipped', value: '24' },
      { label: 'Happy clients', value: '12' },
    ],
    skills: [
      { name: 'Product design', level: 92 },
      { name: 'Design systems', level: 86 },
      { name: 'Prototyping', level: 80 },
      { name: 'Front-end (React)', level: 68 },
    ],
    services: [
      { title: 'Product design', description: 'From first sketch to a shipped, measurable release.', icon: '🧭' },
      { title: 'Design systems', description: 'Components and tokens your engineers will thank you for.', icon: '🧩' },
      { title: 'Landing pages', description: 'High-converting pages that load in under a second.', icon: '⚡' },
    ],
    projects: [
      { title: 'Ledger', description: 'A personal finance app with 40k monthly users and a 4.8 rating.', image: '', tags: 'iOS, Design System', liveUrl: 'https://example.com', repoUrl: '' },
      { title: 'Orbit Docs', description: 'Documentation platform rebuilt around search-first navigation.', image: '', tags: 'Web, IA', liveUrl: 'https://example.com', repoUrl: 'https://github.com' },
      { title: 'Kite Studio', description: 'Brand identity and marketing site for a climate startup.', image: '', tags: 'Brand, Web', liveUrl: '', repoUrl: '' },
    ],
    experience: [
      { role: 'Senior Product Designer', company: 'Nimbus Labs', period: '2023 — Present', location: 'Bengaluru', description: 'Lead designer for the core dashboard. Shipped a design system used by six squads.' },
      { role: 'Product Designer', company: 'Cartwheel', period: '2020 — 2023', location: 'Remote', description: 'Owned onboarding and activation. Lifted trial-to-paid conversion by 18%.' },
    ],
    education: [{ degree: 'B.Des Interaction Design', school: 'NID Ahmedabad', period: '2016 — 2020', detail: 'Gold medal' }],
    testimonials: [{ quote: 'Sanjay turns vague ideas into shipped screens faster than anyone I have worked with.', name: 'Rohit Menon', role: 'CTO, Cartwheel', photo: '' }],
    socials: [
      { label: 'Dribbble', url: 'https://dribbble.com', icon: 'dribbble' },
      { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { label: 'X', url: 'https://x.com', icon: 'x' },
    ],
    sections: { about: true, stats: true, skills: true, services: true, projects: true, experience: true, education: true, testimonials: true, contact: true },
  };
}
