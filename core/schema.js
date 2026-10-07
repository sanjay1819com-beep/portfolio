/* core/schema.js — describes every field the editor shows.
   The editor is generated from this, so adding a field = adding an entry here. */

import { toList } from './utils.js';
import { DEFAULT_LABELS } from './labels.js';

/* Field types the editor knows how to render:
   text | textarea | url | email | number | color | select | switch
   photo (upload/url) | list-text (comma separated) | repeater (array of objects)
   socials (specialised repeater)  */

export const ICON_CHOICES = [
  'github', 'linkedin', 'x', 'instagram', 'dribbble', 'behance', 'youtube',
  'twitter', 'website', 'email', 'phone', 'map', 'figma', 'medium', 'whatsapp',
];

export const FONT_CHOICES = [
  { value: 'sans', label: 'Modern sans' },
  { value: 'serif', label: 'Editorial serif' },
  { value: 'mono', label: 'Technical mono' },
];

/** Friendly names for each editable heading, shown as the field label. */
const LABEL_TITLES = {
  about: 'Nav — About',
  aboutTitle: 'About heading',
  stats: 'Stats heading',
  skills: 'Nav — Skills',
  skillsTitle: 'Skills heading',
  services: 'Nav — Services',
  servicesTitle: 'Services heading',
  projects: 'Nav — Projects',
  projectsTitle: 'Projects heading',
  experience: 'Nav — Experience',
  experienceTitle: 'Experience heading',
  education: 'Nav — Education',
  educationTitle: 'Education heading',
  testimonials: 'Nav — Testimonials',
  testimonialsTitle: 'Testimonials heading',
  contact: 'Nav — Contact',
  contactTitle: 'Contact heading',
  contactCta: 'Contact button text',
};



export const SCHEMA = [
  {
    id: 'basics',
    title: 'Basics',
    icon: '👤',
    fields: [
      { key: 'profile.name', label: 'Full name', type: 'text', placeholder: 'Aisha Khan' },
      { key: 'profile.role', label: 'Role / headline', type: 'text', placeholder: 'Full-stack Developer' },
      { key: 'profile.tagline', label: 'Short tagline', type: 'textarea', rows: 2, placeholder: 'One sentence about what you do.' },
      { key: 'profile.photo', label: 'Your photo', type: 'photo', hint: 'Upload a square image, or paste an image URL.' },
      { key: 'profile.about', label: 'About you', type: 'textarea', rows: 6, hint: 'Blank line = new paragraph.' },
      { key: 'profile.availability', label: 'Availability line', type: 'text', placeholder: 'Open to freelance' },
    ],
  },
  {
    id: 'headings',
    title: 'Headings',
    icon: '🔤',
    hint: 'Rename any section. Leave a box empty to use the template default.',
    fields: Object.entries(DEFAULT_LABELS).map(([key, fallback]) => ({
      key: `labels.${key}`,
      label: LABEL_TITLES[key] || key,
      type: 'text',
      placeholder: fallback,
    })),
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '📮',
    fields: [
      { key: 'profile.email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
      { key: 'profile.phone', label: 'Phone', type: 'text', placeholder: '+91 98765 43210' },
      { key: 'profile.location', label: 'Location', type: 'text', placeholder: 'Bengaluru, India' },
      { key: 'profile.resumeUrl', label: 'Resume / CV file URL', type: 'url', placeholder: 'https://drive.google.com/...' },
      { key: 'profile.cvLabel', label: 'Button text', type: 'text', placeholder: 'Download CV' },
      {
        key: 'socials', label: 'Social links', type: 'socials',
        item: { label: '', url: '', icon: 'github' },
        titleOf: (it) => it.label || it.url || 'New link',
        fields: [
          { key: 'label', label: 'Label', type: 'text', placeholder: 'GitHub' },
          { key: 'url', label: 'URL', type: 'url', placeholder: 'https://github.com/you' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_CHOICES },
        ],
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills & stats',
    icon: '🧠',
    fields: [
      {
        key: 'skills', label: 'Skills', type: 'repeater',
        item: { name: '', level: 75 },
        titleOf: (it) => it.name || 'New skill',
        fields: [
          { key: 'name', label: 'Skill', type: 'text', placeholder: 'JavaScript' },
          { key: 'level', label: 'Level %', type: 'number', min: 0, max: 100, hint: 'Used for the progress bar.' },
        ],
      },
      {
        key: 'stats', label: 'Highlight numbers', type: 'repeater',
        item: { label: '', value: '' },
        titleOf: (it) => it.value || it.label || 'New stat',
        fields: [
          { key: 'value', label: 'Number', type: 'text', placeholder: '4+' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'Years experience' },
        ],
      },
      { key: 'sections.skills', label: 'Show skills section', type: 'switch' },
      { key: 'sections.stats', label: 'Show stats strip', type: 'switch' },
    ],
  },
  {
    id: 'work',
    title: 'Work & projects',
    icon: '💼',
    fields: [
      {
        key: 'projects', label: 'Projects', type: 'repeater',
        item: { title: '', description: '', image: '', tags: '', liveUrl: '', repoUrl: '' },
        titleOf: (it) => it.title || 'New project',
        fields: [
          { key: 'title', label: 'Project name', type: 'text' },
          { key: 'description', label: 'What it does', type: 'textarea', rows: 3 },
          { key: 'image', label: 'Cover image', type: 'photo', hint: 'Optional — a nice cover is generated if left empty.' },
          { key: 'tags', label: 'Tech / tags', type: 'text', placeholder: 'React, Node, Postgres' },
          { key: 'liveUrl', label: 'Live URL', type: 'url' },
          { key: 'repoUrl', label: 'Code URL', type: 'url' },
        ],
      },
      {
        key: 'services', label: 'What I offer', type: 'repeater',
        item: { title: '', description: '', icon: '⚡' },
        titleOf: (it) => it.title || 'New service',
        fields: [
          { key: 'icon', label: 'Emoji icon', type: 'text', placeholder: '⚡' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
        ],
      },
      {
        key: 'experience', label: 'Experience', type: 'repeater',
        item: { role: '', company: '', period: '', location: '', description: '' },
        titleOf: (it) => (it.role ? `${it.role}${it.company ? ' · ' + it.company : ''}` : 'New role'),
        fields: [
          { key: 'role', label: 'Role', type: 'text', placeholder: 'Frontend Engineer' },
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'period', label: 'Period', type: 'text', placeholder: '2023 — Present' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'description', label: 'What you did', type: 'textarea', rows: 3 },
        ],
      },
      { key: 'sections.projects', label: 'Show projects', type: 'switch' },
      { key: 'sections.services', label: 'Show services', type: 'switch' },
      { key: 'sections.experience', label: 'Show experience', type: 'switch' },
    ],
  },
  {
    id: 'education',
    title: 'Education & quotes',
    icon: '🎓',
    fields: [
      {
        key: 'education', label: 'Education', type: 'repeater',
        item: { degree: '', school: '', period: '', detail: '' },
        titleOf: (it) => it.degree || 'New entry',
        fields: [
          { key: 'degree', label: 'Degree / course', type: 'text' },
          { key: 'school', label: 'Institute', type: 'text' },
          { key: 'period', label: 'Period', type: 'text', placeholder: '2022 — 2026' },
          { key: 'detail', label: 'Grade / detail', type: 'text', placeholder: 'CGPA 8.7' },
        ],
      },
      {
        key: 'testimonials', label: 'Testimonials', type: 'repeater',
        item: { quote: '', name: '', role: '', photo: '' },
        titleOf: (it) => it.name || 'New quote',
        fields: [
          { key: 'quote', label: 'Quote', type: 'textarea', rows: 3 },
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Their role', type: 'text' },
          { key: 'photo', label: 'Their photo', type: 'photo' },
        ],
      },
      { key: 'sections.education', label: 'Show education', type: 'switch' },
      { key: 'sections.testimonials', label: 'Show testimonials', type: 'switch' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    icon: '🎨',
    fields: [
      { key: 'theme.accent', label: 'Accent colour', type: 'color' },
      { key: 'theme.font', label: 'Font style', type: 'select', options: FONT_CHOICES },
      { key: 'theme.radius', label: 'Corner roundness', type: 'number', min: 0, max: 28 },
      { key: 'theme.dark', label: 'Dark theme', type: 'switch' },
      { key: 'theme.containerWidth', label: 'Content width (px)', type: 'number', min: 720, max: 1400 },
      { key: 'theme.heroPhoto', label: 'Use my photo as the hero image', type: 'switch',
        hint: 'Off by default. When off, your photo only appears in proper photo slots — never stretched across the top of the page.' },
      { key: 'meta.customCss', label: 'Custom CSS (advanced)', type: 'textarea', rows: 5, hint: 'Injected at the end of the template styles.' },
    ],
  },
  {
    id: 'seo',
    title: 'SEO & publish',
    icon: '🚀',
    fields: [
      { key: 'meta.title', label: 'Page title', type: 'text', hint: 'Shown in the browser tab and Google results.' },
      { key: 'meta.description', label: 'Meta description', type: 'textarea', rows: 2 },
      { key: 'meta.favicon', label: 'Favicon URL', type: 'url' },
      { key: 'meta.analytics', label: 'Analytics script (optional)', type: 'textarea', rows: 3, hint: 'Pasted into <head> of the downloaded file.' },
      { key: 'meta.footerNote', label: 'Footer note', type: 'text' },
      { key: 'meta.credit', label: 'Show the "Built with" credit line', type: 'switch',
        hint: 'A discreet line at the bottom of your portfolio linking back to Soft_Tech PortfoGen.' },
    ],
  },
];

/* --------------------------- value helpers ------------------------------ */
export function getPath(obj, path) {
  return String(path).split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

export function setPath(obj, path, value) {
  const keys = String(path).split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

/** Normalise a raw input value into the type the data model expects. */
export function coerce(type, raw, field) {
  switch (type) {
    case 'number': {
      const n = Number(raw);
      if (Number.isNaN(n)) return 0;
      const min = field?.min ?? -Infinity;
      const max = field?.max ?? Infinity;
      return Math.min(max, Math.max(min, n));
    }
    case 'switch': return !!raw;
    case 'tags': return toList(raw).join(', ');
    default: return raw == null ? '' : String(raw);
  }
}
