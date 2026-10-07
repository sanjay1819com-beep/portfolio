/* tests/render.test.mjs — renders every template in Node and checks the output.
   Run:  node tests/render.test.mjs   */

import assert from 'node:assert/strict';
import { TEMPLATES, demoData, getTemplate, CATEGORIES } from '../templates/registry.js';
import { blankPortfolio, samplePortfolios, store } from '../core/store.js';
import { buildStandaloneHTML } from '../core/export.js';
import { esc, attr, slugify, toList, placeholderImage, placeholderPhoto, img } from '../core/utils.js';
import { SCHEMA, setPath, getPath } from '../core/schema.js';
import { DEFAULT_LABELS, TEMPLATE_LABELS, sectionLabels } from '../core/labels.js';

// --- minimal browser shims so store.js can run outside a browser -----------
// NOTE: store.js must detect storage at *call* time, not import time — ES module
// imports are hoisted, so this shim is installed after store.js has been evaluated.
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
};

let pass = 0;
const failures = [];
function test(name, fn) {
  try { fn(); pass++; console.log(`  ✓ ${name}`); }
  catch (err) { failures.push([name, err]); console.log(`  ✗ ${name}\n      ${err.message}`); }
}

console.log(`\nPortfolioly — ${TEMPLATES.length} templates, ${SCHEMA.length} editor sections\n`);

/* ---------------------------------------------------------------- 1 */
console.log('Registry');
test('every template has the fields the gallery and editor need', () => {
  for (const t of TEMPLATES) {
    assert.ok(t.id, 'missing id');
    assert.ok(t.name, 'missing name');
    assert.ok(t.category, 'missing category');
    assert.ok(t.blurb, 'missing blurb');
    assert.equal(typeof t.render, 'function', `${t.id}: render must be a function`);
    assert.equal(typeof t.css, 'function', `${t.id}: css must be a function`);
    assert.ok(Array.isArray(t.tags) && t.tags.length, `${t.id}: needs a tags array`);
  }
});
test('template ids are unique and getTemplate falls back safely', () => {
  const ids = TEMPLATES.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate template ids');
  assert.equal(getTemplate('does-not-exist').id, TEMPLATES[0].id, 'unknown id should fall back to the first template');
});
test('CATEGORIES lists every template category exactly once', () => {
  const cats = new Set(TEMPLATES.map(t => t.category));
  assert.equal(CATEGORIES.length, cats.size + 1); // + "All"
});
test('no template is marked premium (all free)', () => {
  for (const t of TEMPLATES) assert.equal(t.premium, undefined, `${t.id} should not be premium`);
});

/* ---------------------------------------------------------------- 2 */
console.log('\nRendering');
for (const t of TEMPLATES) {
  const data = demoData(t);

  test(`${t.id}: renders markup and CSS`, () => {
    const html = t.render(data);
    const css = t.css(data);
    assert.ok(html.length > 1500, `${t.id}: markup looks too short (${html.length} chars)`);
    assert.ok(css.length > 1500, `${t.id}: css looks too short (${css.length} chars)`);
    assert.ok(css.includes('<style>') === false, 'css() must return raw CSS, not a <style> tag');
  });

  test(`${t.id}: no undefined/NaN leaked into the output`, () => {
    for (const out of [t.render(data), t.css(data)]) {
      assert.ok(!/\bundefined\b/.test(out), 'found the word "undefined" in the output');
      assert.ok(!/\bNaN\b/.test(out), 'found NaN in the output');
      assert.ok(!/\[object Object\]/.test(out), 'found a raw object in the output');
    }
  });

  test(`${t.id}: accent colour and font choice reach the CSS`, () => {
    const css = t.css({ ...data, theme: { ...data.theme, accent: '#ff00aa', radius: 3 } });
    assert.ok(css.includes('#ff00aa'), 'accent colour not applied');
    assert.ok(css.includes('3px'), 'corner radius not applied');
  });

  test(`${t.id}: dark flag switches the background`, () => {
    const light = t.css({ ...data, theme: { ...data.theme, dark: false } });
    const dark = t.css({ ...data, theme: { ...data.theme, dark: true } });
    assert.notEqual(light, dark, 'dark flag has no effect on the CSS');
  });

  test(`${t.id}: renders fine with an almost-empty portfolio`, () => {
    const empty = blankPortfolio({ templateId: t.id });
    empty.profile = { name: 'Solo' };
    empty.sections = {};
    const html = t.render(empty);
    assert.ok(html.includes('Solo'), 'name missing from the sparse render');
    assert.ok(!/\bundefined\b/.test(html), 'undefined leaked with empty data');
  });

  test(`${t.id}: every section can be switched off`, () => {
    const off = JSON.parse(JSON.stringify(data));
    Object.keys(off.sections).forEach(k => { off.sections[k] = false; });
    const html = t.render(off);
    assert.ok(html.length > 200, 'template produced nothing when all sections are off');
    assert.ok(!/\bundefined\b/.test(html));
  });

  test(`${t.id}: XSS in user input is escaped`, () => {
    const evil = JSON.parse(JSON.stringify(data));
    evil.profile.name = '<script>alert(1)</script>';
    evil.profile.about = '"><img src=x onerror=alert(2)>';
    evil.projects[0].title = '<b onmouseover=alert(3)>boom</b>';
    evil.socials = [{ label: 'x', url: 'javascript:alert(4)', icon: 'github' }];
    const html = t.render(evil);

    // The payload text may still appear as inert, escaped text — that is fine.
    // What must never appear is a live tag or an attribute breakout.
    assert.ok(!html.includes('<script>alert(1)</script>'), 'raw <script> tag survived');
    assert.ok(!/<img\s+src=x\s+onerror/i.test(html), 'raw <img onerror> tag survived');
    assert.ok(!html.includes('"><img src=x onerror'), 'attribute breakout survived — a quote was not escaped');
    assert.ok(!/<b\s+onmouseover/i.test(html), 'raw <b onmouseover> tag survived');
    assert.ok(!/href="javascript:/i.test(html), 'javascript: URL reached an href');
  });
}

/* ---------------------------------------------------------------- 3 */
console.log('\nStore');
test('seed creates sample portfolios and they render', () => {
  store.seedIfEmpty();
  const list = store.list();
  assert.ok(list.length >= 3, `expected at least 3 seeded portfolios, got ${list.length}`);
  for (const pf of list) {
    const tpl = getTemplate(pf.templateId);
    const html = tpl.render(pf);
    assert.ok(html.length > 1500, `${pf.slug}: seeded portfolio rendered too little`);
    assert.ok(!/\bundefined\b/.test(html));
  }
});
test('save / get / duplicate / remove round-trip', () => {
  const pf = store.save(blankPortfolio({ slug: 'round-trip-test' }));
  assert.equal(store.get('round-trip-test').id, pf.id, 'lookup by slug failed');
  assert.equal(store.get(pf.id).slug, 'round-trip-test', 'lookup by id failed');
  const copy = store.duplicate(pf.id);
  assert.notEqual(copy.id, pf.id, 'duplicate kept the same id');
  assert.notEqual(copy.slug, pf.slug, 'duplicate kept the same slug');
  store.remove(copy.id);
  assert.equal(store.get(copy.id), null, 'removed portfolio is still readable');
  store.remove(pf.id);
});
test('slugs stay unique', () => {
  const a = store.save(blankPortfolio({ slug: 'dup-slug' }));
  const b = store.save(blankPortfolio({ slug: 'dup-slug-2' }));
  const slugs = store.list().map(p => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'two portfolios share a slug');
  store.remove(a.id); store.remove(b.id);
});

/* ---------------------------------------------------------------- 4 */
console.log('\nExport');
test('buildStandaloneHTML produces a complete document', () => {
  const pf = store.list()[0];
  const html = buildStandaloneHTML(pf);
  assert.ok(html.startsWith('<!DOCTYPE html>'), 'missing doctype');
  assert.ok(html.includes('<meta charset="UTF-8">'), 'missing charset');
  assert.ok(html.includes('<meta name="viewport"'), 'missing viewport — will look broken on phones');
  assert.ok(html.includes('<style>'), 'template CSS was not inlined');
  assert.ok(!/src="\.\/|href="\.\/|<link rel="stylesheet" href="\./.test(html), 'exported file still references local files');
  assert.ok(html.trim().endsWith('</html>'), 'document is not closed');
});
test('exported file carries the SEO meta tags', () => {
  const pf = store.list()[0];
  const html = buildStandaloneHTML({ ...pf, meta: { ...pf.meta, title: 'Meta Check', description: 'A description' } });
  assert.ok(html.includes('<title>Meta Check</title>'), 'title missing');
  assert.ok(html.includes('name="description" content="A description"'), 'description missing');
});

/* ---------------------------------------------------------------- 5 */
console.log('\nUtilities & schema');
test('esc escapes every dangerous character', () => {
  assert.equal(esc('<a href="x">&\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
  assert.equal(esc(null), '');
  assert.equal(esc(0), '0');
});
test('attr blocks URL schemes that can execute code', () => {
  assert.equal(attr('javascript:alert(1)'), '#', 'javascript: should be blocked');
  assert.equal(attr('JaVaScRiPt:alert(1)'), '#', 'mixed-case javascript: should be blocked');
  assert.equal(attr('java\tscript:alert(1)'), '#', 'tab-obfuscated javascript: should be blocked');
  assert.equal(attr('vbscript:msgbox(1)'), '#', 'vbscript: should be blocked');
  assert.equal(attr('data:text/html,<script>alert(1)</script>'), '#', 'data:text/html should be blocked');
  assert.equal(attr('https://ok.example/x'), 'https://ok.example/x', 'https must pass through');
  assert.equal(attr('mailto:a@b.com'), 'mailto:a@b.com', 'mailto must pass through');
  assert.equal(attr('tel:+919999999999'), 'tel:+919999999999', 'tel must pass through');
  assert.ok(attr('data:image/png;base64,AAA').startsWith('data:image/png'), 'inline data: images must be allowed');
  assert.ok(attr('data:image/svg+xml;charset=utf-8,%3Csvg%3E').startsWith('data:image/svg'), 'inline SVG placeholders must be allowed (SVG in <img> cannot execute scripts)');
  assert.equal(attr(''), '', 'empty stays empty');
});
test('generated placeholder images survive attr() — otherwise every empty cover breaks', () => {
  assert.ok(attr(placeholderImage('x')).startsWith('data:image/svg'), 'placeholderImage is being blocked');
  assert.ok(attr(placeholderPhoto('A', 'Aisha')).startsWith('data:image/svg'), 'placeholderPhoto is being blocked');
  const tag = img('', 'Some Project', 'Some Project');
  assert.ok(tag.includes('src="data:image/svg'), `empty cover did not fall back to a placeholder: ${tag.slice(0, 80)}`);
  assert.ok(!tag.includes('src="#"'), 'cover image degraded to src="#"');
});
test('slugify produces clean urls', () => {
  assert.equal(slugify('  Sanjay !! '), 'sanjay');
  assert.equal(slugify('फोटो Studio 2026'), 'studio-2026');
  assert.equal(slugify(''), '');
});
test('toList splits on commas and newlines', () => {
  assert.deepEqual(toList('React, Node,\nPostgres , '), ['React', 'Node', 'Postgres']);
  assert.deepEqual(toList(''), []);
});
test('getPath/setPath walk nested keys, including array indexes', () => {
  const o = { a: { b: 1 } };
  assert.equal(getPath(o, 'a.b'), 1);
  setPath(o, 'a.b', 2);
  assert.equal(o.a.b, 2);
  setPath(o, 'list.0.name', 'x');
  assert.equal(o.list[0].name, 'x');
});
test('every schema field maps to a real key on a blank portfolio', () => {
  const pf = blankPortfolio();
  for (const section of SCHEMA) {
    for (const field of section.fields) {
      if (field.type === 'repeater' || field.type === 'socials') {
        assert.ok(Array.isArray(getPath(pf, field.key)), `${field.key} should be an array`);
      } else if (field.key.startsWith('labels.')) {
        // Headings are intentionally absent until the user overrides one —
        // but each must resolve to a real default, never to undefined.
        const key = field.key.slice('labels.'.length);
        assert.ok(DEFAULT_LABELS[key], `${field.key} has no default label to fall back to`);
      } else {
        assert.notEqual(getPath(pf, field.key), undefined, `${field.key} does not exist on blankPortfolio()`);
      }
    }
  }
});

/* ------------------------------------------------------------------ */
console.log('\nEditable headings');
test('a user override wins over the template default', () => {
  const L = sectionLabels({ templateId: 'photo-light', labels: { experienceTitle: 'Internships' } });
  assert.equal(L('experienceTitle'), 'Internships');
});
test('the template default shows when the user has not overridden', () => {
  assert.equal(sectionLabels({ templateId: 'photo-light' })('experienceTitle'), 'Studio history',
    'photo-light should default to "Studio history"');
  assert.equal(sectionLabels({ templateId: 'dev-dark' })('experienceTitle'), "Where I've worked");
  assert.equal(sectionLabels({ templateId: 'founder-bold' })('projects'), 'Case studies');
});
test('the nav links and CTA button are editable too', () => {
  const NAV_TEMPLATES = ['dev-dark', 'photo-light', 'founder-bold'];
  for (const id of NAV_TEMPLATES) {
    const pf = JSON.parse(JSON.stringify(samplePortfolios()[0]));
    pf.templateId = id;
    pf.labels = { projects: 'ZZNAVPROJZZ', about: 'ZZNAVABOUTZZ', contact: 'ZZNAVCONZZ', contactCta: 'ZZNAVBUTTONZZ' };
    Object.keys(pf.sections).forEach(k => { pf.sections[k] = true; });
    const html = getTemplate(id).render(pf);
    assert.ok(html.includes('ZZNAVPROJZZ'), `${id}: nav does not honour the "projects" label`);
    assert.ok(html.includes('ZZNAVABOUTZZ'), `${id}: nav does not honour the "about" label`);
    assert.ok(html.includes('ZZNAVCONZZ'), `${id}: nav does not honour the "contact" label`);
    assert.ok(html.includes('ZZNAVBUTTONZZ'), `${id}: header CTA does not honour the "contactCta" label`);
  }
  // and the defaults the screenshots show must be intact
  assert.equal(sectionLabels({ templateId: 'photo-light' })('contactCta'), 'Book a shoot');
  assert.equal(sectionLabels({ templateId: 'photo-light' })('experience'), 'Studio');
  assert.equal(sectionLabels({ templateId: 'dev-dark' })('projects'), 'Work');
  assert.equal(sectionLabels({ templateId: 'founder-bold' })('contactCta'), 'Hire me');
});
test('an empty override falls back to the default (that is the "reset" affordance)', () => {
  const L = sectionLabels({ templateId: 'photo-light', labels: { experienceTitle: '   ' } });
  assert.equal(L('experienceTitle'), 'Studio history');
});
test('unknown keys never return undefined', () => {
  const L = sectionLabels({ templateId: 'dev-dark' });
  assert.equal(typeof L('no-such-key'), 'string');
  assert.ok(L('no-such-key').length > 0);
});
test('every editable section title is honoured by every template', () => {
  // Give each template a fully-populated portfolio with every section switched on,
  // so there is no excuse for a heading to be missing.
  const full = samplePortfolios()[0];
  Object.keys(DEFAULT_LABELS).filter(k => /Title$/.test(k)).forEach(key => {
    const pf = JSON.parse(JSON.stringify(full));
    pf.labels = { [key]: `ZZ${key}ZZ` };
    Object.keys(pf.sections).forEach(k => { pf.sections[k] = true; });
    for (const t of TEMPLATES) {
      const html = getTemplate(t.id).render({ ...pf, templateId: t.id });
      assert.ok(html.includes(`ZZ${key}ZZ`), `${t.id} ignores the editable heading "${key}"`);
    }
  });
});

console.log('\nProfile photo placement');
test('the profile photo is NOT used as a big hero image unless opted in', () => {
  for (const t of TEMPLATES) {
    const pf = { ...samplePortfolios()[0], templateId: t.id, theme: { accent: '#f00', dark: true, heroPhoto: false } };
    pf.profile.photo = 'https://cdn.example/face.jpg';
    pf.projects = []; // no project image to use instead
    const html = getTemplate(t.id).render(pf);
    const heroish = /class="hero-photo"|class="hero-fig"|hero-fig"/.test(html);
    assert.ok(!html.includes('face.jpg') || !heroish,
      `${t.id}: profile photo is being used as a hero image without the opt-in`);
  }
});
test('turning heroPhoto on does bring it back', () => {
  const base = { ...samplePortfolios()[0], templateId: 'photo-light', projects: [] };
  base.profile.photo = 'https://cdn.example/face.jpg';
  const off = getTemplate('photo-light').render({ ...base, theme: { ...base.theme, heroPhoto: false } });
  const on = getTemplate('photo-light').render({ ...base, theme: { ...base.theme, heroPhoto: true } });
  assert.ok(!/hero-fig/.test(off), 'hero figure rendered even with heroPhoto off');
  assert.ok(/hero-fig/.test(on) && on.includes('face.jpg'), 'hero figure did not come back with heroPhoto on');
});

console.log('\nCredit line');
test('generated portfolios carry the Soft_Tech PortfoGen contact line', () => {
  const pf = store.list()[0];
  const html = buildStandaloneHTML(pf);
  // Assert on the actual element — the class name also appears in the <style> block,
  // so a bare substring check would pass even when the credit is turned off.
  assert.ok(html.includes('class="pg-credit-wrap"'), 'credit element missing');
  assert.ok(/class="pg-credit" href="mailto:[^"]+"/.test(html), 'no mailto link in the credit');
  assert.ok(/Soft_Tech PortfoGen/.test(html), 'brand name missing from the credit');
});
test('the credit line can be switched off', () => {
  const pf = store.list()[0];
  const html = buildStandaloneHTML({ ...pf, meta: { ...pf.meta, credit: false } });
  assert.ok(!html.includes('class="pg-credit-wrap"'), 'credit element still rendered after being disabled');
});

/* ------------------------------------------------------------------ */
console.log(`\n${pass} passed, ${failures.length} failed\n`);
if (failures.length) process.exit(1);
