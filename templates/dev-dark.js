/* templates/dev-dark.js — "Nightbuild": dark, technical, grid-driven.
   Aimed at developers, engineers and product designers. */

import { esc, attr, toList, paragraphs, img, photoSrc, initialsOf } from '../core/utils.js';
import { icon, socialRow } from './icons.js';
import { sectionLabels } from '../core/labels.js';

const FONTS = {
  sans:  "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Playfair Display', Georgia, serif",
  mono:  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

export function css(pf = {}) {
  const t = pf.theme || {};
  const p = pf.profile || {};
  const accent = t.accent || '#6366f1';
  const dark = t.dark !== false;
  const radius = (t.radius ?? 14) + 'px';
  const width = t.containerWidth || 1100;
  const font = FONTS[t.font] || FONTS.sans;
  const mono = FONTS.mono;

  const bg      = dark ? '#08090d' : '#fbfbfd';
  const surface = dark ? '#10131b' : '#ffffff';
  const surface2= dark ? '#151924' : '#f3f4f8';
  const text    = dark ? '#eef1f7' : '#111318';
  const dim     = dark ? '#98a2b6' : '#5b6474';
  const line    = dark ? '#1e2431' : '#e5e7ee';

  return `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};color:${text};font-family:${font};font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3,h4{margin:0;line-height:1.12;letter-spacing:-.02em}
p{margin:0}
.container{max-width:${width}px;margin:0 auto;padding:0 24px}
.eyebrow{font-family:${mono};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${accent};display:inline-flex;align-items:center;gap:8px}
.eyebrow::before{content:"";width:22px;height:1px;background:${accent};opacity:.7}
.section{padding:88px 0;position:relative}
.section-head{margin-bottom:44px;max-width:640px}
.section-head h2{font-size:clamp(26px,3.4vw,40px);font-weight:700;margin-top:14px}
.section-head p{color:${dim};margin-top:12px;font-size:16.5px}
.icon{display:inline-flex;width:1em;height:1em}
.icon svg{width:100%;height:100%}

/* ---------- nav ---------- */
.nav{position:sticky;top:0;z-index:50;background:${dark?'rgba(8,9,13,.78)':'rgba(251,251,253,.78)'};backdrop-filter:blur(16px);border-bottom:1px solid ${line}}
.nav-in{display:flex;align-items:center;gap:24px;height:64px}
.logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;letter-spacing:-.01em}
.logo-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,${accent},${accent}99);display:grid;place-items:center;color:#fff;font-size:13px;font-weight:800;box-shadow:0 6px 18px -8px ${accent}}
.nav-links{display:flex;gap:4px;margin-left:auto;flex-wrap:wrap}
.nav-links a{padding:8px 12px;border-radius:9px;font-size:14px;color:${dim};transition:color .18s,background .18s}
.nav-links a:hover{color:${text};background:${surface2}}
.nav-cta{display:inline-flex;align-items:center;gap:8px;background:${accent};color:#fff;padding:9px 16px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 10px 24px -14px ${accent}}
.nav-cta:hover{filter:brightness(1.08)}

/* ---------- hero ---------- */
.hero{padding:96px 0 78px;position:relative;overflow:hidden}
.hero::before{content:"";position:absolute;inset:-30% -20% auto;height:620px;background:radial-gradient(46% 46% at 18% 22%,${accent}30,transparent 70%),radial-gradient(40% 40% at 82% 8%,${accent}1f,transparent 70%);pointer-events:none}
.hero-grid{position:relative;display:grid;grid-template-columns:1.35fr .95fr;gap:56px;align-items:center}
.hero h1{font-size:clamp(38px,6.4vw,72px);font-weight:800;letter-spacing:-.035em;margin:18px 0 0}
.hero h1 .hl{color:${accent}}
.hero .lead{margin-top:20px;font-size:18.5px;color:${dim};max-width:54ch}
.hero-actions{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:9px;padding:12px 20px;border-radius:11px;font-weight:600;font-size:15px;border:1px solid ${line};background:${surface};transition:transform .16s,border-color .16s,background .16s}
.btn:hover{transform:translateY(-2px);border-color:${accent}}
.btn-solid{background:${accent};border-color:${accent};color:#fff;box-shadow:0 14px 30px -16px ${accent}}
.hero-card{position:relative;transform-style:preserve-3d;border:1px solid ${line};background:linear-gradient(180deg,${surface},${surface2});border-radius:20px;padding:26px;box-shadow:0 40px 80px -40px rgba(0,0,0,.6)}
.hero-photo{width:96px;height:96px;border-radius:16px;object-fit:cover;border:1px solid ${line}}
.hero-card h3{font-size:19px;margin-top:16px}
.hero-card .role{color:${accent};font-family:${mono};font-size:13px;margin-top:5px}
.hero-meta{margin-top:18px;display:flex;flex-direction:column;gap:10px;font-size:14px;color:${dim}}
.hero-meta div{display:flex;align-items:center;gap:10px}
.hero-meta .icon{width:16px;height:16px;color:${accent}}
.status{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:${text};background:${surface2};border:1px solid ${line};padding:6px 12px;border-radius:999px}
.status i{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.18)}
.soc{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:${dim};border:1px solid ${line};padding:7px 11px;border-radius:9px;transition:color .16s,border-color .16s}
.soc:hover{color:${text};border-color:${accent}}
.soc .icon{width:15px;height:15px}
.soc span{display:none}
.hero-socials{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}

/* ---------- stats ---------- */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:${line};border:1px solid ${line};border-radius:${radius};overflow:hidden}
.stat{background:${bg};padding:24px}
.stat b{display:block;font-size:30px;letter-spacing:-.03em;color:${accent}}
.stat span{font-size:13.5px;color:${dim}}

/* ---------- about ---------- */
.about-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:56px;align-items:start}
.about-body p{color:${dim};margin-bottom:16px;font-size:16.5px}
.about-body p:last-child{margin-bottom:0}

/* ---------- skills ---------- */
.skills{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px 30px}
.skill-name{display:flex;justify-content:space-between;font-size:14.5px;margin-bottom:8px}
.skill-name i{font-family:${mono};font-style:normal;color:${dim};font-size:12.5px}
.bar{height:6px;border-radius:99px;background:${surface2};overflow:hidden}
.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,${accent},${accent}bb);animation:grow .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes grow{from{width:0}}

/* ---------- services ---------- */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.card{border:1px solid ${line};background:${surface};border-radius:${radius};padding:24px;transition:transform .2s,border-color .2s,box-shadow .2s;position:relative;overflow:hidden}
.card:hover{transform:translateY(-4px);border-color:${accent};box-shadow:0 24px 50px -30px ${accent}}
.card .emoji{font-size:24px}
.card h3{font-size:17px;margin-top:14px}
.card p{color:${dim};font-size:14.5px;margin-top:8px}

/* ---------- projects ---------- */
.projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.project{border:1px solid ${line};border-radius:${radius};overflow:hidden;background:${surface};display:flex;flex-direction:column;transition:transform .22s,border-color .22s,box-shadow .22s}
.project:hover{transform:translateY(-5px);border-color:${accent};box-shadow:0 30px 60px -34px ${accent}}
.project .cover{aspect-ratio:16/10;overflow:hidden;position:relative;background:${surface2}}
.project .cover img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.project:hover .cover img{transform:scale(1.06)}
.project-body{padding:20px;display:flex;flex-direction:column;flex:1}
.project-body h3{font-size:17.5px}
.project-body p{color:${dim};font-size:14.5px;margin-top:8px;flex:1}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}
.tag{font-family:${mono};font-size:11.5px;color:${dim};border:1px solid ${line};padding:3px 8px;border-radius:6px;background:${surface2}}
.project-links{display:flex;gap:10px;margin-top:16px;font-size:14px;font-weight:600}
.project-links a{display:inline-flex;align-items:center;gap:6px;color:${accent}}
.project-links a:hover{text-decoration:underline}

/* ---------- timeline ---------- */
.timeline{position:relative;padding-left:26px}
.timeline::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:1px;background:${line}}
.tl-item{position:relative;padding-bottom:30px}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:"";position:absolute;left:-26px;top:7px;width:11px;height:11px;border-radius:50%;background:${bg};border:2px solid ${accent}}
.tl-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.tl-head h3{font-size:17px}
.tl-head .org{color:${accent};font-size:15px;margin-top:3px}
.tl-period{font-family:${mono};font-size:12.5px;color:${dim};white-space:nowrap}
.tl-item p{color:${dim};font-size:15px;margin-top:9px}
.tl-loc{font-size:13px;color:${dim};margin-top:4px}

/* ---------- testimonials ---------- */
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.quote{border:1px solid ${line};background:${surface};border-radius:${radius};padding:26px;position:relative}
.quote .mark{color:${accent};opacity:.28;width:30px;height:30px}
.quote .mark svg{width:100%;height:100%}
.quote p{margin-top:14px;font-size:16px}
.quote .who{display:flex;align-items:center;gap:12px;margin-top:20px}
.quote .who img{width:40px;height:40px;border-radius:50%;object-fit:cover}
.quote .who b{display:block;font-size:14.5px}
.quote .who span{font-size:13px;color:${dim}}

/* ---------- contact ---------- */
.contact{border:1px solid ${line};border-radius:20px;padding:52px 40px;text-align:center;background:linear-gradient(180deg,${surface},${surface2});position:relative;overflow:hidden}
.contact::before{content:"";position:absolute;inset:auto -10% -60%;height:280px;background:radial-gradient(50% 50% at 50% 100%,${accent}38,transparent 70%)}
.contact h2{position:relative;font-size:clamp(26px,4vw,42px);font-weight:800}
.contact p{position:relative;color:${dim};margin-top:14px}
.contact-actions{position:relative;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px}
.contact-lines{position:relative;display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-top:28px;font-size:14.5px;color:${dim}}
.contact-lines a:hover{color:${accent}}
.contact-lines .icon{width:15px;height:15px;vertical-align:-3px;margin-right:6px;color:${accent}}

footer{border-top:1px solid ${line};padding:28px 0;color:${dim};font-size:13.5px}
.foot-in{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}

@media(max-width:900px){
  .hero-grid,.about-grid{grid-template-columns:1fr;gap:34px}
  .hero{padding:64px 0 52px}
  .section{padding:62px 0}
  .nav-links{display:none}
  .contact{padding:40px 22px}
}
${pf.meta?.customCss || ''}
`;
}

export function render(pf) {
  const L = sectionLabels(pf);
  const p = pf.profile || {};
  const s = pf.sections || {};
  const name = p.name || 'Your Name';
  const navItems = [
    ['about', L('about'), s.about !== false],
    ['skills', L('skills'), s.skills !== false && !!pf.skills?.length],
    ['projects', L('projects'), s.projects !== false && !!pf.projects?.length],
    ['experience', L('experience'), s.experience !== false && !!pf.experience?.length],
    ['contact', L('contact'), s.contact !== false],
  ].filter(([, , show]) => show);

  const nav = navItems.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('');

  return `
<a href="#main" class="skip" style="position:absolute;left:-9999px">Skip to content</a>
<header class="nav">
  <div class="container nav-in">
    <a class="logo" href="#top"><span class="logo-mark">${esc(initialsOf(name))}</span>${esc(name)}</a>
    <nav class="nav-links">${nav}</nav>
    ${p.email ? `<a class="nav-cta" href="mailto:${attr(p.email)}">${esc(L('contactCta'))}</a>` : ''}
  </div>
</header>

<main id="main">
<section class="hero" id="top">
  <div class="container hero-grid">
    <div>
      <span class="eyebrow">${esc(p.role || 'Portfolio')}</span>
      <h1>${esc(name.split(' ')[0])} <span class="hl">${esc(name.split(' ').slice(1).join(' '))}</span></h1>
      <p class="lead">${esc(p.tagline || '')}</p>
      <div class="hero-actions">
        ${p.projects && pf.projects?.length ? '<a class="btn btn-solid" href="#projects">View my work</a>' : '<a class="btn btn-solid" href="#about">About me</a>'}
        ${p.resumeUrl ? `<a class="btn" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.cvLabel || 'Download CV')}</a>` : ''}
      </div>
      ${socialRow(pf.socials || [], 'hero-socials')}
    </div>
    <div class="hero-card" data-tilt data-tilt-max="8" data-spotlight>
      ${p.availability ? `<span class="status"><i></i>${esc(p.availability)}</span>` : ''}
      ${pf.theme?.heroPhoto ? `<img class="hero-photo" src="${attr(photoSrc(p.photo, name))}" alt="${attr(name)}">` : ''}
      <h3>${esc(name)}</h3>
      <div class="role">${esc(p.role || '')}</div>
      <div class="hero-meta">
        ${p.location ? `<div>${icon('map')}<span>${esc(p.location)}</span></div>` : ''}
        ${p.email ? `<div>${icon('email')}<a href="mailto:${attr(p.email)}">${esc(p.email)}</a></div>` : ''}
        ${p.phone ? `<div>${icon('phone')}<a href="tel:${attr(p.phone)}">${esc(p.phone)}</a></div>` : ''}
      </div>
    </div>
  </div>
</section>

${s.stats !== false && pf.stats?.length ? `
<section class="section" style="padding-top:0">
  <div class="container">
    <div class="stats">
      ${pf.stats.map(st => `<div class="stat" data-reveal><b data-count>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.about !== false ? `
<section class="section" id="about">
  <div class="container about-grid">
    <div class="section-head">
      <span class="eyebrow">${esc(L('about'))}</span>
      <h2>${esc(L('aboutTitle'))}</h2>
    </div>
    <div class="about-body">${paragraphs(p.about || 'Add a few lines about yourself in the editor.')}</div>
  </div>
</section>` : ''}

${s.skills !== false && pf.skills?.length ? `
<section class="section" id="skills" style="padding-top:0">
  <div class="container">
    <div class="section-head"><span class="eyebrow">${esc(L('skills'))}</span><h2>${esc(L('skillsTitle'))}</h2></div>
    <div class="skills">
      ${pf.skills.map(sk => `
        <div>
          <div class="skill-name"><span>${esc(sk.name)}</span><i>${esc(sk.level || 0)}%</i></div>
          <div class="bar"><i style="width:${Math.min(100, Math.max(0, Number(sk.level) || 0))}%"></i></div>
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.services !== false && pf.services?.length ? `
<section class="section" style="padding-top:0">
  <div class="container">
    <div class="section-head"><span class="eyebrow">${esc(L('services'))}</span><h2>${esc(L('servicesTitle'))}</h2></div>
    <div class="cards">
      ${pf.services.map(sv => `<div class="card"><div class="emoji">${esc(sv.icon || '✦')}</div><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.projects !== false && pf.projects?.length ? `
<section class="section" id="projects">
  <div class="container">
    <div class="section-head"><span class="eyebrow">${esc(L('projects'))}</span><h2>${esc(L('projectsTitle'))}</h2></div>
    <div class="projects">
      ${pf.projects.map((pr, i) => `
        <article class="project" data-tilt data-tilt-max="5" data-spotlight>
          <div class="cover">${img(pr.image, pr.title || i, pr.title)}</div>
          <div class="project-body">
            <h3>${esc(pr.title)}</h3>
            <p>${esc(pr.description)}</p>
            ${pr.tags ? `<div class="tags">${toList(pr.tags).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
            ${(pr.liveUrl || pr.repoUrl) ? `<div class="project-links">
              ${pr.liveUrl ? `<a href="${attr(pr.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon('arrow')} Live</a>` : ''}
              ${pr.repoUrl ? `<a href="${attr(pr.repoUrl)}" target="_blank" rel="noopener noreferrer">${icon('code')} Code</a>` : ''}
            </div>` : ''}
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.experience !== false && pf.experience?.length ? `
<section class="section" id="experience">
  <div class="container about-grid">
    <div class="section-head"><span class="eyebrow">${esc(L('experience'))}</span><h2>${esc(L('experienceTitle'))}</h2></div>
    <div class="timeline">
      ${pf.experience.map(ex => `
        <div class="tl-item">
          <div class="tl-head">
            <div><h3>${esc(ex.role)}</h3><div class="org">${esc(ex.company)}</div></div>
            <span class="tl-period">${esc(ex.period)}</span>
          </div>
          ${ex.location ? `<div class="tl-loc">${esc(ex.location)}</div>` : ''}
          ${ex.description ? `<p>${esc(ex.description)}</p>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.education !== false && pf.education?.length ? `
<section class="section" style="padding-top:0">
  <div class="container about-grid">
    <div class="section-head"><span class="eyebrow">${esc(L('education'))}</span><h2>${esc(L('educationTitle'))}</h2></div>
    <div class="timeline">
      ${pf.education.map(ed => `
        <div class="tl-item">
          <div class="tl-head">
            <div><h3>${esc(ed.degree)}</h3><div class="org">${esc(ed.school)}</div></div>
            <span class="tl-period">${esc(ed.period)}</span>
          </div>
          ${ed.detail ? `<p>${esc(ed.detail)}</p>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.testimonials !== false && pf.testimonials?.length ? `
<section class="section" style="padding-top:0">
  <div class="container">
    <div class="section-head"><span class="eyebrow">${esc(L('testimonials'))}</span><h2>${esc(L('testimonialsTitle'))}</h2></div>
    <div class="quotes">
      ${pf.testimonials.map(t => `
        <figure class="quote">
          <span class="mark">${icon('quote')}</span>
          <p>${esc(t.quote)}</p>
          <figcaption class="who">
            <img src="${attr(photoSrc(t.photo, t.name))}" alt="${attr(t.name)}">
            <div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>
          </figcaption>
        </figure>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.contact !== false ? `
<section class="section" id="contact">
  <div class="container">
    <div class="contact">
      <h2>${esc(L('contactTitle'))}</h2>
      <p>${esc(p.tagline || 'Have a project in mind? I would love to hear about it.')}</p>
      <div class="contact-actions">
        ${p.email ? `<a class="btn btn-solid" href="mailto:${attr(p.email)}">${icon('mail')} ${esc(L('contactCta'))}</a>` : ''}
        ${p.resumeUrl ? `<a class="btn" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${icon('download')} ${esc(p.cvLabel || 'Download CV')}</a>` : ''}
      </div>
      <div class="contact-lines">
        ${p.email ? `<a href="mailto:${attr(p.email)}">${icon('email')}${esc(p.email)}</a>` : ''}
        ${p.phone ? `<a href="tel:${attr(p.phone)}">${icon('phone')}${esc(p.phone)}</a>` : ''}
        ${p.location ? `<span>${icon('map')}${esc(p.location)}</span>` : ''}
      </div>
    </div>
  </div>
</section>` : ''}
</main>

<footer>
  <div class="container foot-in">
    <span>© ${new Date().getFullYear()} ${esc(name)}</span>
    <span>${esc(pf.meta?.footerNote || '')}</span>
  </div>
</footer>`;
}

export default {
  id: 'dev-dark',
  name: 'Nightbuild',
  category: 'Developers & Designers',
  blurb: 'Dark, technical and grid-driven. Built for engineers who ship.',
  tags: ['Dark', 'Projects', 'Timeline'],
  previewTheme: { accent: '#6366f1', dark: true, font: 'sans', radius: 14, containerWidth: 1100 },
  css,
  render,
};
