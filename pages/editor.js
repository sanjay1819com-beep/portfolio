/* pages/editor.js — the builder: form on the left, live preview on the right */

import { $, $$, esc, attr, debounce, slugify, copyText, download, toast, fileToDataURL, photoSrc } from '../core/utils.js';
import { store, blankPortfolio, uniqueSlug } from '../core/store.js';
import { SCHEMA, getPath, setPath, coerce } from '../core/schema.js';
import { TEMPLATES, getTemplate, demoData } from '../templates/registry.js';
import { buildStandaloneHTML, thumbnailDocument, previewDocument } from '../core/export.js';
import { brandLink, BRAND, CONTACT } from '../core/config.js';

export function renderEditor(root, params) {
  let pf = store.get(params?.id) || store.get(store.getCurrentId());
  if (!pf) {
    root.innerHTML = `<div class="empty"><h2>Portfolio not found</h2><p>It may have been deleted from this browser.</p>
      <div style="margin-top:16px"><a class="btn btn-primary" href="#/">Back to templates</a></div></div>`;
    return;
  }
  store.setCurrent(pf.id);

  let device = 'desktop';
  let activeSection = SCHEMA[0].id;

  root.innerHTML = `
  <header class="topbar">
    ${brandLink()}
    <span class="save-state" id="save-state"><span class="dot"></span><span id="save-text">Saved</span></span>
    <div class="topbar-spacer"></div>
    <button class="btn btn-sm" data-act="download">Download HTML</button>
    <a class="btn btn-sm" href="#/p/${esc(pf.slug)}" target="_blank" rel="noopener">Open live</a>
    <button class="btn btn-sm btn-primary" data-act="publish">Publish &amp; share</button>
  </header>

  <div class="editor">
    <div class="pane-form">
      <nav class="nav-sections" id="nav-sections">
        ${SCHEMA.map(s => `<button data-sec="${s.id}" class="${s.id === activeSection ? 'is-active' : ''}">${s.icon} ${esc(s.title)}</button>`).join('')}
        <button data-sec="template" class="${activeSection === 'template' ? 'is-active' : ''}">🖼️ Template</button>
      </nav>
      <form id="form" autocomplete="off"></form>
    </div>

    <div class="pane-preview">
      <div class="preview-bar">
        <div class="seg" id="device-seg">
          <button data-dev="desktop" class="is-active">Desktop</button>
          <button data-dev="tablet">Tablet</button>
          <button data-dev="mobile">Mobile</button>
        </div>
        <span class="mono-url" id="url-chip">#/p/${esc(pf.slug)}</span>
        <div class="topbar-spacer"></div>
        <button class="btn btn-sm" data-act="reset">Reset content</button>
      </div>
      <div class="preview-canvas">
        <div class="device is-desktop" id="device"><iframe id="preview" title="Live preview"></iframe></div>
      </div>
    </div>
  </div>`;

  const form = $('#form', root);
  const preview = $('#preview', root);
  const saveState = $('#save-state', root);
  const saveText = $('#save-text', root);

  /* -------------------------- saving -------------------------- */
  function markDirty() {
    saveState.className = 'save-state is-saving';
    saveText.textContent = 'Saving…';
  }
  function markSaved() {
    saveState.className = 'save-state is-saved';
    saveText.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  const persist = debounce(() => {
    pf = store.save(pf);
    markSaved();
  }, 350);

  function commit() { markDirty(); persist(); refreshPreview(); }

  const refreshPreview = debounce(() => {
    preview.setAttribute('sandbox', 'allow-scripts');
    preview.srcdoc = previewDocument(pf);
  }, 120);

  /* -------------------------- form -------------------------- */
  function drawForm() {
    const section = SCHEMA.find(s => s.id === activeSection);
    form.innerHTML = section
      ? `<fieldset class="group"><legend>${esc(section.title)}</legend>${section.fields.map(fieldHTML).join('')}</fieldset>`
      : templatePickerHTML();

    if (activeSection === 'template') wireTemplatePicker();
    wireFields();
  }

  function fieldHTML(field) {
    const key = field.key;
    const value = getPath(pf, key);

    if (field.type === 'repeater' || field.type === 'socials') return repeaterHTML(field, value);
    if (field.type === 'photo') return photoHTML(field, value);

    const id = `f_${key.replace(/\./g, '_')}`;
    let control = '';
    switch (field.type) {
      case 'textarea':
        control = `<textarea id="${id}" data-key="${esc(key)}" data-type="${field.type}" rows="${field.rows || 3}" placeholder="${attr(field.placeholder || '')}">${esc(value || '')}</textarea>`;
        break;
      case 'switch':
        control = `<label class="switch"><input type="checkbox" id="${id}" data-key="${esc(key)}" data-type="switch" ${value ? 'checked' : ''}><span>${esc(field.onLabel || (value ? 'Shown' : 'Hidden'))}</span></label>`;
        break;
      case 'select':
        control = `<select id="${id}" data-key="${esc(key)}" data-type="select">
          ${field.options.map(o => {
            const [val, label] = Array.isArray(o) ? o : (typeof o === 'object' ? [o.value, o.label] : [o, o]);
            return `<option value="${attr(val)}" ${String(value) === String(val) ? 'selected' : ''}>${esc(label)}</option>`;
          }).join('')}
        </select>`;
        break;
      case 'color':
        control = `<div class="inline"><input type="color" id="${id}" data-key="${esc(key)}" data-type="color" value="${attr(value || '#6366f1')}">
          <input type="text" data-key="${esc(key)}" data-type="text" value="${attr(value || '')}" style="max-width:120px;font-family:var(--mono)"></div>`;
        break;
      case 'number':
        control = `<input type="number" id="${id}" data-key="${esc(key)}" data-type="number" min="${field.min ?? ''}" max="${field.max ?? ''}" value="${esc(value ?? '')}">`;
        break;
      default:
        control = `<input type="${field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}" id="${id}" data-key="${esc(key)}" data-type="${field.type}" value="${esc(value ?? '')}" placeholder="${attr(field.placeholder || '')}">`;
    }

    return `<div class="field">
      <label for="${id}">${esc(field.label)}</label>
      ${control}
      ${field.hint ? `<div class="hint">${esc(field.hint)}</div>` : ''}
    </div>`;
  }

  function photoHTML(field, value) {
    const id = `f_${field.key.replace(/\./g, '_')}`;
    return `<div class="field">
      <label for="${id}">${esc(field.label)}</label>
      <div class="photo-pick">
        <img class="avatar" data-photo-preview="${esc(field.key)}" src="${attr(value || photoSrc('', pf.profile?.name))}" alt="">
        <div style="flex:1">
          <input type="url" id="${id}" data-key="${esc(field.key)}" data-type="photo" value="${attr(value || '')}" placeholder="https://… or upload">
          <div class="inline" style="margin-top:8px">
            <button type="button" class="btn btn-sm" data-upload="${esc(field.key)}">Upload image</button>
            ${value ? `<button type="button" class="btn btn-sm btn-ghost" data-clear-photo="${esc(field.key)}">Remove</button>` : ''}
            <input type="file" accept="image/*" hidden data-file="${esc(field.key)}">
          </div>
          ${field.hint ? `<div class="hint">${esc(field.hint)}</div>` : ''}
        </div>
      </div>
    </div>`;
  }

  function repeaterHTML(field, list) {
    const items = Array.isArray(list) ? list : [];
    const titleOf = (it) => (field.titleOf ? field.titleOf(it) : (it.title || it.name || 'Item'));
    return `<div class="field" data-repeater="${esc(field.key)}">
      <label>${esc(field.label)}</label>
      ${items.length ? items.map((it, i) => `
        <div class="rep-item" data-index="${i}">
          <div class="rep-head">
            <span class="rep-title">${esc(titleOf(it))}</span>
            <div class="rep-tools">
              <button type="button" class="icon-btn" data-move="up" data-i="${i}" title="Move up">↑</button>
              <button type="button" class="icon-btn" data-move="down" data-i="${i}" title="Move down">↓</button>
              <button type="button" class="icon-btn danger" data-remove="${i}" title="Delete">✕</button>
            </div>
          </div>
          ${field.fields.map(sub => subFieldHTML(field.key, i, sub, it[sub.key])).join('')}
        </div>`).join('')
        : '<div class="rep-empty">Nothing added yet.</div>'}
      <button type="button" class="btn btn-sm" data-add="${esc(field.key)}">+ Add</button>
    </div>`;
  }

  function subFieldHTML(parentKey, index, sub, value) {
    const key = `${parentKey}.${index}.${sub.key}`;
    const id = `f_${key.replace(/\./g, '_')}`;
    let control;
    if (sub.type === 'textarea') {
      control = `<textarea id="${id}" data-key="${esc(key)}" data-type="textarea" rows="${sub.rows || 2}" placeholder="${attr(sub.placeholder || '')}">${esc(value || '')}</textarea>`;
    } else if (sub.type === 'select') {
      control = `<select id="${id}" data-key="${esc(key)}" data-type="select">
        ${sub.options.map(o => {
          const [val, label] = Array.isArray(o) ? o : (typeof o === 'object' ? [o.value, o.label] : [o, o]);
          return `<option value="${attr(val)}" ${String(value) === String(val) ? 'selected' : ''}>${esc(label)}</option>`;
        }).join('')}</select>`;
    } else if (sub.type === 'number') {
      control = `<input type="number" id="${id}" data-key="${esc(key)}" data-type="number" min="${sub.min ?? 0}" max="${sub.max ?? 100}" value="${esc(value ?? '')}">`;
    } else if (sub.type === 'photo') {
      control = `<div class="inline"><input type="url" id="${id}" data-key="${esc(key)}" data-type="text" value="${attr(value || '')}" placeholder="Image URL">
        <button type="button" class="btn btn-sm" data-upload="${esc(key)}">Upload</button>
        <input type="file" accept="image/*" hidden data-file="${esc(key)}"></div>`;
    } else {
      control = `<input type="text" id="${id}" data-key="${esc(key)}" data-type="text" value="${esc(value ?? '')}" placeholder="${attr(sub.placeholder || '')}">`;
    }
    return `<div class="field"><label for="${id}">${esc(sub.label)}</label>${control}</div>`;
  }

  function templatePickerHTML() {
    return `<fieldset class="group"><legend>Template</legend>
      <div class="field"><label>Choose a design</label>
        <div class="tpl-mini-grid">
          ${TEMPLATES.map(t => `
            <button type="button" class="tpl-mini ${t.id === pf.templateId ? 'is-active' : ''}" data-tpl="${t.id}">
              <span class="mini-thumb" data-mini="${t.id}"></span>
              <span class="mini-label">${esc(t.name)}</span>
            </button>`).join('')}
        </div>
        <div class="hint" style="margin-top:10px">Switching templates keeps all your content — only the design changes.</div>
      </div>
      <div class="field"><label>Sample content</label>
        <button type="button" class="btn btn-sm" data-act="fill-demo">Fill with sample content</button>
        <div class="hint">Overwrites the current content with realistic placeholder text. Great for seeing how a template looks.</div>
      </div>
    </fieldset>`;
  }

  function wireTemplatePicker() {
    $$('[data-mini]', form).forEach(slot => {
      const tpl = getTemplate(slot.dataset.mini);
      const holder = document.createElement('div');
      holder.style.cssText = 'width:1280px;height:800px;transform:scale(.1875);transform-origin:top left;overflow:hidden';
      const ifr = document.createElement('iframe');
      ifr.setAttribute('scrolling', 'no');
      ifr.style.cssText = 'width:1280px;height:800px;border:0;pointer-events:none';
      ifr.srcdoc = thumbnailDocument(demoData(tpl));
      holder.appendChild(ifr);
      slot.replaceWith(holder);
    });
  }

  /* -------------------------- events -------------------------- */
  function wireFields() {
    $$('[data-key]', form).forEach(el => {
      const evt = el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'color' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        const raw = el.type === 'checkbox' ? el.checked : el.value;
        const type = el.dataset.type;
        setPath(pf, el.dataset.key, coerce(type === 'photo' ? 'text' : type, raw, null));
        if (type === 'photo') {
          const img = $(`[data-photo-preview="${el.dataset.key}"]`, form);
          if (img) img.src = photoSrc(el.value, pf.profile?.name);
        }
        commit();
      });
    });

    // colour + text twin stay in sync
    $$('input[type=color][data-key]', form).forEach(colorEl => {
      const textEl = $(`input[type=text][data-key="${colorEl.dataset.key}"]`, form);
      if (!textEl) return;
      colorEl.addEventListener('input', () => { textEl.value = colorEl.value; });
      textEl.addEventListener('input', () => { if (/^#[0-9a-f]{3,8}$/i.test(textEl.value)) colorEl.value = textEl.value; });
    });

    $$('[data-add]', form).forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.add;
      const section = SCHEMA.find(s => s.fields.some(f => f.key === key));
      const field = section.fields.find(f => f.key === key);
      const list = Array.isArray(getPath(pf, key)) ? getPath(pf, key) : [];
      list.push({ ...(field.item || {}) });
      setPath(pf, key, list);
      commit(); drawForm();
    }));

    $$('[data-remove]', form).forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.remove);
      const key = btn.closest('[data-repeater]').dataset.repeater;
      const list = getPath(pf, key);
      list.splice(i, 1);
      setPath(pf, key, list);
      commit(); drawForm();
    }));

    $$('[data-move]', form).forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      const key = btn.closest('[data-repeater]').dataset.repeater;
      const list = getPath(pf, key);
      const j = btn.dataset.move === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
      setPath(pf, key, list);
      commit(); drawForm();
    }));

    $$('[data-upload]', form).forEach(btn => btn.addEventListener('click', () => {
      $(`[data-file="${btn.dataset.upload}"]`, form)?.click();
    }));

    $$('[data-file]', form).forEach(input => input.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2.5 * 1024 * 1024) { toast('Image is over 2.5MB — use a URL instead', 'err'); return; }
      const dataUrl = await fileToDataURL(file);
      setPath(pf, input.dataset.file, dataUrl);
      commit(); drawForm();
      toast('Image added', 'ok');
    }));

    $$('[data-clear-photo]', form).forEach(btn => btn.addEventListener('click', () => {
      setPath(pf, btn.dataset.clearPhoto, '');
      commit(); drawForm();
    }));

    $$('[data-tpl]', form).forEach(btn => btn.addEventListener('click', () => {
      pf.templateId = btn.dataset.tpl;
      const tpl = getTemplate(pf.templateId);
      // adopt the template's default palette unless the user has customised nothing yet
      pf.theme = { ...pf.theme, ...(tpl.previewTheme || {}) };
      commit(); drawForm();
      toast(`Switched to ${tpl.name}`, 'ok');
    }));
  }

  /* -------------------------- nav + toolbar -------------------------- */
  $('#nav-sections', root).addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-sec]');
    if (!btn) return;
    activeSection = btn.dataset.sec;
    $$('#nav-sections button', root).forEach(b => b.classList.toggle('is-active', b === btn));
    drawForm();
    $('.pane-form', root).scrollTop = 0;
  });

  $('#device-seg', root).addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-dev]');
    if (!btn) return;
    device = btn.dataset.dev;
    $$('#device-seg button', root).forEach(b => b.classList.toggle('is-active', b === btn));
    $('#device', root).className = `device is-${device}`;
  });

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;

    // Anything that reads the portfolio back from storage must see the latest
    // edits, so flush the debounced save first.
    if (['download', 'publish'].includes(act)) flush();

    if (act === 'download') {
      const html = buildStandaloneHTML(store.get(pf.id));
      download(`${pf.slug || 'portfolio'}.html`, html);
      toast('Downloaded — open the file in any browser', 'ok');
    }
    if (act === 'publish') {
      openPublishModal(pf);
    }
    if (act === 'reset') {
      if (window.confirm('Replace all content with a blank portfolio? Your template choice is kept.')) {
        const fresh = blankPortfolio({ id: pf.id, slug: pf.slug, templateId: pf.templateId, theme: pf.theme });
        pf = store.save(fresh);
        drawForm(); commit();
        toast('Content reset', 'ok');
      }
    }
    if (act === 'fill-demo') {
      const tpl = getTemplate(pf.templateId);
      const sample = demoData(tpl);
      const keep = { id: pf.id, slug: pf.slug, templateId: pf.templateId };
      pf = store.save({ ...pf, ...sample, ...keep, theme: { ...sample.theme } });
      drawForm(); commit();
      toast('Sample content added', 'ok');
    }
  });

  /** Write straight through, bypassing the debounce. */
  const flush = () => { pf = store.save(pf); markSaved(); };

  // The save is debounced, so flush pending changes if the tab goes away —
  // otherwise the last few keystrokes are lost.
  window.addEventListener('beforeunload', flush);
  window.addEventListener('pagehide', flush);

  // keyboard: Ctrl/Cmd+S saves immediately
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      flush();
      toast('Saved', 'ok');
    }
  });

  drawForm();
  refreshPreview();
  markSaved();
}

/* -------------------------- publish modal -------------------------- */
function openPublishModal(pf) {
  const url = `${location.origin}${location.pathname}#/p/${pf.slug}`;
  const back = document.createElement('div');
  back.className = 'modal-backdrop';
  back.innerHTML = `
    <div class="modal">
      <h3>Your portfolio is live 🎉</h3>
      <p>Share this link, or download the file and host it anywhere (GitHub Pages, Netlify, Vercel, any server).</p>
      <div class="mono-url" id="pub-url">${esc(url)}</div>
      <div class="field" style="margin-top:16px">
        <label for="slug-input">Link name</label>
        <input type="text" id="slug-input" value="${attr(pf.slug)}">
        <div class="hint">Letters, numbers and dashes. Changing it changes your link.</div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-sm" data-act="print">Print / PDF</button>
        <button class="btn btn-sm" data-act="download">Download HTML</button>
        <button class="btn btn-sm" data-act="copy">Copy link</button>
        <button class="btn btn-sm btn-primary" data-act="open">Open page</button>
      </div>
    </div>`;
  document.body.appendChild(back);

  const input = $('#slug-input', back);
  input.addEventListener('input', () => {
    const slug = uniqueSlugFor(slugify(input.value) || 'portfolio', pf.id);
    pf.slug = slug;
    store.save(pf);
    $('#pub-url', back).textContent = `${location.origin}${location.pathname}#/p/${slug}`;
    const chip = document.getElementById('url-chip');
    if (chip) chip.textContent = `#/p/${slug}`;
  });

  back.addEventListener('click', async (e) => {
    if (e.target === back) return back.remove();
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'copy') {
      const ok = await copyText($('#pub-url', back).textContent);
      toast(ok ? 'Link copied' : 'Copy failed — select it manually', ok ? 'ok' : 'err');
    }
    if (act === 'open') { window.open(`#/p/${pf.slug}`, '_blank'); back.remove(); }
    if (act === 'download') {
      download(`${pf.slug}.html`, buildStandaloneHTML(store.get(pf.id)));
      toast('Downloaded', 'ok');
    }
    if (act === 'print') {
      const w = window.open('', '_blank');
      const html = buildStandaloneHTML(store.get(pf.id));
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 700);
    }
  });

  const onKey = (ev) => { if (ev.key === 'Escape') { back.remove(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function uniqueSlugFor(base, keepId) {
  const taken = new Set(store.list().filter(p => p.id !== keepId).map(p => p.slug));
  let slug = base, i = 2;
  while (taken.has(slug)) slug = `${base}-${i++}`;
  return slug;
}
