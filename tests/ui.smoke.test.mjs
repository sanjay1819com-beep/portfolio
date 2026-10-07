/* tests/ui.smoke.test.mjs — drives the real pages/*.js code in a real DOM (jsdom)
   and simulates typing and clicking. Needs the optional dev dependency jsdom:
       npm install --no-save jsdom
   Run:  node tests/ui.smoke.test.mjs
   The app itself never needs jsdom — this file skips politely without it. */

let JSDOM;
try { ({ JSDOM } = await import('jsdom')); }
catch { console.log('  (skipped — jsdom not installed. Run: npm install --no-save jsdom)'); process.exit(0); }

const dom = new JSDOM('<!DOCTYPE html><body><div id="app"></div><div id="toast-root"></div></body>', {
  url: 'http://localhost:8000/',
  pretendToBeVisual: true,
});
const { window } = dom;

globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
globalThis.location = window.location;
globalThis.localStorage = window.localStorage;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Node = window.Node;
globalThis.Blob = window.Blob;
globalThis.FileReader = window.FileReader;
globalThis.URL.createObjectURL = () => 'blob:stub';
globalThis.URL.revokeObjectURL = () => {};

const { store } = await import('../core/store.js');
const { TEMPLATES, getTemplate, demoData } = await import('../templates/registry.js');
const { buildStandaloneHTML } = await import('../core/export.js');
const { MOTION_CSS, MOTION_JS } = await import('../core/motion.js');
const { renderGallery } = await import('../pages/gallery.js');
const { renderEditor } = await import('../pages/editor.js');
const { renderPortfolio } = await import('../pages/portfolio.js');

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const app = () => $('#app');
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const type = (el, value) => { el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); };
const wait = (ms = 30) => new Promise(r => setTimeout(r, ms));

let pass = 0, failed = 0;
async function test(name, fn) {
  try { await fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${e.message}`); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

localStorage.clear();
store.seedIfEmpty();

console.log(`\nUI smoke — real DOM, ${TEMPLATES.length} templates\n`);

/* ------------------------------- landing ------------------------------- */
console.log('Landing page');

await test('renders and lists every template with a use button', () => {
  renderGallery(app(), {});
  for (const t of TEMPLATES) {
    assert(app().innerHTML.includes(t.name), `${t.id}: name missing`);
    assert($(`#tpl-grid [data-use="${t.id}"]`), `${t.id}: no "use template" button in the grid`);
    assert($(`#tpl-grid [data-preview="${t.id}"]`), `${t.id}: no preview button`);
    assert($(`.carousel-card[data-use="${t.id}"]`), `${t.id}: not in the 3D carousel`);
  }
  assert($('#tpl-grid').children.length === TEMPLATES.length, `expected ${TEMPLATES.length} cards, got ${$('#tpl-grid').children.length}`);
  assert(app().innerHTML.includes(`<b>${TEMPLATES.length}</b>`), 'template count missing from the proof row');
});

await test('shows the seeded portfolios with edit/view/delete controls', () => {
  const mine = $$('#my-grid > article');
  assert(mine.length >= 3, `expected 3 saved portfolios, found ${mine.length}`);
  assert($('#mine').hidden === false, 'saved section is hidden even though portfolios exist');
  assert($$('[data-del]').length >= 3, 'delete buttons missing');
});

await test('contains no payment / premium / unlock wording', () => {
  assert(!/premium|unlock|₹|pay now|buy template/i.test(app().innerHTML), 'payment wording found on the landing page');
});

await test('category filter narrows the template grid', () => {
  const target = TEMPLATES[0];
  const chip = $$('#filters .chip').find(c => c.dataset.cat === target.category);
  assert(chip, `no filter chip for "${target.category}"`);
  click(chip);
  const shown = $$('#tpl-grid [data-use]').map(b => b.dataset.use);
  assert(shown.length === 1 && shown[0] === target.id, `filter left ${shown.length} templates: ${shown}`);
  click($$('#filters .chip').find(c => c.dataset.cat === 'All'));
  assert($$('#tpl-grid [data-use]').length === TEMPLATES.length, 'All filter did not restore the full grid');
});

await test('template cards get a live iframe preview with real CSS', () => {
  const frames = $$('#tpl-grid iframe');
  assert(frames.length === TEMPLATES.length, `expected ${TEMPLATES.length} preview frames, got ${frames.length}`);
  assert(frames[0].srcdoc.includes('<!DOCTYPE html>'), 'preview frame has no document');
  assert(frames[0].srcdoc.length > 4000, `preview document looks empty (${frames[0].srcdoc.length} chars)`);
});

await test('the 3D carousel lays out every template around a ring', () => {
  renderGallery(app(), {});
  const cards = $$('.carousel-card');
  assert(cards.length === TEMPLATES.length, `expected ${TEMPLATES.length} carousel cards, got ${cards.length}`);
  const t0 = cards[0].style.transform;
  const t1 = cards[1].style.transform;
  assert(/rotateY\(0deg\) translateZ\(\d+px\)/.test(t0), `card 0 has no ring transform: "${t0}"`);
  assert(/rotateY\(72deg\)/.test(t1), `card 1 should sit 72deg round the ring, got "${t1}"`);
  assert(cards[0].classList.contains('is-front'), 'card 0 should start at the front');
  assert(cards[2].classList.contains('is-back'), 'the far-side card should be marked as behind');
});

await test('the carousel arrows rotate the ring and move the front card', () => {
  renderGallery(app(), {});
  const ring = $('#car-ring');
  const before = ring.style.transform;
  click($('#car-next'));
  assert(ring.style.transform !== before, 'next arrow did not rotate the ring');
  assert(ring.style.transform === 'rotateY(-72deg)', `expected -72deg after one step, got ${ring.style.transform}`);
  assert($$('.carousel-card')[1].classList.contains('is-front'), 'the front card did not advance');
  click($('#car-prev'));
  assert(ring.style.transform === 'rotateY(0deg)', `prev did not return to 0deg, got ${ring.style.transform}`);
  assert($$('.carousel-card')[0].classList.contains('is-front'), 'the front card did not come back');
});

await test('dragging spins the carousel and snapping lands on a card', () => {
  renderGallery(app(), {});
  const stage = $('#car-stage');
  const ring = $('#car-ring');
  const down = new window.MouseEvent('pointerdown', { bubbles: true, clientX: 500 });
  stage.dispatchEvent(down);
  assert(stage.classList.contains('is-dragging'), 'drag state not applied');
  window.dispatchEvent(new window.MouseEvent('pointermove', { bubbles: true, clientX: 300 }));
  const mid = parseFloat(ring.style.transform.replace(/[^0-9.-]/g, ''));
  assert(mid !== 0, `dragging did not change the angle (got ${ring.style.transform})`);
  window.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true }));
  const snapped = parseFloat(ring.style.transform.replace(/[^0-9.-]/g, ''));
  assert(Math.abs(snapped % 72) < 0.001, `release did not snap to a card boundary: ${snapped}`);
  assert(!stage.classList.contains('is-dragging'), 'drag state not cleared');
});

await test('the contact CTA on the website points at a real mailto', () => {
  renderGallery(app(), {});
  const cta = $('.site-cta a.mail');
  assert(cta, 'website contact CTA missing');
  const href = cta.getAttribute('href');
  assert(/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(href), `CTA is not a valid mailto: ${href}`);
  assert(cta.textContent.includes('@'), 'CTA does not show the address');
});

await test('the editor no longer offers Export JSON', () => {
  const pf = store.list()[0];
  renderEditor(app(), { id: pf.id });
  assert(!$('[data-act="json"]'), 'Export JSON button is still there');
  assert($('[data-act="download"]'), 'Download HTML should still be there');
});

await test('the brand renders as Soft_Tech / PortfoGen on every screen', () => {
  renderGallery(app(), {});
  assert($('.brand-tag')?.textContent === 'Soft_Tech', `tag is "${$('.brand-tag')?.textContent}"`);
  assert($('.brand-name')?.textContent === 'PortfoGen', `name is "${$('.brand-name')?.textContent}"`);
  assert($('.brand-mark')?.textContent === 'S', 'brand mark letter is wrong');
  assert(!app().innerHTML.includes('Portfolioly'), 'old product name still on the landing page');
  renderEditor(app(), { id: store.list()[0].id });
  assert($('.brand-name')?.textContent === 'PortfoGen', 'editor brand wrong');
  assert(!app().innerHTML.includes('Portfolioly'), 'old product name still in the editor');
});

await test('the Headings section exposes every editable label', () => {
  renderEditor(app(), { id: store.list()[0].id });
  click($('[data-sec="headings"]'));
  const inputs = $$('[data-key^="labels."]');
  assert(inputs.length >= 15, `expected at least 15 heading fields, got ${inputs.length}`);
  assert($('[data-key="labels.experienceTitle"]'), 'no field for the experience heading');
  const f = $('[data-key="labels.experienceTitle"]');
  type(f, 'Internships');
  assert(f.value === 'Internships', 'typing into the heading field did not stick');
});

/* --------------------- motion & 3D --------------------- */
console.log('\nMotion & 3D');

await test('landing page builds the 3D mockup stage with a live template inside', () => {
  renderGallery(app(), {});
  assert($('#stage'), 'no 3D stage');
  assert($('#mockup[data-tilt]'), 'mockup is not tilt-enabled');
  const chips = $$('.chip-3d');
  assert(chips.length >= 3, `expected 3 orbiting chips, got ${chips.length}`);
  const screen = $('#hero-screen iframe');
  assert(screen, 'hero mockup has no screen');
  assert(screen.getAttribute('sandbox') === 'allow-scripts', 'hero iframe is not allowed to run the motion engine');
  assert(screen.srcdoc.includes('__motion'), 'hero screen is missing the motion engine');
});

await test('template cards are tilt + spotlight enabled', () => {
  renderGallery(app(), {});
  const cards = $$('#tpl-grid .card');
  assert(cards.length === TEMPLATES.length, 'wrong card count');
  for (const c of cards) {
    assert(c.hasAttribute('data-tilt'), 'card is not tilt-enabled');
    assert(c.hasAttribute('data-spotlight'), 'card is not spotlight-enabled');
  }
});

await test('thumbnail frames are script-free, live previews are not', () => {
  renderGallery(app(), {});
  const thumbs = $$('#tpl-grid iframe');
  assert(thumbs[0].srcdoc.includes('__motion') === false, 'thumbnails should not run JS — five animated iframes is wasteful');
  assert(thumbs[0].getAttribute('sandbox') === null || !thumbs[0].getAttribute('sandbox'), 'thumbnails should not be sandboxed');
  const hero = $('#hero-screen iframe');
  assert(hero.srcdoc.includes('__motion'), 'hero preview should run JS');
});

await test('motion engine is present and honours prefers-reduced-motion', () => {
  assert(MOTION_CSS.includes('@media(prefers-reduced-motion:reduce)'), 'no reduced-motion fallback in the CSS');
  assert(MOTION_JS.includes("prefers-reduced-motion: reduce"), 'JS never checks the reduced-motion preference');
  assert(MOTION_JS.includes('window.__motion'), 'motion engine is not re-runnable after a route change');
});

await test('every template ships the motion engine and 3D/motion hooks', () => {
  for (const t of TEMPLATES) {
    const pf = { ...demoData(t), slug: t.id, templateId: t.id };
    const html = buildStandaloneHTML(pf);
    assert(html.includes('__motion'), `${t.id}: export is missing the motion engine`);
    assert(html.includes('data-reveal') || html.includes('data-count') || html.includes('data-tilt'),
      `${t.id}: template has no motion hooks at all`);
    assert(html.includes('<script>'), `${t.id}: motion script tag missing`);
    assert(!/<\/script>/.test(html.split('<script>')[0]), `${t.id}: stray script close tag in the head`);
  }
});

await test('animated counters are wired to the stat blocks', () => {
  let withCounters = 0;
  for (const t of TEMPLATES) {
    const html = getTemplate(t.id).render(demoData(t));
    if (html.includes('data-count')) withCounters++;
  }
  assert(withCounters === TEMPLATES.length, `only ${withCounters}/${TEMPLATES.length} templates animate their stats`);
});

/* ------------------------------- editor -------------------------------- */
console.log('\nEditor');

let pfId;
await test('"Use template" creates a portfolio and opens the editor', () => {
  renderGallery(app(), {});
  location.hash = '#/';
  click($(`#tpl-grid [data-use="${TEMPLATES[1].id}"]`));
  renderEditor(app(), { id: store.getCurrentId() });
  pfId = store.getCurrentId();
  assert(pfId, 'no portfolio id was created');
  const pf = store.get(pfId);
  assert(pf.templateId === TEMPLATES[1].id, `wrong template: ${pf.templateId}`);
  assert($('#form'), 'editor form did not render');
  assert($('#preview'), 'preview iframe did not render');
});

await test('typing in the name field updates the live preview', async () => {
  const input = $('#f_profile_name');
  assert(input, 'name input missing');
  type(input, 'Priya Sharma');
  await wait(200);
  assert($('#preview').srcdoc.includes('Priya Sharma'), 'preview did not update with the new name');
  await wait(400); // the store write is debounced at 350ms
  assert(store.get(pfId).profile.name === 'Priya Sharma', 'name was not saved to the store');
});

await test('adding a project shows up in the preview', async () => {
  click($('[data-sec="work"]'));
  const addBtn = $('[data-add="projects"]');
  assert(addBtn, 'no "add project" button');
  click(addBtn);
  const titleInput = $('[data-key="projects.0.title"]');
  assert(titleInput, 'project title input missing');
  type(titleInput, 'Chai Tracker');
  await wait(450);
  assert(store.get(pfId).projects.length === 1, 'project was not added to the store');
  assert(store.get(pfId).projects[0].title === 'Chai Tracker', 'project title was not saved');
  assert($('#preview').srcdoc.includes('Chai Tracker'), 'project missing from the preview');
});

await test('switching section rebuilds the form without losing data', () => {
  click($('[data-sec="design"]'));
  assert($('#f_theme_accent'), 'accent colour control missing in Design');
  click($('[data-sec="basics"]'));
  assert($('#f_profile_name').value === 'Priya Sharma', 'name was lost when switching sections');
});

await test('template picker offers all templates and keeps content when switching', async () => {
  click($('[data-sec="template"]'));
  const minis = $$('[data-tpl]');
  assert(minis.length === TEMPLATES.length, `expected ${TEMPLATES.length} template tiles, got ${minis.length}`);
  const next = minis.find(m => m.dataset.tpl !== store.get(pfId).templateId);
  click(next);
  await wait(450);
  const pf = store.get(pfId);
  assert(pf.templateId === next.dataset.tpl, 'template did not switch');
  assert(pf.profile.name === 'Priya Sharma', 'content was lost when switching templates');
  assert(pf.projects[0].title === 'Chai Tracker', 'project was lost when switching templates');
  assert($('#preview').srcdoc.includes('Priya Sharma'), 'preview lost content after the switch');
});

await test('accent colour change reaches the template CSS', async () => {
  click($('[data-sec="design"]'));
  const color = $('#f_theme_accent');
  color.value = '#ff00aa';
  color.dispatchEvent(new window.Event('change', { bubbles: true }));
  await wait(200);
  assert($('#preview').srcdoc.includes('#ff00aa'), 'accent colour did not reach the preview CSS');
});

await test('device switcher toggles the preview size', () => {
  click($('[data-dev="mobile"]'));
  assert($('#device').className.includes('is-mobile'), 'device class not applied');
  click($('[data-dev="desktop"]'));
  assert($('#device').className.includes('is-desktop'), 'device class not restored');
});

/* ------------------------------ published ------------------------------ */
console.log('\nPublished page');

await test('renders the portfolio into the public frame', () => {
  const pf = store.get(pfId);
  renderPortfolio(app(), { slug: pf.slug });
  const frame = $('#pub-frame');
  assert(frame, 'public frame missing');
  assert(frame.srcdoc.includes('Priya Sharma'), 'published frame missing the content');
  assert(frame.srcdoc.includes('<style>'), 'published frame has no CSS');
  assert(document.body.classList.contains('has-pub'), 'full-bleed class not applied');
});

await test('unknown slug shows a helpful empty state', () => {
  renderPortfolio(app(), { slug: 'not-a-real-person' });
  assert(app().innerHTML.includes('No portfolio at that link'), 'empty state missing');
});

await test('delete removes the portfolio and its live page', () => {
  const slug = store.get(pfId).slug;
  store.remove(pfId);
  assert(store.get(slug) === null, 'portfolio still readable after delete');
  renderPortfolio(app(), { slug });
  assert(app().innerHTML.includes('No portfolio at that link'), 'deleted portfolio still renders');
});

console.log(`\n${pass} passed, ${failed} failed\n`);
if (failed) process.exit(1);
