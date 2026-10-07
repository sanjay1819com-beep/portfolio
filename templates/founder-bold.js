/* templates/founder-bold.js — "Momentum": loud, confident, type-led.
   Aimed at founders, freelancers, consultants and marketers. */

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
  const accent = t.accent || '#f43f5e';
  const dark = t.dark === true;
  const radius = (t.radius ?? 20) + 'px';
  const width = t.containerWidth || 1140;
  const font = FONTS[t.font] || FONTS.sans;
  const mono = FONTS.mono;

  const bg = dark ? '#0a0a0c' : '#ffffff';
  const ink = dark ? '#f7f7f8' : '#0a0a0c';
  const dim = dark ? '#9b9ba6' : '#5f6070';
  const line = dark ? '#1e1e24' : '#ebebef';
  const surface = dark ? '#121216' : '#f7f7f9';

  return `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};color:${ink};font-family:${font};font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3{margin:0;line-height:1.02;letter-spacing:-.045em;font-weight:800}
p{margin:0}
.icon{display:inline-flex;width:1em;height:1em}
.icon svg{width:100%;height:100%}
.wrap{max-width:${width}px;margin:0 auto;padding:0 26px}
.eyebrow{display:inline-flex;align-items:center;gap:9px;font-family:${mono};font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${dim}}
.eyebrow i{width:8px;height:8px;border-radius:50%;background:${accent};display:inline-block;box-shadow:0 0 0 5px ${accent}22}

/* ---------- nav ---------- */
.nav{position:sticky;top:0;z-index:50;border-bottom:1px solid ${line};background:${dark ? 'rgba(10,10,12,.8)' : 'rgba(255,255,255,.82)'};backdrop-filter:blur(16px)}
.nav-in{display:flex;align-items:center;gap:22px;height:70px}
.mark{display:flex;align-items:center;gap:11px;font-weight:800;letter-spacing:-.03em;font-size:17px}
.mark b{width:32px;height:32px;border-radius:10px;background:${ink};color:${bg};display:grid;place-items:center;font-size:13px}
.nav-links{margin-left:auto;display:flex;gap:26px}
.nav-links a{font-size:14.5px;color:${dim};transition:color .18s}
.nav-links a:hover{color:${ink}}
.nav-btn{background:${ink};color:${bg};padding:10px 17px;border-radius:999px;font-size:14px;font-weight:700;transition:transform .16s,opacity .16s}
.nav-btn:hover{transform:translateY(-1px);opacity:.9}

/* ---------- hero ---------- */
.hero{padding:96px 0 84px;position:relative}
.hero-eyebrow{margin-bottom:26px}
.hero h1{font-size:clamp(44px,8.6vw,108px)}
.hero h1 .accent{color:${accent}}
.hero h1 .out{-webkit-text-stroke:1.5px ${ink};color:transparent}
.hero-grid{display:grid;grid-template-columns:1fr auto;gap:50px;align-items:end;margin-top:42px}
.hero p.lead{font-size:19.5px;color:${dim};max-width:52ch}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}
.btn{display:inline-flex;align-items:center;gap:9px;padding:14px 22px;border-radius:999px;font-weight:700;font-size:15px;transition:transform .16s,opacity .16s,background .2s}
.btn:hover{transform:translateY(-2px)}
.btn-dark{background:${ink};color:${bg}}
.btn-line{border:1.5px solid ${line};color:${ink}}
.btn-line:hover{border-color:${ink}}
.hero-photo{width:150px;height:150px;border-radius:50%;object-fit:cover;border:4px solid ${bg};box-shadow:0 0 0 1px ${line},0 30px 60px -34px rgba(0,0,0,.6)}

/* ---------- marquee ---------- */
.marquee{border-top:1px solid ${line};border-bottom:1px solid ${line};overflow:hidden;padding:16px 0;background:${surface}}
.marquee-track{display:flex;gap:38px;width:max-content;animation:slide 26s linear infinite}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes slide{to{transform:translateX(-50%)}}
.marquee span{font-family:${mono};font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:${dim};white-space:nowrap;display:inline-flex;align-items:center;gap:38px}
.marquee span::after{content:"";width:5px;height:5px;border-radius:50%;background:${accent}}

/* ---------- stats ---------- */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:26px;padding:70px 0 20px}
.stat b{display:block;font-size:clamp(36px,5vw,58px);letter-spacing:-.05em}
.stat span{color:${dim};font-size:14.5px}

/* ---------- sections ---------- */
.section{padding:90px 0}
.s-head{display:flex;align-items:flex-end;justify-content:space-between;gap:26px;margin-bottom:52px;flex-wrap:wrap}
.s-head h2{font-size:clamp(30px,5vw,60px);margin-top:16px}

/* ---------- about ---------- */
.split{display:grid;grid-template-columns:1fr 1.25fr;gap:60px;align-items:start}
.split h2{font-size:clamp(28px,4.4vw,50px)}
.split .txt{font-size:18.5px;color:${dim}}
.split .txt p{margin-bottom:18px}
.split .txt p:last-child{margin-bottom:0}

.chipwall{display:flex;flex-wrap:wrap;gap:10px}
.chipwall span{border:1px solid ${line};padding:8px 14px;border-radius:999px;font-size:14.5px;color:${dim};transition:color .2s,border-color .2s}
.chipwall span:hover{color:${ink};border-color:${accent}}

/* ---------- services ---------- */
.rows{border-top:1px solid ${line}}
.row{display:grid;grid-template-columns:60px 1fr 1.3fr auto;gap:24px;align-items:center;padding:30px 0;border-bottom:1px solid ${line};transition:padding .25s}
.row:hover{padding-left:12px}
.row .num{font-family:${mono};font-size:13px;color:${accent}}
.row h3{font-size:clamp(20px,2.6vw,30px)}
.row p{color:${dim};font-size:15.5px}
.row .em{font-size:24px;text-align:right}
@media(max-width:820px){.row{grid-template-columns:44px 1fr;gap:12px}.row p{grid-column:2}.row .em{display:none}}

/* ---------- projects ---------- */
.cases{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:22px}
.case{position:relative;border-radius:${radius};overflow:hidden;background:${surface};border:1px solid ${line};display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s}
.case:hover{transform:translateY(-6px);box-shadow:0 40px 70px -46px rgba(0,0,0,.5)}
.case .cover{aspect-ratio:16/10;overflow:hidden}
.case .cover img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.case:hover .cover img{transform:scale(1.05)}
.case .in{padding:24px 24px 26px;display:flex;flex-direction:column;flex:1}
.case h3{font-size:21px;letter-spacing:-.03em}
.case p{color:${dim};font-size:15px;margin-top:10px;flex:1}
.case .tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:16px}
.case .tag{font-family:${mono};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${dim};border:1px solid ${line};padding:4px 9px;border-radius:999px}
.case .go{margin-top:18px;display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:14.5px;color:${accent}}

/* ---------- timeline ---------- */
.xp{display:grid;grid-template-columns:200px 1fr;gap:32px;padding:26px 0;border-bottom:1px solid ${line}}
.xp:last-child{border-bottom:0}
.xp .when{font-family:${mono};font-size:13px;color:${dim}}
.xp h3{font-size:22px;letter-spacing:-.03em}
.xp .org{color:${accent};font-weight:700;margin-top:5px}
.xp p{color:${dim};margin-top:11px;font-size:15.5px}
@media(max-width:760px){.xp{grid-template-columns:1fr;gap:8px}}

/* ---------- quotes ---------- */
.quote-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.qcard{border:1px solid ${line};border-radius:${radius};padding:30px;background:${surface}}
.qcard .stars{color:${accent};letter-spacing:3px}
.qcard p{margin-top:14px;font-size:17px;line-height:1.55}
.qcard .who{display:flex;align-items:center;gap:12px;margin-top:22px}
.qcard .who img{width:42px;height:42px;border-radius:50%;object-fit:cover}
.qcard .who b{display:block;font-size:14.5px}
.qcard .who span{color:${dim};font-size:13px}

/* ---------- contact ---------- */
.cta{background:${ink};color:${bg};border-radius:calc(${radius} + 8px);padding:clamp(38px,6vw,74px);text-align:center;position:relative;overflow:hidden}
.cta::before{content:"";position:absolute;inset:auto -12% -70%;height:340px;background:radial-gradient(50% 50% at 50% 100%,${accent}55,transparent 70%)}
.cta h2{position:relative;font-size:clamp(32px,6vw,68px)}
.cta p{position:relative;margin-top:18px;color:${dark ? '#b9b9c4' : '#4b4c5a'};font-size:18px}
.cta .acts{position:relative;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px}
.cta .btn-dark{background:${accent};color:#fff}
.cta .btn-line{border-color:${dark ? '#33333c' : '#d3d3da'};color:${bg}}
.cta .socs{position:relative;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:26px}
.cta .soc{display:inline-flex;align-items:center;gap:7px;border:1px solid ${dark ? '#2a2a32' : '#dedee5'};padding:8px 13px;border-radius:999px;font-size:13px}
.cta .soc:hover{background:${accent};border-color:${accent};color:#fff}
.cta .soc .icon{width:15px;height:15px}
.cta .soc span{display:none}

footer{padding:34px 0 50px;color:${dim};font-size:14px}
.foot-in{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center}
@media(max-width:900px){
  .hero{padding:64px 0 56px}
  .hero-grid{grid-template-columns:1fr;gap:28px}
  .split{grid-template-columns:1fr;gap:26px}
  .section{padding:64px 0}
  .nav-links{display:none}
}
${pf.meta?.customCss || ''}
`;
}

export function render(pf) {
  const L = sectionLabels(pf);
  const p = pf.profile || {};
  const s = pf.sections || {};
  const name = p.name || 'Your Name';
  const first = name.split(' ')[0];
  const rest = name.split(' ').slice(1).join(' ');
  const marquee = [...(pf.stats || []).map(st => `${st.value} ${st.label}`), ...(pf.skills || []).map(sk => sk.name)];

  const navItems = [
    ['about', L('about'), s.about !== false],
    ['services', L('services'), s.services !== false && !!pf.services?.length],
    ['work', L('projects'), s.projects !== false && !!pf.projects?.length],
    ['experience', L('experience'), s.experience !== false && !!pf.experience?.length],
    ['contact', L('contact'), s.contact !== false],
  ].filter(([, , show]) => show);

  return `
<header class="nav">
  <div class="wrap nav-in">
    <a class="mark" href="#top"><b>${esc(initialsOf(name))}</b>${esc(name)}</a>
    <nav class="nav-links">${navItems.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
    ${p.email ? `<a class="nav-btn" href="mailto:${attr(p.email)}">${esc(L('contactCta'))}</a>` : ''}
  </div>
</header>

<main id="top">
<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow"><span class="eyebrow"><i></i>${esc(p.availability || p.role || '')}</span></div>
    <h1>${esc(first)}${rest ? ` <span class="accent">${esc(rest)}</span>` : ''}<br><span class="out">${esc(p.role || 'Portfolio')}</span></h1>
    <div class="hero-grid">
      <div>
        <p class="lead">${esc(p.tagline || '')}</p>
        <div class="hero-actions">
          ${pf.projects?.length ? '<a class="btn btn-dark" href="#work">See the work</a>' : '<a class="btn btn-dark" href="#about">About me</a>'}
          ${p.resumeUrl ? `<a class="btn btn-line" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.cvLabel || 'Download CV')}</a>` : ''}
        </div>
      </div>
      ${pf.theme?.heroPhoto ? `<img class="hero-photo" data-parallax="0.05" src="${attr(photoSrc(p.photo, name))}" alt="${attr(name)}">` : ''}
    </div>
  </div>
</section>

${marquee.length ? `
<div class="marquee"><div class="marquee-track">
  ${[...marquee, ...marquee].map(m => `<span>${esc(m)}</span>`).join('')}
</div></div>` : ''}

${s.stats !== false && pf.stats?.length ? `
<div class="wrap"><div class="stats">
  ${pf.stats.map(st => `<div class="stat" data-reveal><b data-count>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join('')}
</div></div>` : ''}

${s.about !== false ? `
<section class="section" id="about">
  <div class="wrap split">
    <h2>${esc((pf.labels || {}).aboutTitle || p.name || '')}</h2>
    <div class="txt">
      ${paragraphs(p.about || 'Introduce yourself in a way that makes people want to work with you.')}
      ${socialRow(pf.socials || [], 'socs')}
    </div>
  </div>
</section>` : ''}

${s.skills !== false && pf.skills?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('skills'))}</span><h2>${esc(L('skillsTitle'))}</h2></div></div>
    <div class="chipwall">${pf.skills.map(sk => `<span>${esc(sk.name)}</span>`).join('')}</div>
  </div>
</section>` : ''}

${s.services !== false && pf.services?.length ? `
<section class="section" id="services" style="padding-top:0">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('services'))}</span><h2>${esc(L('servicesTitle'))}</h2></div></div>
    <div class="rows">
      ${pf.services.map((sv, i) => `
        <div class="row">
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(sv.title)}</h3>
          <p>${esc(sv.description)}</p>
          <span class="em">${esc(sv.icon || '✦')}</span>
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.projects !== false && pf.projects?.length ? `
<section class="section" id="work">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('projects'))}</span><h2>${esc(L('projectsTitle'))}</h2></div>
      ${p.email ? `<a class="btn btn-line" href="mailto:${attr(p.email)}">Start a project</a>` : ''}</div>
    <div class="cases">
      ${pf.projects.map((pr, i) => `
        <article class="case" data-tilt data-tilt-max="5" data-spotlight>
          <div class="cover">${img(pr.image, pr.title || i, pr.title)}</div>
          <div class="in">
            <h3>${esc(pr.title)}</h3>
            <p>${esc(pr.description)}</p>
            ${pr.tags ? `<div class="tags">${toList(pr.tags).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
            ${(pr.liveUrl || pr.repoUrl) ? `<a class="go" href="${attr(pr.liveUrl || pr.repoUrl)}" target="_blank" rel="noopener noreferrer">View project ${icon('arrow')}</a>` : ''}
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.experience !== false && pf.experience?.length ? `
<section class="section" id="experience" style="padding-top:0">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('experience'))}</span><h2>${esc(L('experienceTitle'))}</h2></div></div>
    ${pf.experience.map(ex => `
      <div class="xp">
        <span class="when">${esc(ex.period)}</span>
        <div>
          <h3>${esc(ex.role)}</h3>
          <div class="org">${esc(ex.company)}${ex.location ? ` · ${esc(ex.location)}` : ''}</div>
          ${ex.description ? `<p>${esc(ex.description)}</p>` : ''}
        </div>
      </div>`).join('')}
  </div>
</section>` : ''}

${s.education !== false && pf.education?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('education'))}</span><h2>${esc(L('educationTitle'))}</h2></div></div>
    ${pf.education.map(ed => `
      <div class="xp">
        <span class="when">${esc(ed.period)}</span>
        <div><h3>${esc(ed.degree)}</h3><div class="org">${esc(ed.school)}</div>${ed.detail ? `<p>${esc(ed.detail)}</p>` : ''}</div>
      </div>`).join('')}
  </div>
</section>` : ''}

${s.testimonials !== false && pf.testimonials?.length ? `
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="s-head"><div><span class="eyebrow"><i></i>${esc(L('testimonials'))}</span><h2>${esc(L('testimonialsTitle'))}</h2></div></div>
    <div class="quote-grid">
      ${pf.testimonials.map(t => `
        <div class="qcard">
          <div class="stars">★★★★★</div>
          <p>“${esc(t.quote)}”</p>
          <div class="who"><img src="${attr(photoSrc(t.photo, t.name))}" alt=""><div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div></div>
        </div>`).join('')}
    </div>
  </div>
</section>` : ''}

${s.contact !== false ? `
<section class="section" id="contact">
  <div class="wrap">
    <div class="cta">
      <h2>${esc(L('contactTitle'))}</h2>
      <p>${esc(p.tagline || 'Tell me about your project.')}</p>
      <div class="acts">
        ${p.email ? `<a class="btn btn-dark" href="mailto:${attr(p.email)}">${icon('mail')} ${esc(p.email)}</a>` : ''}
        ${p.phone ? `<a class="btn btn-line" href="tel:${attr(p.phone)}">${esc(p.phone)}</a>` : ''}
      </div>
      ${socialRow(pf.socials || [], 'socs')}
    </div>
  </div>
</section>` : ''}
</main>

<footer>
  <div class="wrap foot-in">
    <span>© ${new Date().getFullYear()} ${esc(name)}${p.location ? ` · ${esc(p.location)}` : ''}</span>
    <span>${esc(pf.meta?.footerNote || '')}</span>
  </div>
</footer>`;
}

export default {
  id: 'founder-bold',
  name: 'Momentum',
  category: 'Founders & Freelancers',
  blurb: 'Loud, confident and type-led. For people who sell outcomes, not hours.',
  tags: ['Bold', 'Services', 'CTA'],
  previewTheme: { accent: '#f43f5e', dark: false, font: 'sans', radius: 20, containerWidth: 1140 },
  css,
  render,
};
