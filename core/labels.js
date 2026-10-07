/* core/labels.js — every section heading is user-editable.

   A template asks `L('experience')` instead of hard-coding "Studio history", so
   a student who picks the photographer template can rename it to "Internships"
   without touching code.

   Resolution order:  user's override  →  template default  →  global default
   An empty override is ignored, which gives users a "reset to default" for free. */

export const DEFAULT_LABELS = {
  about: 'About me',
  aboutTitle: 'A little bit about me',
  stats: 'At a glance',
  skills: 'Skills',
  skillsTitle: 'What I work with',
  services: 'Services',
  servicesTitle: 'How I can help',
  projects: 'Projects',
  projectsTitle: 'Selected projects',
  experience: 'Experience',
  experienceTitle: 'Where I have worked',
  education: 'Education',
  educationTitle: 'Education',
  testimonials: 'Testimonials',
  testimonialsTitle: 'Kind words',
  contact: 'Contact',
  contactTitle: "Let's build something together",
  contactCta: 'Email me',
};

/** Per-template wording, so each design keeps its own voice out of the box. */
export const TEMPLATE_LABELS = {
  'dev-dark': {
    projects: 'Work',
    contactCta: "Let's talk",
    skillsTitle: 'What I work with',
    projectsTitle: 'Selected projects',
    experienceTitle: "Where I've worked",
    contactTitle: "Let's build something together",
  },
  'photo-light': {
    about: 'About',
    aboutTitle: 'About',
    projects: 'Work',
    experience: 'Studio',
    contact: 'Contact',
    skills: 'Disciplines',
    skillsTitle: 'Disciplines',
    services: 'Commissions',
    servicesTitle: 'Commissions',
    projectsTitle: 'Selected work',
    experienceTitle: 'Studio history',
    education: 'Training',
    educationTitle: 'Training',
    contactTitle: "Let's make something",
    contactCta: 'Book a shoot',
  },
  'student-clean': {
    stats: 'At a glance',
    skillsTitle: 'Skills',
    servicesTitle: 'What I can do',
    projectsTitle: 'Projects',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    testimonials: 'References',
    testimonialsTitle: 'References',
    contactCta: 'Get in touch',
  },
  'founder-bold': {
    contactCta: 'Hire me',
    servicesTitle: 'What I do',
    projectsTitle: 'Selected work',
    projects: 'Case studies',
    experience: 'Journey',
    experienceTitle: 'Journey',
    educationTitle: 'Background',
    testimonialsTitle: 'What clients say',
    contactTitle: "Let's work together",
  },
  'creator-bento': {
    contactTitle: "Let's make something",
    contactCta: 'Say hi',
    projectsTitle: 'Work',
    experienceTitle: 'Experience',
  },
};

/**
 * @param {object} pf            the portfolio
 * @param {string} [templateId]  defaults to pf.templateId
 * @returns {(key: string) => string}
 */
export function sectionLabels(pf, templateId) {
  const id = templateId || pf?.templateId;
  const user = pf?.labels || {};
  const base = { ...DEFAULT_LABELS, ...(TEMPLATE_LABELS[id] || {}) };
  return (key) => {
    const override = user[key];
    if (override !== undefined && override !== null && String(override).trim() !== '') {
      return String(override);
    }
    return base[key] ?? DEFAULT_LABELS[key] ?? key;
  };
}
