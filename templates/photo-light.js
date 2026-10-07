/* templates/photo-light.js — "Aperture": light, editorial, image-first.
   Aimed at photographers, artists, models, writers and other visual people. */

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
  const accent = t.accent || '#b45309';
  const dark = t.dark === true;
  const radius = (t.radius ?? 4) + 'px';
  const width = t.containerWidth || 1200;
  const font = FONTS[t.font] || FONTS.serif;
  const mono = FONTS.mono;

  const bg = dark ? '#0d0c0b' : '#fdfcfa';
  const ink = dark ? '#f3efe9' : '#161513';
  const dim = dark ? '#a49d93' : '#6d675e';
  const line = dark ? '#26221d' : '#e8e3da';
  const surface = dark ? '#151310' : '#ffffff';

  return `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};color:${ink};font-family:${font};font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3{margin:0;font-weight:600;letter-spacing:-.015em;line-height:1.1}
p{margin:0}
.wrap{max-width:${width}px;margin:0 auto;padding:0 28px}
.label{font-family:${mono};font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:${dim}}
.icon{display:inline-flex;width:1em;height:1em}
.icon svg{width:100%;height:100%}
.rule{height:1px;background:${line};border:0;margin:0}

/* ---------- header ---------- */
.site-head{position:sticky;top:0;z-index:40;background:${dark?'rgba(13,12,11,.85)':'rgba(253,252,250,.85)'};backdrop-filter:blur(14px);border-bottom:1px solid ${line}}
.head-in{display:flex;align-items:center;gap:20px;height:74px}
.wordmark{font-size:20px;letter-spacing:.02em;font-weight:600}
.head-nav{margin-left:auto;display:flex;gap:26px}
.head-nav a{font-family:${mono};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${dim};position:relative;padding:4px 0}
.head-nav a::after{content:"";position:absolute;left:0;right:100%;bottom:0;height:1px;background:${accent};transition:right .3s ease}
.head-nav a:hover{color:${ink}}
.head-nav a:hover::after{right:0}
.head-book{font-family:${mono};font-size:12px;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid ${ink};padding-bottom:2px}
.head-book:hover{color:${accent};border-color:${accent}}

/* ---------- hero ---------- */
.hero{padding:90px 0 0}
.hero-top{display:grid;grid-template-columns:1.2fr .8fr;gap:60px;align-items:end}
.hero h1{font-size:clamp(44px,8.4vw,104px);line-height:.94;letter-spacing:-.04em}
.hero h1 .thin{font-weight:400;font-style:italic;color:${accent}}
.hero-side{padding-bottom:14px}
.hero-side p{color:${dim};font-size:17px;margin-top:14px}
.hero-actions{display:flex;gap:22px;margin-top:26px;flex-wrap:wrap;align-items:center}
.link-u{font-family:${mono};font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid ${line};padding-bottom:3px;transition:border-color .2s,color .2s}
.link-u:hover{border-color:${accent};color:${accent}}
.soc{display:inline-flex;align-items:center;gap:7px;font-family:${mono};font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:${dim}}
.soc:hover{color:${accent}}
.soc .icon{width:14px;height:14px}
.soc span{display:none}
.hero-socials{display:flex;gap:18px;margin-top:26px}
.hero-fig{margin:60px 0 0}
.hero-fig img{width:100%;height:min(76vh,720px);object-fit:cover;border-radius:${radius}}
.hero-cap{display:flex;justify-content:space-between;gap:16px;margin-top:14px}

/* ---------- marquee strip ---------- */
.strip{border-top:1px solid ${line};border-bottom:1px solid ${line};padding:22px 0;margin-top:70px;overflow:hidden}
.strip-in{display:flex;gap:44px;white-space:nowrap;font-family:${mono};font-size:12.5px;letter-spacing:.18em;text-transform:uppercase;color:${dim}}

/* ---------- sections ---------- */
.section{padding:100px 0}
.sec-head{display:flex;justify-content:space-between;align-items:baseline;gap:24px;margin-bottom:48px}
.sec-head h2{font-size:clamp(28px,4.4vw,52px);letter-spacing:-.03em}
.sec-num{font-family:${mono};font-size:12px;color:${accent}}

/* ---------- work grid ---------- */
.work{display:grid;grid-template-columns:repeat(6,1fr);gap:28px 24px}
.work-item{position:relative}
.work-item:nth-child(3n+1){grid-column:span 4}
.work-item:nth-child(3n+2){grid-column:span 2}
.work-item:nth-child(3n+3){grid-column:span 3}
.work-item .frame{overflow:hidden;border-radius:${radius};background:${surface}}
.work-item img{width:100%;height:100%;object-fit:cover;aspect-ratio:4/3;transition:transform .8s cubic-bezier(.2,.7,.2,1),filter .5s}
.work-item:hover img{transform:scale(1.045)}
.work-meta{display:flex;justify-content:space-between;gap:16px;margin-top:14px;align-items:baseline}
.work-meta h3{font-size:19px}
.work-meta p{color:${dim};font-size:14.5px;margin-top:5px;max-width:44ch}
.work-tags{font-family:${mono};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${dim};white-space:nowrap}
@media(max-width:860px){
  .work{grid-template-columns:1fr}
  .work-item,.work-item:nth-child(3n+1),.work-item:nth-child(3n+2),.work-item:nth-child(3n+3){grid-column:span 1}
}

/* ---------- about ---------- */
.about{display:grid;grid-template-columns:.85fr 1.15fr;gap:70px;align-items:start}
.about img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:${radius}}
.about-body{font-size:19px;line-height:1.75}
.about-body p{margin-bottom:22px}
.about-body p:first-child{font-size:23px;line-height:1.6}
.about-body p:last-child{margin-bottom:0}
.facts{margin-top:40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:26px;border-top:1px solid ${line};padding-top:26px}
.facts b{display:block;font-size:30px;letter-spacing:-.02em}
.facts span{font-family:${mono};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${dim}}

/* ---------- skills as list ---------- */
.skill-list{border-top:1px solid ${line}}
.skill-row{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:18px 0;border-bottom:1px solid ${line}}
.skill-row b{font-weight:500;font-size:18px}
.dots{display:flex;gap:5px}
.dots i{width:8px;height:8px;border-radius:50%;border:1px solid ${dim}}
.dots i.on{background:${accent};border-color:${accent}}

/* ---------- services ---------- */
.svc{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:${line};border:1px solid ${line};border-radius:${radius};overflow:hidden}
.svc-item{background:${bg};padding:34px 30px;transition:background .25s}
.svc-item:hover{background:${surface}}
.svc-item .em{font-size:22px}
.svc-item h3{font-size:20px;margin-top:16px}
.svc-item p{color:${dim};margin-top:10px;font-size:15px}

/* ---------- timeline ---------- */
.tl{border-top:1px solid ${line}}
.tl-row{display:grid;grid-template-columns:170px 1fr auto;gap:26px;padding:26px 0;border-bottom:1px solid ${line};align-items:baseline}
.tl-row .when{font-family:${mono};font-size:12.5px;color:${dim};letter-spacing:.06em}
.tl-row h3{font-size:20px}
.tl-row .org{color:${accent};font-size:16px;margin-top:4px}
.tl-row p{color:${dim};margin-top:9px;font-size:15px;max-width:60ch}
.tl-row .where{font-family:${mono};font-size:11.5px;color:${dim};letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
@media(max-width:820px){.tl-row{grid-template-columns:1fr;gap:8px}.tl-row .where{white-space:normal}}

/* ---------- quotes ---------- */
.big-quote{max-width:820px;margin:0 auto;text-align:center}
.big-quote blockquote{font-size:clamp(23px,3.2vw,36px);line-height:1.42;letter-spacing:-.02em;margin:0}
.big-quote .who{margin-top:30px;display:flex;align-items:center;gap:14px;justify-content:center}
.big-quote .who img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.big-quote .who b{font-weight:500}
.big-quote .who span{color:${dim};font-size:14px}

/* ---------- contact ---------- */
.contact{padding:110px 0;text-align:center;border-top:1px solid ${line}}
.contact h2{font-size:clamp(34px,6vw,72px);letter-spacing:-.04em}
.contact .mail{display:inline-block;margin-top:32px;font-size:clamp(20px,3vw,32px);border-bottom:1px solid ${line};padding-bottom:6px;transition:border-color .25s,color .25s}
.contact .mail:hover{color:${accent};border-color:${accent}}
.contact .lines{margin-top:34px;display:flex;gap:26px;justify-content:center;flex-wrap:wrap;color:${dim};font-size:14.5px}
.contact .lines .icon{width:15px;height:15px;vertical-align:-3px;margin-right:7px}
footer{padding:30px 0 46px;border-top:1px solid ${line}}
.foot-in{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:${mono};font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:${dim}}
@media(max-width:900px){
  .hero-top,.about{grid-template-columns:1fr;gap:36px}
  .hero{padding:56px 0 0}
  .section{padding:70px 0}
  .head-nav{display:none}
  .contact{padding:76px 0}
}
${pf.meta?.customCss || ''}
`;
}

function dots(level) {
  const n = Math.round((Number(level) || 0) / 20);
  return `<span class="dots">${[1,2,3,4,5].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
}

export function render(pf) {
  const p = pf.profile || {};
  const s = pf.sections || {};
  const name = p.name || 'Your Name';
  const L = sectionLabels(pf);
  // The profile photo only becomes the big hero image if the user opted in.
  const heroSrc = pf.projects?.[0]?.image || ((pf.theme || {}).heroPhoto ? p.photo : '') || '';
  const navItems = [
    ['work', L('projects'), s.projects !== false && !!pf.projects?.length],
    ['about', L('about'), s.about !== false],
    ['experience', L('experience'), s.experience !== false && !!pf.experience?.length],
    ['contact', L('contact'), s.contact !== false],
  ].filter(([, , show]) => show);

  return `
<header class="site-head">
  <div class="wrap head-in">
    <a class="wordmark" href="#top">${esc(name)}</a>
    <nav class="head-nav">${navItems.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
    ${p.email ? `<a class="head-book" href="mailto:${attr(p.email)}">${esc(L('contactCta'))}</a>` : ''}
  </div>
</header>

<main id="top">
<section class="hero">
  <div class="wrap">
    <div class="hero-top">
      <h1>${esc(p.role || 'Photographer')}<br><span class="thin">${esc((p.name || '').split(' ').slice(-1)[0] || '')}</span></h1>
      <div class="hero-side">
        <span class="label">${esc(p.location || p.availability || '')}</span>
        <p>${esc(p.tagline || '')}</p>
        <div class="hero-actions">
          ${pf.projects?.length ? '<a class="link-u" href="#work">Selected work</a>' : ''}
          ${p.resumeUrl ? `<a class="link-u" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.cvLabel || 'Rate card')}</a>` : ''}
        </div>
        ${socialRow(pf.socials || [], 'hero-socials')}
      </div>
    </div>
    ${heroSrc ? `
    <figure class="hero-fig" data-parallax="0.06">
      ${img(heroSrc, 'hero', pf.projects?.[0]?.title || name)}
      <figcaption class="hero-cap">
        <span class="label">${esc(pf.projects?.[0]?.title || p.availability || '')}</span>
        <span class="label">© ${new Date().getFullYear()} ${esc(name)}</span>
      </figcaption>
    </figure>` : ''}
  </div>
</section>

${pf.stats?.length && s.stats !== false ? `
<div class="strip">
  <div class="wrap"><div class="strip-in">
    ${pf.stats.map(st => `<span><b data-count>${esc(st.value)}</b> — ${esc(st.label)}</span>`).join('')}
    ${toList((pf.projects || []).map(pr => pr.title).join(',')).slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}
  </div></div>
</div>` : ''}

${s.projects !== false && pf.projects?.length ? `
<section class="section" id="work">
  <div class="wrap">
    <div class="sec-head">
      <h2>${esc(L('projectsTitle'))}</h2>
      <span class="sec-num">${esc(L('projects'))} · ${String(pf.projects.length).padStart(2, '0')}</span>
    </div>
    <div class="work">
      ${pf.projects.map((pr, i) => `
        <article class="work-item">
          <div class="frame" data-kenburns>${pr.liveUrl ? `<a href="${attr(pr.liveUrl)}" target="_blank" rel="noopener noreferrer">${img(pr.image, pr.title || i, pr.title)}</a>` : img(pr.image, pr.title || i, pr.title)}</div>
          <div class="work-meta">
            <div><h3>${esc(pr.title)}</h3>${pr.description ? `<p>${esc(pr.description)}</p>` : ''}</div>
            <span class="work-tags">${esc(toList(pr.tags)[0] || '')}</span>
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.about !== false ? `
<section class="section" id="about">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('aboutTitle'))}</h2><span class="sec-num">${esc(L('about'))}</span></div>
    <div class="about">
    <div>
      <img src="${attr(photoSrc(p.photo, name))}" alt="${attr(name)}">
    </div>
    <div class="about-body">
      ${paragraphs(p.about || 'Tell your story here.')}
      ${pf.stats?.length ? `<div class="facts">${pf.stats.map(st => `<div data-reveal><b data-count>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join('')}</div>` : ''}
    </div>
    </div>
  </div>
</section>` : ''}

${s.skills !== false && pf.skills?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('skillsTitle'))}</h2><span class="sec-num">${esc(L('skills'))}</span></div>
    <div class="skill-list">
      ${pf.skills.map(sk => `<div class="skill-row"><b>${esc(sk.name)}</b>${dots(sk.level)}</div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.services !== false && pf.services?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('servicesTitle'))}</h2><span class="sec-num">${esc(L('services'))}</span></div>
    <div class="svc">
      ${pf.services.map(sv => `<div class="svc-item"><div class="em">${esc(sv.icon || '✦')}</div><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.experience !== false && pf.experience?.length ? `
<section class="section" id="experience">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('experienceTitle'))}</h2><span class="sec-num">${esc(L('experience'))}</span></div>
    <div class="tl">
      ${pf.experience.map(ex => `
        <div class="tl-row">
          <span class="when">${esc(ex.period)}</span>
          <div><h3>${esc(ex.role)}</h3><div class="org">${esc(ex.company)}</div>${ex.description ? `<p>${esc(ex.description)}</p>` : ''}</div>
          <span class="where">${esc(ex.location || '')}</span>
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.education !== false && pf.education?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('educationTitle'))}</h2><span class="sec-num">${esc(L('education'))}</span></div>
    <div class="tl">
      ${pf.education.map(ed => `
        <div class="tl-row">
          <span class="when">${esc(ed.period)}</span>
          <div><h3>${esc(ed.degree)}</h3><div class="org">${esc(ed.school)}</div>${ed.detail ? `<p>${esc(ed.detail)}</p>` : ''}</div>
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.testimonials !== false && pf.testimonials?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(L('testimonialsTitle'))}</h2><span class="sec-num">${esc(L('testimonials'))}</span></div>
  </div>
  <div class="wrap big-quote">
    ${icon('quote')}
    <blockquote>“${esc(pf.testimonials[0].quote)}”</blockquote>
    <div class="who">
      <img src="${attr(photoSrc(pf.testimonials[0].photo, pf.testimonials[0].name))}" alt="">
      <div><b>${esc(pf.testimonials[0].name)}</b><br><span>${esc(pf.testimonials[0].role)}</span></div>
    </div>
  </div>
</section>` : ''}

${s.contact !== false ? `
<section class="contact" id="contact">
  <div class="wrap">
    <span class="label">${esc(p.availability || 'Available for commissions')}</span>
    <h2>${esc(L('contactTitle'))}</h2>
    ${p.email ? `<a class="mail" href="mailto:${attr(p.email)}">${esc(p.email)}</a>` : ''}
    <div class="lines">
      ${p.phone ? `<span>${icon('phone')}${esc(p.phone)}</span>` : ''}
      ${p.location ? `<span>${icon('map')}${esc(p.location)}</span>` : ''}
      ${socialRow(pf.socials || [], '')}
    </div>
  </div>
</section>` : ''}
</main>

<footer>
  <div class="wrap foot-in">
    <span>© ${new Date().getFullYear()} ${esc(name)}</span>
    <span>${esc(pf.meta?.footerNote || '')}</span>
  </div>
</footer>`;
}

export default {
  id: 'photo-light',
  name: 'Aperture',
  category: 'Photographers & Artists',
  blurb: 'Light, editorial and image-first. Your work leads, the design stays quiet.',
  tags: ['Light', 'Gallery', 'Editorial'],
  previewTheme: { accent: '#b45309', dark: false, font: 'serif', radius: 4, containerWidth: 1200 },
  css,
  render,
};
