/* pages/portfolio.js — the published portfolio page at #/p/:slug */

import { $, esc, download, copyText, toast } from '../core/utils.js';
import { store } from '../core/store.js';
import { buildStandaloneHTML, previewDocument } from '../core/export.js';
import { brandLink, BRAND, CONTACT } from '../core/config.js';

export function renderPortfolio(root, params) {
  const pf = store.get(params?.slug);

  if (!pf) {
    document.body.classList.remove('has-pub');
    root.innerHTML = `
      <header class="topbar">${brandLink()}</header>
      <div class="empty">
        <h2>No portfolio at that link</h2>
        <p>Nothing is saved under <b>${esc(params?.slug || '')}</b> in this browser. If someone sent you this link, ask them to send you the downloaded HTML file instead — or build your own.</p>
        <div style="margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a class="btn btn-primary" href="#/">Build a portfolio</a>
        </div>
      </div>`;
    return;
  }

  document.body.classList.add('has-pub');
  document.title = pf.meta?.title || `${pf.profile?.name || 'Portfolio'} — ${pf.profile?.role || ''}`.trim();

  root.innerHTML = `
    <iframe class="pub-frame" id="pub-frame" title="${esc(pf.profile?.name || 'Portfolio')}"></iframe>
    <div class="fab">
      <button class="btn btn-sm" data-act="copy">Copy link</button>
      <button class="btn btn-sm" data-act="print">Print</button>
      <button class="btn btn-sm" data-act="download">Download</button>
      <a class="btn btn-sm btn-primary" href="#/edit/${esc(pf.id)}">Edit</a>
    </div>`;

  const frame = $('#pub-frame', root);
  // sandbox is required for the iframe to run the motion engine at all
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.srcdoc = previewDocument(pf);

  const fab = $('.fab', root);
  fab.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'copy') {
      const ok = await copyText(`${location.origin}${location.pathname}#/p/${pf.slug}`);
      toast(ok ? 'Link copied' : 'Copy failed', ok ? 'ok' : 'err');
    }
    if (act === 'download') {
      download(`${pf.slug}.html`, buildStandaloneHTML(store.get(pf.id)));
      toast('Downloaded', 'ok');
    }
    if (act === 'print') {
      const w = window.open('', '_blank');
      w.document.write(buildStandaloneHTML(store.get(pf.id)));
      w.document.close();
      setTimeout(() => w.print(), 700);
    }
  });
}

/** Remove the full-bleed state when leaving a published page. */
export function teardownPortfolio() {
  document.body.classList.remove('has-pub');
  document.title = `${BRAND.full} — ${BRAND.tagline}`;
}
