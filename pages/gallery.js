/* pages/gallery.js — the landing page: 3D mockup hero, template gallery,
   and the portfolios you have saved. */

import { $, $$, esc, attr, slugify, download, toast } from '../core/utils.js';
import { store, blankPortfolio, uniqueSlug } from '../core/store.js';
import { TEMPLATES, CATEGORIES, demoData, getTemplate } from '../templates/registry.js';
import { buildBackupJSON, thumbnailDocument, previewDocument } from '../core/export.js';
import { navigate } from '../core/router.js';
import { UI } from '../core/ui-icons.js';
import { brandLink, BRAND, CONTACT } from '../core/config.js';

/** Split a headline into per-character spans so it can animate in. */
function splitChars(text, startDelay = 0, step = 18) {
  let i = 0;
  return String(text)
    .split('')
    .map(ch => {
      if (ch === ' ') return ' ';
      const d = startDelay + i++ * step;
      return `<span class="char" style="animation-delay:${d}ms">${esc(ch)}</span>`;
    })
    .join('');
}

/** Static, script-free thumbnail — five of these animate nothing and cost nothing. */
function thumbFrame(tpl, data, scale = 0.25) {
  const ifr = document.createElement('iframe');
  ifr.setAttribute('scrolling', 'no');
  ifr.setAttribute('tabindex', '-1');
  ifr.setAttribute('aria-hidden', 'true');
  ifr.style.cssText = `width:1280px;height:832px;border:0;transform:scale(${scale});transform-origin:top left;pointer-events:none`;
  ifr.srcdoc = thumbnailDocument(data);
  return ifr;
}

export function renderGallery(root) {
  const hero = TEMPLATES[0];

  root.innerHTML = `
  <header class="topbar">
    ${brandLink()}
    <div class="topbar-spacer"></div>
    <button class="btn btn-sm btn-ghost" data-act="import">${UI.upload}Import</button>
    <button class="btn btn-sm btn-ghost" data-act="backup">${UI.download}Backup</button>
    <button class="btn btn-sm btn-primary" data-act="new">${UI.plus}New portfolio</button>
    <input type="file" accept="application/json" hidden id="import-file">
  </header>

  <section class="hero">
    <div class="hero-copy">
      <span class="eyebrow"><i></i>Free · No sign-up · Runs offline</span>
      <h1 class="hero-title">${splitChars('Your portfolio,')}<br><em>${splitChars('live in five minutes.', 320)}</em></h1>
      <p class="hero-sub">Pick a template, type your details, and you have a portfolio you can share, print, or host anywhere. No design skills. No code. No account.</p>
      <div class="hero-cta">
        <button class="btn btn-primary" data-act="new" data-magnet="0.22">${UI.spark}Start building</button>
        <a class="btn" href="#templates">Browse the templates</a>
      </div>
      <div class="hero-proof">
        <span>${UI.shield}<b>Nothing uploaded</b> — saved in your browser</span>
        <span>${UI.layers}<b>${TEMPLATES.length}</b> hand-built templates</span>
        <span>${UI.download}One-file export</span>
      </div>
    </div>

    <div class="stage" id="stage">
      <div class="mockup" id="mockup" data-tilt data-tilt-max="10">
        <span class="mockup-back two"></span>
        <span class="mockup-back"></span>
        <div class="mockup-layer">
          <div class="mockup-bar"><i></i><i></i><i></i><span class="mockup-url">portfolioly.app/#/p/your-name</span></div>
          <div class="mockup-screen" id="hero-screen"></div>
        </div>
        <span class="chip-3d c1">${UI.palette}Change the design</span>
        <span class="chip-3d c2">${UI.check}Publish instantly</span>
        <span class="chip-3d c3">${UI.download}Download one file</span>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee-track" id="marquee"></div>
  </div>

<section class="carousel-section" id="carousel">
    <div class="carousel-head">
      <div>
        <span class="section-num">01 — Templates</span>
        <h2>Spin the <em>showroom</em></h2>
      </div>
      <p style="margin:0;color:var(--faint);font-size:13.5px;max-width:34ch">Drag it, or use the arrows. Every design is free — switch later without losing your content.</p>
    </div>
    <div class="carousel-stage" id="car-stage">
      <div class="carousel-ring" id="car-ring"></div>
    </div>
    <div class="carousel-nav">
      <button class="car-btn" id="car-prev" aria-label="Previous template">${UI.arrow.replace('<svg ', '<svg style="transform:rotate(180deg)" ')}</button>
      <div class="car-dots" id="car-dots"></div>
      <button class="car-btn" id="car-next" aria-label="Next template">${UI.arrow}</button>
    </div>
    <p class="car-hint">Drag to spin · click a card to use it</p>
  </section>

  <section class="section">
    <div class="steps" data-reveal>
      <div class="step"><span class="n">01</span><b>${UI.palette}Pick a look</b><p>Five templates built for developers, photographers, students, founders and creators.</p></div>
      <div class="step"><span class="n">02</span><b>${UI.pencil}Fill it in</b><p>Name, photo, projects, skills. The preview updates the moment you type.</p></div>
      <div class="step"><span class="n">03</span><b>${UI.rocket}Publish</b><p>Share a link, download a single HTML file, or print it to PDF.</p></div>
    </div>
  </section>

  <section class="section" id="mine" hidden>
    <div class="section-head">
      <div>
        <span class="section-num">Saved locally</span>
        <h2>Your <em>portfolios</em></h2>
        <p>Stored in this browser. Use Backup to keep a copy before clearing site data.</p>
      </div>
    </div>
    <div class="grid" id="my-grid"></div>
  </section>

  <section class="section" id="templates">
    <div class="section-head">
      <div>
        <span class="section-num">02 — Browse</span>
        <h2>Every <em>template</em></h2>
        <p>Every template is free. Switch later without losing a word of your content.</p>
      </div>
      <div class="filters" id="filters">
        ${CATEGORIES.map(c => `<button class="chip${c === 'All' ? ' is-active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>
    </div>
    <div class="grid" id="tpl-grid"></div>
  </section>

<section class="site-cta" data-reveal>
    <div class="site-cta-in">
      <div>
        <h3>${esc(CONTACT.siteCta)}</h3>
        <p>Free to use. No sign-up. We answer within a day.</p>
      </div>
      <a class="btn btn-primary mail" href="mailto:${attr(CONTACT.email)}" data-magnet="0.2">${UI.link}${esc(CONTACT.email)}</a>
    </div>
  </section>

  <p class="footer-note">Built with plain HTML, CSS and JavaScript · Data stays in your browser</p>
  `;

  /* ---------------- hero mockup: a live template, in 3D ---------------- */
  const screen = $('#hero-screen', root);
  if (screen) {
    const ifr = document.createElement('iframe');
    ifr.setAttribute('tabindex', '-1');
    ifr.setAttribute('aria-hidden', 'true');
    ifr.setAttribute('sandbox', 'allow-scripts');
    ifr.setAttribute('scrolling', 'no');
    ifr.title = 'Live template preview';
    ifr.srcdoc = previewDocument(demoData(hero));
    screen.appendChild(ifr);
  }

  /* pointer-driven tilt across the whole stage, so it tracks from a distance */
  const stage = $('#stage', root);
  const mockup = $('#mockup', root);
  if (stage && mockup) {
    const max = 11;
    stage.addEventListener('pointermove', (ev) => {
      const r = stage.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      mockup.classList.add('is-live');
      mockup.style.transform =
        `rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max * 1.5).toFixed(2)}deg) translateZ(10px)`;
    });
    stage.addEventListener('pointerleave', () => {
      mockup.classList.remove('is-live');
      mockup.style.transform = '';
    });
  }

  /* ---------------- marquee content ---------------- */
  const words = TEMPLATES.flatMap(t => [t.name, t.category]);
  $('#marquee', root).innerHTML = [...words, ...words].map(w => `<span>${esc(w)}</span>`).join('');

  /* ---------------- template cards ---------------- */
  const tplGrid = $('#tpl-grid', root);
  let activeCat = 'All';
  const visibleTemplates = () => TEMPLATES.filter(t => activeCat === 'All' || t.category === activeCat);

  function drawTemplates() {
    tplGrid.innerHTML = visibleTemplates().map((t, i) => `
      <article class="card" data-reveal data-tilt data-tilt-max="7" data-spotlight style="transition-delay:${i * 55}ms">
        <div class="thumb">
          <span class="badge badge-free">Free</span>
          <span class="thumb-slot" data-tpl="${t.id}"></span>
        </div>
        <div class="card-body">
          <div class="card-title">${esc(t.name)}</div>
          <div class="card-cat">${esc(t.category)}</div>
          <div class="card-actions">
            <button class="btn btn-sm btn-primary" data-use="${t.id}">Use template</button>
            <button class="btn btn-sm" data-preview="${t.id}">Preview</button>
          </div>
        </div>
      </article>`).join('');

    $$('.thumb-slot', tplGrid).forEach(slot => {
      const tpl = getTemplate(slot.dataset.tpl);
      slot.replaceWith(thumbFrame(tpl, demoData(tpl)));
    });
    mountTilt(tplGrid);
    revealNow($$('[data-reveal]', tplGrid));
  }

  function drawMine() {
    const section = $('#mine', root);
    const grid = $('#my-grid', root);
    const items = store.list();
    if (!items.length) { section.hidden = true; grid.innerHTML = ''; return; }
    section.hidden = false;

    grid.innerHTML = items.map(pf => `
      <article class="card" data-reveal data-tilt data-tilt-max="6" data-spotlight>
        <div class="thumb">
          <span class="badge">${esc(new Date(pf.updatedAt).toLocaleDateString())}</span>
          <span class="thumb-slot" data-id="${esc(pf.id)}"></span>
        </div>
        <div class="card-body">
          <div class="card-title">${esc(pf.profile?.name || 'Untitled')}</div>
          <div class="card-cat">${esc(pf.profile?.role || 'Portfolio')} · #/p/${esc(pf.slug)}</div>
          <div class="card-actions">
            <button class="btn btn-sm btn-primary" data-open="${esc(pf.id)}">Edit</button>
            <button class="btn btn-sm" data-view="${esc(pf.slug)}">View</button>
            <button class="btn btn-sm" data-dup="${esc(pf.id)}">Copy</button>
            <button class="btn btn-sm btn-danger" data-del="${esc(pf.id)}">Delete</button>
          </div>
        </div>
      </article>`).join('');

    $$('.thumb-slot', grid).forEach(slot => {
      const pf = store.get(slot.dataset.id);
      if (!pf) return slot.remove();
      slot.replaceWith(thumbFrame(getTemplate(pf.templateId), pf));
    });
    mountTilt(grid);
    revealNow($$('[data-reveal]', grid));
  }

  drawTemplates();
  drawMine();
  mountCarousel(root);
  revealNow($$('.section [data-reveal]', root));

  /* ---------------------------- events ---------------------------- */
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.cat) {
      activeCat = btn.dataset.cat;
      $$('#filters .chip', root).forEach(c => c.classList.toggle('is-active', c === btn));
      drawTemplates();
      return;
    }
    if (btn.dataset.use) return startNew(btn.dataset.use);
    if (btn.dataset.preview) return openPreview(getTemplate(btn.dataset.preview));
    if (btn.dataset.open) { store.setCurrent(btn.dataset.open); return navigate(`#/edit/${btn.dataset.open}`); }
    if (btn.dataset.view) return navigate(`#/p/${btn.dataset.view}`);
    if (btn.dataset.dup) { store.duplicate(btn.dataset.dup); drawMine(); return toast('Duplicated', 'ok'); }
    if (btn.dataset.del) {
      const pf = store.get(btn.dataset.del);
      if (window.confirm(`Delete "${pf?.profile?.name || 'this portfolio'}"? This cannot be undone.`)) {
        store.remove(btn.dataset.del);
        drawMine();
        toast('Deleted', 'ok');
      }
      return;
    }
    if (btn.dataset.act === 'new') return startNew();
    if (btn.dataset.act === 'backup') {
      download(`portfolioly-backup-${new Date().toISOString().slice(0, 10)}.json`, buildBackupJSON(store.list()), 'application/json');
      return toast('Backup downloaded', 'ok');
    }
    if (btn.dataset.act === 'import') return $('#import-file', root).click();
  });

  $('#import-file', root).addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const n = store.importJSON(parsed.portfolios || parsed);
      toast(`Imported ${n} portfolio${n === 1 ? '' : 's'}`, 'ok');
      drawMine();
    } catch {
      toast('That file could not be read', 'err');
    }
    e.target.value = '';
  });

  function startNew(templateId) {
    const pf = store.save(blankPortfolio({
      templateId: templateId || 'dev-dark',
      slug: uniqueSlug(slugify('my-portfolio')),
    }));
    store.setCurrent(pf.id);
    navigate(`#/edit/${pf.id}`);
  }
}

/* ---------- 3D tilt + spotlight for the cards ---------- */
function mountTilt(scope) {
  $$('[data-tilt]', scope).forEach(el => {
    if (el._tiltBound) return;
    el._tiltBound = true;
    const max = parseFloat(el.dataset.tiltMax || '7');
    el.addEventListener('pointermove', (ev) => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translate3d(0,-4px,0)`;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/** Elements already on screen when the page renders should not wait for a scroll. */
function revealNow(els) {
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 900) * 0.95) el.classList.add('is-in');
  });
}

/* -------------------------- preview modal -------------------------- */
function openPreview(tpl) {
  const data = demoData(tpl);
  const back = document.createElement('div');
  back.className = 'modal-backdrop';
  back.innerHTML = `
    <div class="modal" style="width:min(1120px,96vw);height:min(90vh,860px);display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <h3 style="margin:0">${esc(tpl.name)}</h3>
        <span style="color:var(--faint);font-size:13px;font-family:var(--mono)">${esc(tpl.category)}</span>
        <div style="margin-left:auto;display:flex;gap:8px">
          <button class="btn btn-sm btn-primary" data-use>Use this template</button>
          <button class="btn btn-sm" data-close>Close</button>
        </div>
      </div>
      <p style="margin:10px 0 12px">${esc(tpl.blurb)}</p>
      <div style="flex:1;min-height:0;border:1px solid var(--line);border-radius:12px;overflow:hidden"></div>
    </div>`;
  document.body.appendChild(back);

  const holder = $('.modal > div:last-child', back);
  const ifr = document.createElement('iframe');
  ifr.setAttribute('sandbox', 'allow-scripts');
  ifr.style.cssText = 'width:100%;height:100%;border:0;background:#fff';
  ifr.srcdoc = previewDocument({ ...data, templateId: tpl.id });
  holder.appendChild(ifr);

  const close = () => back.remove();
  back.addEventListener('click', (e) => {
    if (e.target === back || e.target.closest('[data-close]')) return close();
    if (e.target.closest('[data-use]')) {
      const pf = store.save(blankPortfolio({ templateId: tpl.id, slug: uniqueSlug(slugify('my-portfolio')) }));
      store.setCurrent(pf.id);
      close();
      navigate(`#/edit/${pf.id}`);
    }
  });
  const onKey = (ev) => { if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

/* ---------------- 3D carousel ---------------- */
function mountCarousel(root) {
  const stage = $('#car-stage', root);
  const ring = $('#car-ring', root);
  const dots = $('#car-dots', root);
  if (!stage || !ring) return;

  const n = TEMPLATES.length;
  const step = 360 / n;
  let angle = 0;
  let radius = Math.max(250, Math.min(520, (stage.clientWidth || 1000) * 0.42));

  ring.innerHTML = TEMPLATES.map((t, i) => `
    <article class="carousel-card" data-i="${i}" data-use="${t.id}">
      <div class="carousel-inner">
        <div class="cc-screen" data-slot="${t.id}"></div>
        <div class="cc-foot"><b>${esc(t.name)}</b><span>${esc(t.category)}</span></div>
      </div>
    </article>`).join('');

  dots.innerHTML = TEMPLATES.map((t, i) =>
    `<button class="car-dot${i === 0 ? ' is-on' : ''}" data-i="${i}" aria-label="${esc(t.name)}"></button>`).join('');

  $$('.cc-screen', ring).forEach(slot => {
    const tpl = getTemplate(slot.dataset.slot);
    const ifr = document.createElement('iframe');
    ifr.setAttribute('scrolling', 'no');
    ifr.setAttribute('tabindex', '-1');
    ifr.setAttribute('aria-hidden', 'true');
    ifr.srcdoc = thumbnailDocument(demoData(tpl));
    slot.appendChild(ifr);
  });

  const frontIndex = () => ((Math.round(-angle / step) % n) + n) % n;

  function paint(animate = true) {
    ring.style.transition = animate ? 'transform .62s cubic-bezier(.22,1,.36,1)' : 'none';
    ring.style.transform = `rotateY(${angle}deg)`;
    const idx = frontIndex();
    $$('.carousel-card', ring).forEach((c, i) => {
      const rel = ((i - idx) % n + n) % n;
      const back = rel > n / 2 ? rel - n : rel;
      const isFront = Math.abs(back) < 0.5;
      c.classList.toggle('is-front', isFront);
      c.classList.toggle('is-back', Math.abs(back) >= 2);
    });
    $$('.car-dot', dots).forEach((d, i) => d.classList.toggle('is-on', i === idx));
  }

  function goto(i) {
    let d = i - frontIndex();
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    angle -= d * step;
    paint(true);
  }

  function stepBy(delta) {
    angle -= delta * step;
    paint(true);
  }

  /* drag / swipe */
  let dragging = false, lastX = 0, moved = 0;
  const onDown = (x) => {
    dragging = true; moved = 0; lastX = x;
    stage.classList.add('is-dragging');
    ring.style.transition = 'none';
  };
  const onMove = (x) => {
    if (!dragging) return;
    const dx = x - lastX;
    lastX = x; moved += Math.abs(dx);
    angle += dx * 0.24;
    paint(false);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    const target = Math.round(angle / step) * step;
    angle = target;
    paint(true);
  };

  stage.addEventListener('pointerdown', (e) => onDown(e.clientX));
  window.addEventListener('pointermove', (e) => onMove(e.clientX));
  window.addEventListener('pointerup', onUp);
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  $('#car-prev', root)?.addEventListener('click', () => stepBy(-1));
  $('#car-next', root)?.addEventListener('click', () => stepBy(1));
  dots.addEventListener('click', (e) => {
    const d = e.target.closest('.car-dot');
    if (d) goto(Number(d.dataset.i));
  });

  /* click a card to use it — but only if the pointer did not travel */
  ring.addEventListener('click', (e) => {
    if (moved > 6) return;
    const card = e.target.closest('[data-use]');
    if (!card) return;
    const i = Number(card.dataset.i);
    const idx = frontIndex();
    if (i !== idx) { goto(i); return; }
    const pf = store.save(blankPortfolio({ templateId: card.dataset.use, slug: uniqueSlug(slugify('my-portfolio')) }));
    store.setCurrent(pf.id);
    navigate(`#/edit/${pf.id}`);
  });

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      radius = Math.max(250, Math.min(520, stage.clientWidth * 0.42));
      layout();
    }).observe(stage);
  }

  function layout() {
    $$('.carousel-card', ring).forEach((c, i) => {
      c.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
  }

  layout();
  paint(false);
}
