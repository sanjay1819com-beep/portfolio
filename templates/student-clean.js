/* templates/student-clean.js — "Scholar": crisp résumé-style one-pager.
   Aimed at students, freshers and career switchers. */

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
  const accent = t.accent || '#0f766e';
  const dark = t.dark === true;
  const radius = (t.radius ?? 10) + 'px';
  const width = t.containerWidth || 1000;
  const font = FONTS[t.font] || FONTS.sans;
  const mono = FONTS.mono;

  const bg = dark ? '#0c1013' : '#f6f7f9';
  const paper = dark ? '#12171c' : '#ffffff';
  const ink = dark ? '#e9edf1' : '#131a20';
  const dim = dark ? '#93a0ac' : '#5c6a77';
  const line = dark ? '#1e262d' : '#e4e8ed';
  const tint = dark ? '#161d23' : '#f2f5f8';

  return `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:${bg};color:${ink};font-family:${font};font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h3{margin:0;line-height:1.2;letter-spacing:-.02em}
p{margin:0}
.icon{display:inline-flex;width:1em;height:1em}
.icon svg{width:100%;height:100%}
.page{max-width:${width}px;margin:34px auto;padding:0 20px}
.sheet{background:${paper};border:1px solid ${line};border-radius:calc(${radius} + 6px);overflow:hidden;box-shadow:0 30px 70px -46px rgba(15,23,42,.55)}

/* ---------- top ---------- */
.top{display:grid;grid-template-columns:auto 1fr;gap:26px;padding:34px 36px;border-bottom:1px solid ${line};background:linear-gradient(180deg,${tint},${paper})}
.avatar{width:96px;height:96px;border-radius:${radius};object-fit:cover;border:1px solid ${line}}
.top-main{display:flex;flex-direction:column;justify-content:center;min-width:0}
.top h1{font-size:clamp(26px,4vw,36px);font-weight:800}
.top .role{color:${accent};font-weight:600;margin-top:5px;font-size:17px}
.top .tag{color:${dim};margin-top:9px;max-width:60ch}
.top-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.pill{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:${dim};background:${tint};border:1px solid ${line};padding:5px 10px;border-radius:999px}
.pill a:hover{color:${accent}}
.pill .icon{width:14px;height:14px;color:${accent}}
.top-actions{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border-radius:9px;font-size:14px;font-weight:600;border:1px solid ${line};background:${paper};transition:transform .15s,border-color .15s}
.btn:hover{transform:translateY(-1px);border-color:${accent}}
.btn-solid{background:${accent};border-color:${accent};color:#fff}

/* ---------- body ---------- */
.body{display:grid;grid-template-columns:290px 1fr}
.side{border-right:1px solid ${line};padding:26px 26px 34px;background:${tint}}
.main{padding:26px 34px 38px}
h2.blk{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${dim};margin:0 0 14px;font-weight:700}
.blk + .blk, section + section{margin-top:30px}
section .blk{margin-bottom:14px}

/* stats */
.stat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.stat{background:${paper};border:1px solid ${line};border-radius:${radius};padding:12px}
.stat b{display:block;font-size:20px;letter-spacing:-.02em;color:${accent}}
.stat span{font-size:12px;color:${dim}}

/* skills */
.skill{margin-bottom:12px}
.skill .nm{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px}
.skill .nm i{font-style:normal;font-family:${mono};font-size:11.5px;color:${dim}}
.track{height:5px;background:${dark ? '#1c242b' : '#e2e7ec'};border-radius:99px;overflow:hidden}
.track i{display:block;height:100%;background:${accent};border-radius:99px;animation:grow .8s ease both}
@keyframes grow{from{width:0}}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{font-size:12.5px;border:1px solid ${line};background:${paper};padding:4px 9px;border-radius:7px}

/* contact list */
.clist{display:flex;flex-direction:column;gap:11px;font-size:13.5px;color:${dim};word-break:break-word}
.clist a:hover{color:${accent}}
.clist .row{display:flex;gap:9px;align-items:flex-start}
.clist .icon{width:15px;height:15px;color:${accent};flex:none;margin-top:3px}
.socs{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.soc{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:${dim};border:1px solid ${line};background:${paper};padding:5px 9px;border-radius:8px}
.soc:hover{color:${accent};border-color:${accent}}
.soc .icon{width:14px;height:14px}
.soc span{display:none}

/* ---------- main blocks ---------- */
.about p{color:${dim};margin-bottom:14px}
.about p:last-child{margin-bottom:0}

.entry{position:relative;padding-left:20px;padding-bottom:22px;border-left:2px solid ${line}}
.entry:last-child{padding-bottom:0}
.entry::before{content:"";position:absolute;left:-6px;top:5px;width:10px;height:10px;border-radius:50%;background:${accent}}
.entry-head{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:baseline}
.entry h3{font-size:16.5px}
.entry .sub{color:${accent};font-size:14.5px;font-weight:600;margin-top:2px}
.entry .when{font-family:${mono};font-size:12px;color:${dim};white-space:nowrap}
.entry p{color:${dim};font-size:14.5px;margin-top:8px}
.entry .where{font-size:12.5px;color:${dim};margin-top:3px}

/* projects */
.proj{display:grid;grid-template-columns:132px 1fr;gap:18px;padding:16px;border:1px solid ${line};border-radius:${radius};background:${tint};margin-bottom:12px;transition:border-color .2s,transform .2s}
.proj:hover{border-color:${accent};transform:translateY(-2px)}
.proj .thumb{border-radius:8px;overflow:hidden;aspect-ratio:4/3}
.proj .thumb img{width:100%;height:100%;object-fit:cover}
.proj h3{font-size:16px}
.proj p{color:${dim};font-size:14px;margin-top:6px}
.proj .tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.proj .tag{font-family:${mono};font-size:11px;color:${dim};border:1px solid ${line};background:${paper};padding:2px 7px;border-radius:5px}
.proj .links{display:flex;gap:14px;margin-top:10px;font-size:13.5px;font-weight:600}
.proj .links a{color:${accent};display:inline-flex;align-items:center;gap:5px}

/* services */
.svc{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.svc-i{border:1px solid ${line};border-radius:${radius};padding:16px;background:${tint}}
.svc-i h3{font-size:15px;margin-top:8px}
.svc-i p{color:${dim};font-size:13.5px;margin-top:6px}

/* quotes */
.q{border:1px solid ${line};border-radius:${radius};padding:18px;background:${tint};margin-bottom:12px}
.q p{font-size:15px}
.q .who{display:flex;align-items:center;gap:10px;margin-top:14px}
.q .who img{width:34px;height:34px;border-radius:50%;object-fit:cover}
.q .who b{font-size:13.5px;display:block}
.q .who span{font-size:12.5px;color:${dim}}

/* footer */
.foot{border-top:1px solid ${line};padding:18px 36px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:12.5px;color:${dim};background:${tint}}

@media(max-width:860px){
  .page{margin:0;padding:0}
  .sheet{border-radius:0;border-left:0;border-right:0}
  .body{grid-template-columns:1fr}
  .side{border-right:0;border-bottom:1px solid ${line}}
  .main{padding:24px 22px 30px}
  .top{padding:26px 22px}
  .proj{grid-template-columns:1fr}
  .proj .thumb{max-height:170px}
}
@media print{
  body{background:#fff}
  .page{margin:0;max-width:none;padding:0}
  .sheet{border:0;box-shadow:none;border-radius:0}
  .top-actions,.socs{display:none}
}
${pf.meta?.customCss || ''}
`;
}

export function render(pf) {
  const L = sectionLabels(pf);
  const p = pf.profile || {};
  const s = pf.sections || {};
  const name = p.name || 'Your Name';

  return `
<div class="page">
  <div class="sheet">
    <header class="top">
      <img class="avatar" src="${attr(photoSrc(p.photo, name))}" alt="${attr(name)}">
      <div class="top-main">
        <h1>${esc(name)}</h1>
        <div class="role">${esc(p.role || '')}</div>
        ${p.tagline ? `<p class="tag">${esc(p.tagline)}</p>` : ''}
        <div class="top-meta">
          ${p.location ? `<span class="pill">${icon('map')}${esc(p.location)}</span>` : ''}
          ${p.email ? `<span class="pill">${icon('email')}<a href="mailto:${attr(p.email)}">${esc(p.email)}</a></span>` : ''}
          ${p.phone ? `<span class="pill">${icon('phone')}<a href="tel:${attr(p.phone)}">${esc(p.phone)}</a></span>` : ''}
          ${p.availability ? `<span class="pill">${icon('check')}${esc(p.availability)}</span>` : ''}
        </div>
        <div class="top-actions">
          ${p.resumeUrl ? `<a class="btn btn-solid" href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${icon('download')}${esc(p.cvLabel || 'Download Resume')}</a>` : ''}
          ${p.email ? `<a class="btn" href="mailto:${attr(p.email)}">${icon('mail')}${esc(L('contactCta'))}</a>` : ''}
        </div>
      </div>
    </header>

    <div class="body">
      <aside class="side">
        ${s.stats !== false && pf.stats?.length ? `
        <section>
          <h2 class="blk">${esc(L('stats'))}</h2>
          <div class="stat-grid">
            ${pf.stats.map(st => `<div class="stat" data-reveal><b data-count>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join('')}
          </div>
        </section>` : ''}

        ${s.skills !== false && pf.skills?.length ? `
        <section>
          <h2 class="blk">${esc(L('skillsTitle'))}</h2>
          ${pf.skills.map(sk => `
            <div class="skill">
              <div class="nm"><span>${esc(sk.name)}</span><i>${esc(sk.level || 0)}%</i></div>
              <div class="track"><i style="width:${Math.min(100, Math.max(0, Number(sk.level) || 0))}%"></i></div>
            </div>`).join('')}
        </section>` : ''}

        ${s.contact !== false ? `
        <section id="contact">
          <h2 class="blk">${esc(L('contactTitle'))}</h2>
          <div class="clist">
            ${p.email ? `<div class="row">${icon('email')}<a href="mailto:${attr(p.email)}">${esc(p.email)}</a></div>` : ''}
            ${p.phone ? `<div class="row">${icon('phone')}<a href="tel:${attr(p.phone)}">${esc(p.phone)}</a></div>` : ''}
            ${p.location ? `<div class="row">${icon('map')}<span>${esc(p.location)}</span></div>` : ''}
            ${p.resumeUrl ? `<div class="row">${icon('download')}<a href="${attr(p.resumeUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.cvLabel || 'Resume')}</a></div>` : ''}
          </div>
          ${socialRow(pf.socials || [], 'socs')}
          <div class="top-actions" style="margin-top:16px">
            ${p.email ? `<a class="btn btn-solid" href="mailto:${attr(p.email)}">${icon('mail')}${esc(L('contactCta'))}</a>` : ''}
          </div>
        </section>` : ''}
      </aside>

      <div class="main">
        ${s.about !== false ? `
        <section class="about">
          <h2 class="blk">${esc(L('aboutTitle'))}</h2>
          ${paragraphs(p.about || 'Write a short introduction about yourself.')}
        </section>` : ''}

        ${s.education !== false && pf.education?.length ? `
        <section>
          <h2 class="blk">${esc(L('educationTitle'))}</h2>
          ${pf.education.map(ed => `
            <div class="entry">
              <div class="entry-head">
                <div><h3>${esc(ed.degree)}</h3><div class="sub">${esc(ed.school)}</div></div>
                <span class="when">${esc(ed.period)}</span>
              </div>
              ${ed.detail ? `<p>${esc(ed.detail)}</p>` : ''}
            </div>`).join('')}
        </section>` : ''}

        ${s.experience !== false && pf.experience?.length ? `
        <section>
          <h2 class="blk">${esc(L('experienceTitle'))}</h2>
          ${pf.experience.map(ex => `
            <div class="entry">
              <div class="entry-head">
                <div><h3>${esc(ex.role)}</h3><div class="sub">${esc(ex.company)}</div></div>
                <span class="when">${esc(ex.period)}</span>
              </div>
              ${ex.location ? `<div class="where">${esc(ex.location)}</div>` : ''}
              ${ex.description ? `<p>${esc(ex.description)}</p>` : ''}
            </div>`).join('')}
        </section>` : ''}

        ${s.projects !== false && pf.projects?.length ? `
        <section>
          <h2 class="blk">${esc(L('projectsTitle'))}</h2>
          ${pf.projects.map((pr, i) => `
            <div class="proj">
              <div class="thumb">${img(pr.image, pr.title || i, pr.title)}</div>
              <div>
                <h3>${esc(pr.title)}</h3>
                <p>${esc(pr.description)}</p>
                ${pr.tags ? `<div class="tags">${toList(pr.tags).map(tg => `<span class="tag">${esc(tg)}</span>`).join('')}</div>` : ''}
                ${(pr.liveUrl || pr.repoUrl) ? `<div class="links">
                  ${pr.liveUrl ? `<a href="${attr(pr.liveUrl)}" target="_blank" rel="noopener noreferrer">${icon('arrow')}Live demo</a>` : ''}
                  ${pr.repoUrl ? `<a href="${attr(pr.repoUrl)}" target="_blank" rel="noopener noreferrer">${icon('code')}Source code</a>` : ''}
                </div>` : ''}
              </div>
            </div>`).join('')}
        </section>` : ''}

        ${s.services !== false && pf.services?.length ? `
        <section>
          <h2 class="blk">${esc(L('servicesTitle'))}</h2>
          <div class="svc">
            ${pf.services.map(sv => `<div class="svc-i"><div>${esc(sv.icon || '✦')}</div><h3>${esc(sv.title)}</h3><p>${esc(sv.description)}</p></div>`).join('')}
          </div>
        </section>` : ''}

        ${s.testimonials !== false && pf.testimonials?.length ? `
        <section>
          <h2 class="blk">${esc(L('testimonialsTitle'))}</h2>
          ${pf.testimonials.map(t => `
            <div class="q">
              <p>“${esc(t.quote)}”</p>
              <div class="who">
                <img src="${attr(photoSrc(t.photo, t.name))}" alt="">
                <div><b>${esc(t.name)}</b><span>${esc(t.role)}</span></div>
              </div>
            </div>`).join('')}
        </section>` : ''}
      </div>
    </div>

    <div class="foot">
      <span>© ${new Date().getFullYear()} ${esc(name)}</span>
      <span>${esc(pf.meta?.footerNote || '')}</span>
    </div>
  </div>
</div>`;
}

export default {
  id: 'student-clean',
  name: 'Scholar',
  category: 'Students & Freshers',
  blurb: 'A crisp résumé one-pager. Perfect for placements and internships.',
  tags: ['Résumé', 'Print-ready', 'One page'],
  previewTheme: { accent: '#0f766e', dark: false, font: 'sans', radius: 10, containerWidth: 1000 },
  css,
  render,
};
