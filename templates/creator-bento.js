/* templates/creator-bento.js — "Bento": dark bento-grid, playful and modern.
   Aimed at creators, YouTubers, writers, community builders and indie hackers. */

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
  const accent = t.accent || '#22d3ee';
  const dark = t.dark !== false;
  const radius = (t.radius ?? 22) + 'px';
  const width = t.containerWidth || 1160;
  const font = FONTS[t.font] || FONTS.sans;
  const mono = FONTS.mono;

  const bg = dark ? '#07070a' : '#f4f5f7';
  const card = dark ? '#101015' : '#ffffff';
  const card2 = dark ? '#15151c' : '#f9fafb';
  const ink = dark ? '#f2f3f6' : '#0d0e12';
  const dim = dark ? '#8b8f9c' : '#5d6472';
  const line = dark ? '#1e1f27' : '#e6e8ec';

  return `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};color:${ink};font-family:${font};font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3{margin:0;line-height:1.1;letter-spacing:-.03em;font-weight:800}
p{margin:0}
.icon{display:inline-flex;width:1em;height:1em}
.icon svg{width:100%;height:100%}
.wrap{max-width:${width}px;margin:0 auto;padding:36px 22px 70px}

/* ---------- bento ---------- */
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
.cell{background:${card};border:1px solid ${line};border-radius:${radius};padding:26px;position:relative;overflow:hidden;transition:border-color .22s,transform .22s}
.cell:hover{border-color:${accent}66;transform:translateY(-3px)}
.cell h3{font-size:17px}
.cell-title{font-size:clamp(21px,2.6vw,28px);margin-bottom:14px}
.c-contact-title{font-size:clamp(26px,4.4vw,48px)}
.cell .kicker{font-family:${mono};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${dim};margin-bottom:12px;display:block}
.glow::before{content:"";position:absolute;inset:auto -20% -60%;height:220px;background:radial-gradient(50% 50% at 50% 100%,${accent}30,transparent 70%);pointer-events:none}

/* identity */
.c-id{grid-column:span 7;min-height:280px}
.c-side{grid-column:span 5;display:flex;flex-direction:column;gap:16px}
.c-avatar-row{display:flex;align-items:center;gap:18px}
.c-avatar{width:74px;height:74px;border-radius:20px;object-fit:cover;border:1px solid ${line}}
.c-id h1{font-size:clamp(28px,4vw,44px);margin-top:20px}
.c-id .role{color:${accent};font-weight:700;margin-top:8px;font-size:16px}
.c-id p{color:${dim};margin-top:12px;max-width:46ch}
.acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 17px;border-radius:12px;font-weight:700;font-size:14px;border:1px solid ${line};background:${card2};transition:transform .15s,border-color .15s}
.btn:hover{transform:translateY(-2px);border-color:${accent}}
.btn-a{background:${accent};border-color:${accent};color:#04121a}
.status{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:${dim};border:1px solid ${line};padding:5px 11px;border-radius:999px}
.status i{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.16)}
.c-cta{flex:1;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(140deg,${accent}1f,${card})}
.c-cta h3{font-size:20px}
.c-cta p{color:${dim};font-size:14px;margin-top:8px}
.c-social{display:flex;flex-wrap:wrap;gap:8px}
.soc{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:${dim};border:1px solid ${line};background:${card2};padding:8px 11px;border-radius:11px;transition:color .16s,border-color .16s}
.soc:hover{color:${ink};border-color:${accent}}
.soc .icon{width:15px;height:15px}
.soc span{display:none}

/* stats */
.c-stats{grid-column:span 12;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;background:transparent;border:0;padding:0}
.c-stats:hover{transform:none}
.stat{background:${card};border:1px solid ${line};border-radius:${radius};padding:20px;text-align:center}
.stat b{display:block;font-size:26px;letter-spacing:-.03em;color:${accent}}
.stat span{font-size:12.5px;color:${dim}}

/* about */
.c-about{grid-column:span 7}
.c-about .txt{color:${dim};margin-top:6px}
.c-about .txt p{margin-bottom:14px}
.c-about .txt p:last-child{margin-bottom:0}

/* skills */
.c-skills{grid-column:span 5}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-size:13px;border:1px solid ${line};background:${card2};padding:6px 11px;border-radius:999px}
.bars{display:flex;flex-direction:column;gap:14px;margin-top:16px}
.bar .nm{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px}
.bar .nm i{font-style:normal;font-family:${mono};font-size:11.5px;color:${dim}}
.bar .tr{height:6px;border-radius:99px;background:${dark ? '#1a1b22' : '#e6e8ec'};overflow:hidden}
.bar .tr i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,${accent},${accent}99);animation:grow .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes grow{from{width:0}}

/* services */
.c-services{grid-column:span 12}
.c-svc{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;background:transparent;border:0;padding:0}
.c-svc:hover{transform:none}
.svc{position:relative;background:${card};border:1px solid ${line};border-radius:${radius};padding:22px;transition:transform .2s,border-color .2s}
.svc:hover{transform:translateY(-3px);border-color:${accent}66}
.svc .em{font-size:22px}
.svc h3{font-size:16px;margin-top:12px}
.svc p{color:${dim};font-size:13.5px;margin-top:7px}

/* projects */
.c-workwrap{grid-column:span 12}
.c-work{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;background:transparent;border:0;padding:0}
.c-work:hover{transform:none}
.work{position:relative;background:${card};border:1px solid ${line};border-radius:${radius};overflow:hidden;display:flex;flex-direction:column;transition:transform .22s,border-color .22s}
.work:hover{transform:translateY(-4px);border-color:${accent}66}
.work .cv{aspect-ratio:16/10;overflow:hidden}
.work .cv img{width:100%;height:100%;object-fit:cover;transition:transform .55s ease}
.work:hover .cv img{transform:scale(1.05)}
.work .bd{padding:20px;display:flex;flex-direction:column;flex:1}
.work h3{font-size:17px}
.work p{color:${dim};font-size:14px;margin-top:8px;flex:1}
.work .tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.work .tg span{font-family:${mono};font-size:10.5px;color:${dim};border:1px solid ${line};padding:3px 7px;border-radius:6px}
.work .ln{display:flex;gap:14px;margin-top:14px;font-size:13.5px;font-weight:700;color:${accent}}
.work .ln a{display:inline-flex;align-items:center;gap:5px}

/* timeline */
.c-tl{grid-column:span 7}
.tl{position:relative;padding-left:22px;margin-top:8px}
.tl::before{content:"";position:absolute;left:4px;top:6px;bottom:6px;width:1px;background:${line}}
.tl-i{position:relative;padding-bottom:22px}
.tl-i:last-child{padding-bottom:0}
.tl-i::before{content:"";position:absolute;left:-22px;top:6px;width:9px;height:9px;border-radius:50%;background:${accent}}
.tl-i h3{font-size:16px}
.tl-i .org{color:${accent};font-size:14px;font-weight:600;margin-top:3px}
.tl-i .when{font-family:${mono};font-size:11.5px;color:${dim};margin-top:3px}
.tl-i p{color:${dim};font-size:14px;margin-top:8px}

.c-edu{grid-column:span 5}

/* quotes */
.c-qwrap{grid-column:span 12}
.c-q{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;background:transparent;border:0;padding:0}
.c-q:hover{transform:none}
.qc{background:${card};border:1px solid ${line};border-radius:${radius};padding:24px}
.qc p{font-size:15.5px;margin-top:10px}
.qc .who{display:flex;align-items:center;gap:11px;margin-top:18px}
.qc .who img{width:38px;height:38px;border-radius:50%;object-fit:cover}
.qc .who b{font-size:14px;display:block}
.qc .who span{font-size:12.5px;color:${dim}}

/* contact */
.c-contact{grid-column:span 12;text-align:center;background:linear-gradient(150deg,${accent}18,${card});padding:clamp(34px,5vw,60px)}
.c-contact h2{font-size:clamp(26px,4.4vw,48px)}
.c-contact p{color:${dim};margin-top:14px}
.c-contact .acts{justify-content:center}
.lines{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-top:24px;font-size:14px;color:${dim}}
.lines .icon{width:15px;height:15px;vertical-align:-3px;margin-right:6px;color:${accent}}
.foot{text-align:center;color:${dim};font-size:13px;padding:26px 0 40px}

@media(max-width:900px){
  .bento{grid-template-columns:1fr}
  .c-id,.c-side,.c-about,.c-skills,.c-tl,.c-edu,.c-stats,.c-services,.c-svc,.c-workwrap,.c-work,.c-qwrap,.c-q,.c-contact{grid-column:span 1}
  .c-stats,.c-svc,.c-work,.c-q{grid-template-columns:1fr}
}
${pf.meta?.customCss || ''}
`;
}

export function render(pf) {
  const L = sectionLabels(pf);
  const p = pf.profile || {};
  const s = pf.sections || {};
  const name = p.name || 'Your Name';
  const accent = (pf.theme || {}).accent || '#22d3ee';

  return `
<main class="wrap">
  <div class="bento">

    <section class="cell glow c-id" data-tilt data-tilt-max="5" data-spotlight>
      <span class="kicker">Portfolio</span>
      <div class="c-avatar-row">
        <img class="c-avatar" src="${attr(photoSrc(p.photo, name))}" alt="${attr(name)}">
        ${p.availability ? `<span class="status"><i></i>${esc(p.availability)}</span>` : ''}
      </div>
      <h1>${esc(name)}</h1>
      <div class="role">${esc(p.role || '')}</div>
      <p>${esc(p.tagline || '')}</p>
      <div class="acts">
        ${pf.projects?.length ? '<a class="btn btn-a" href="#work">See my work</a>' : ''}
        ${p.resumeUrl ? `<a class="btn" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.cvLabel || 'Download CV')}</a>` : ''}
        ${p.email ? `<a class="btn" href="mailto:${attr(p.email)}">${icon('mail')} ${esc(L('contactCta'))}</a>` : ''}
      </div>
    </section>

    <div class="c-side">
      <section class="cell glow c-cta" data-tilt data-tilt-max="6" data-spotlight>
        <div>
          <span class="kicker">Currently</span>
          <h3>${esc(p.location || 'Working remotely')}</h3>
          <p>${esc(p.availability || 'Open to interesting projects and collaborations.')}</p>
        </div>
        <div style="margin-top:18px">${socialRow(pf.socials || [], 'c-social')}</div>
      </section>
    </div>

    ${s.stats !== false && pf.stats?.length ? `
    <div class="c-stats">
      ${pf.stats.map(st => `<div class="stat" data-reveal><b data-count>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join('')}
    </div>` : ''}

    ${s.about !== false ? `
    <section class="cell c-about" data-tilt data-tilt-max="4" data-spotlight>
      <span class="kicker">${esc(L('about'))}</span>
      <h2 class="cell-title">${esc(L('aboutTitle'))}</h2>
      <div class="txt">${paragraphs(p.about || 'Tell people who you are and what you make.')}</div>
    </section>` : ''}

    ${s.skills !== false && pf.skills?.length ? `
    <section class="cell c-skills" data-tilt data-tilt-max="4" data-spotlight>
      <span class="kicker">${esc(L('skills'))}</span>
      <h2 class="cell-title">${esc(L('skillsTitle'))}</h2>
      <div class="bars">
        ${pf.skills.map(sk => `
          <div class="bar">
            <div class="nm"><span>${esc(sk.name)}</span><i>${esc(sk.level || 0)}%</i></div>
            <div class="tr"><i style="width:${Math.min(100, Math.max(0, Number(sk.level) || 0))}%"></i></div>
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${s.services !== false && pf.services?.length ? `
    <section class="cell c-services">
      <span class="kicker">${esc(L('services'))}</span>
      <h2 class="cell-title">${esc(L('servicesTitle'))}</h2>
      <div class="c-svc">
        ${pf.services.map(sv => `<div class="svc" data-tilt data-tilt-max="5" data-spotlight><div class="em">${esc(sv.icon || '✦')}</div><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div>`).join('')}
      </div>
    </section>` : ''}

    ${s.projects !== false && pf.projects?.length ? `
    <section class="cell c-workwrap" id="work">
      <span class="kicker">${esc(L('projects'))}</span>
      <h2 class="cell-title">${esc(L('projectsTitle'))}</h2>
      <div class="c-work">
      ${pf.projects.map((pr, i) => `
        <article class="work" data-tilt data-tilt-max="5" data-spotlight>
          <div class="cv">${img(pr.image, pr.title || i, pr.title)}</div>
          <div class="bd">
            <h3>${esc(pr.title)}</h3>
            <p>${esc(pr.description)}</p>
            ${pr.tags ? `<div class="tg">${toList(pr.tags).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
            ${(pr.liveUrl || pr.repoUrl) ? `<div class="ln">
              ${pr.liveUrl ? `<a href="${attr(pr.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon('arrow')}Live</a>` : ''}
              ${pr.repoUrl ? `<a href="${attr(pr.repoUrl)}" target="_blank" rel="noopener noreferrer">${icon('code')}Code</a>` : ''}
            </div>` : ''}
          </div>
        </article>`).join('')}
      </div>
    </section>` : ''}

    ${s.experience !== false && pf.experience?.length ? `
    <section class="cell c-tl" data-tilt data-tilt-max="4" data-spotlight>
      <span class="kicker">${esc(L('experience'))}</span>
      <h2 class="cell-title">${esc(L('experienceTitle'))}</h2>
      <div class="tl">
        ${pf.experience.map(ex => `
          <div class="tl-i">
            <h3>${esc(ex.role)}</h3>
            <div class="org">${esc(ex.company)}</div>
            <div class="when">${esc(ex.period)}${ex.location ? ` · ${esc(ex.location)}` : ''}</div>
            ${ex.description ? `<p>${esc(ex.description)}</p>` : ''}
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${s.education !== false && pf.education?.length ? `
    <section class="cell c-edu" data-tilt data-tilt-max="4" data-spotlight>
      <span class="kicker">${esc(L('education'))}</span>
      <h2 class="cell-title">${esc(L('educationTitle'))}</h2>
      <div class="tl">
        ${pf.education.map(ed => `
          <div class="tl-i">
            <h3>${esc(ed.degree)}</h3>
            <div class="org">${esc(ed.school)}</div>
            <div class="when">${esc(ed.period)}</div>
            ${ed.detail ? `<p>${esc(ed.detail)}</p>` : ''}
          </div>`).join('')}
      </div>
    </section>` : ''}

    ${s.testimonials !== false && pf.testimonials?.length ? `
    <section class="cell c-qwrap">
      <span class="kicker">${esc(L('testimonials'))}</span>
      <h2 class="cell-title">${esc(L('testimonialsTitle'))}</h2>
      <div class="c-q">
      ${pf.testimonials.map(t => `
        <div class="qc">
          <span style="color:${accent}">${icon('quote')}</span>
          <p>“${esc(t.quote)}”</p>
          <div class="who"><img src="${attr(photoSrc(t.photo, t.name))}" alt=""><div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div></div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${s.contact !== false ? `
    <section class="cell c-contact" id="contact" data-tilt data-tilt-max="3" data-spotlight>
      <span class="kicker">${esc(L('contact'))}</span>
      <h2 class="c-contact-title">${esc(L('contactTitle'))}</h2>
      <p>${esc(p.tagline || 'Drop me a line — I reply within a day.')}</p>
      <div class="acts">
        ${p.email ? `<a class="btn btn-a" href="mailto:${attr(p.email)}">${icon('mail')} ${esc(p.email)}</a>` : ''}
        ${p.resumeUrl ? `<a class="btn" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${icon('download')} ${esc(p.cvLabel || 'Download CV')}</a>` : ''}
      </div>
      <div class="lines">
        ${p.phone ? `<span>${icon('phone')}${esc(p.phone)}</span>` : ''}
        ${p.location ? `<span>${icon('map')}${esc(p.location)}</span>` : ''}
      </div>
    </section>` : ''}
  </div>
</main>

<footer class="foot">
  © ${new Date().getFullYear()} ${esc(name)} · ${esc(pf.meta?.footerNote || '')}
</footer>`;
}

export default {
  id: 'creator-bento',
  name: 'Bento',
  category: 'Creators & Makers',
  blurb: 'A dark bento grid that looks designed by a studio, in one page.',
  tags: ['Dark', 'Bento grid', 'Modern'],
  previewTheme: { accent: '#22d3ee', dark: true, font: 'sans', radius: 22, containerWidth: 1160 },
  css,
  render,
};
