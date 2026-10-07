/* tests/motion.exec.test.mjs — actually RUNS the motion engine inside exported
   portfolios and asserts the animations fire. Needs jsdom:
       npm install --no-save jsdom
   Run:  node tests/motion.exec.test.mjs */

let JSDOM;
try { ({ JSDOM } = await import('jsdom')); }
catch { console.log('  (skipped — jsdom not installed. Run: npm install --no-save jsdom)'); process.exit(0); }
import { demoData } from '../templates/registry.js';
import { buildStandaloneHTML } from '../core/export.js';
import { TEMPLATES } from '../templates/registry.js';

const pf = { ...demoData('dev-dark'), slug: 'x', templateId: 'dev-dark' };
const html = buildStandaloneHTML(pf);

const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
const doc = window.document;
await new Promise(r => setTimeout(r, 260));

const fail = [];
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail.push(m); };

ok(typeof window.__motion === 'function', 'motion engine installed itself as window.__motion');
ok(doc.documentElement.classList.contains('grain'), 'grain overlay applied to <html>');
ok(doc.querySelectorAll('[data-reveal].is-in').length > 0, `reveals fired for in-view elements (${doc.querySelectorAll('[data-reveal].is-in').length})`);
ok(doc.querySelectorAll('[data-reveal]').length > 3, `reveal targets auto-tagged (${doc.querySelectorAll('[data-reveal]').length})`);

// counters: wait past the 1.1s count-up
const counter = doc.querySelector('[data-count]');
const before = counter.textContent;
await new Promise(r => setTimeout(r, 1400));
ok(counter.textContent !== '' && /[0-9]/.test(counter.textContent), `counter produced a number ("${counter.textContent}", started "${before}")`);

// tilt element is present and gets a transform when we simulate a pointer move
const tilt = doc.querySelector('[data-tilt]');
ok(!!tilt, 'a [data-tilt] element exists in the exported page');
if (tilt) {
  tilt.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300, right: 400, bottom: 300 });
  const ev = new window.MouseEvent('pointermove', { bubbles: true, clientX: 400, clientY: 0 });
  tilt.dispatchEvent(ev);
  ok(/rotateX\(/.test(tilt.style.transform || ''), `tilt applied a 3D transform: "${tilt.style.transform}"`);
}

// reduced-motion: re-run in a fresh page that reports the preference
const rmDom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
rmDom.window.matchMedia = (q) => ({ matches: /reduce/.test(q), media: q, addEventListener() {}, removeEventListener() {} });
rmDom.window.eval('window.__motion()');
await new Promise(r => setTimeout(r, 120));
const rmIn = rmDom.window.document.querySelectorAll('[data-reveal].is-in').length;
const rmTotal = rmDom.window.document.querySelectorAll('[data-reveal]').length;
ok(rmIn === rmTotal && rmTotal > 0, `reduced motion reveals everything instantly (${rmIn}/${rmTotal})`);

// every template must survive the same treatment
for (const t of TEMPLATES) {
  const d = new JSDOM(buildStandaloneHTML({ ...demoData(t.id), slug: t.id, templateId: t.id }),
    { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  await new Promise(r => setTimeout(r, 120));
  const w = d.window;
  ok(typeof w.__motion === 'function' && w.document.querySelectorAll('[data-reveal]').length > 0,
     `${t.id}: motion engine ran and tagged ${w.document.querySelectorAll('[data-reveal]').length} reveal targets`);
}

console.log(fail.length ? `\n${fail.length} FAILED` : '\nall motion checks passed');
process.exit(fail.length ? 1 : 0);
