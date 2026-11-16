/* Ostendic admin: forms drawn from build/schema.mjs.
   renderField(schema, bind) -> element. `bind` is { get(), set(v) }; set()
   writes into S.work and calls changed(), so the save bar follows. */
import { h, icon, btn, badge, autosize, mediaUrl, slugify } from './dom.js';
import { inlineEditor } from './editor.js';
import { check } from '/build/schema.mjs';

let pickMediaFn = null;
export const setPicker = (fn) => { pickMediaFn = fn; };

/* an empty value for a schema */
export function blank(s) {
  switch (s.t) {
    case 'obj': return Object.fromEntries(Object.entries(s.fields).filter(([, f]) => !(f.t === 'obj' && f.optional)).map(([k, f]) => [k, blank(f)]));
    case 'list': return s.min ? Array.from({ length: s.min }, () => blank(s.of)) : [];
    case 'lines': case 'paras': case 'multi': return [];
    case 'dict': return {};
    case 'bool': return false;
    case 'number': return s.min || 0;
    case 'select': return s.options[0];
    case 'color': return '#1B4D3E';
    default: return '';
  }
}

export const sub = (bind, key) => ({
  get: () => (bind.get() || {})[key],
  set: (v) => { const o = bind.get(); if (v === undefined) delete o[key]; else o[key] = v; bind.changed(); },
  changed: bind.changed,
});
export const at = (bind, i) => ({
  get: () => bind.get()[i],
  set: (v) => { bind.get()[i] = v; bind.changed(); },
  changed: bind.changed,
});

const counter = (input, max, soft) => {
  const c = h('span', { class: 'f__count' });
  const f = () => {
    const n = input.value.length;
    c.textContent = `${n} / ${max}`;
    c.classList.toggle('is-warn', !!soft && n > soft);
    c.classList.toggle('is-bad', n > max);
  };
  input.addEventListener('input', f); f();
  return c;
};

const wrapField = (s, control, extra = null) => h('div', { class: `f${s.t === 'bool' ? ' f--bool' : ''}` },
  s.t === 'bool' ? null : h('div', { class: 'f__top' }, h('label', { class: 'f__l', text: s.label + (s.optional && s.t !== 'obj' ? ' (optional)' : '') }), extra),
  control,
  s.hint && s.t !== 'bool' ? h('small', { class: 'f__h', text: s.hint }) : null);

/* inline error under a field after it loses focus */
const live = (el, s, bind) => {
  const err = h('small', { class: 'f__err', hidden: true });
  const run = () => {
    const e = []; check(s, bind.get(), s.label, e);
    err.hidden = !e.length; err.textContent = e[0] || '';
    el.classList.toggle('is-bad', !!e.length);
  };
  el.addEventListener('blur', run, true);
  return err;
};

export function imageField(s, bind) {
  const box = h('div', { class: 'imgf' });
  const draw = () => {
    box.textContent = '';
    const v = bind.get();
    box.append(
      h('div', { class: 'imgf__prev' }, v ? h('img', { src: mediaUrl(v), alt: '', loading: 'lazy' }) : icon('image', 26)),
      h('div', { class: 'imgf__side' },
        h('code', { class: 'imgf__path', text: v || 'No image' }),
        h('div', { class: 'row' },
          btn(v ? 'Change' : 'Choose image', { small: true, icon: 'image', onclick: () => pickMediaFn && pickMediaFn((m) => { bind.set(m.path); draw(); }) }),
          v && s.optional ? btn('Remove', { small: true, kind: 'plain', onclick: () => { bind.set(''); draw(); } }) : null)));
  };
  draw();
  return wrapField(s, box);
}

export function renderField(s, bind, opts = {}) {
  const v = bind.get();
  switch (s.t) {
    case 'text': case 'url': {
      const input = h('input', { type: 'text', value: v ?? '', maxlength: s.max + 40, spellcheck: s.t === 'url' || s.format ? 'false' : 'true',
        oninput: (e) => bind.set(s.format === 'slug' ? e.target.value.toLowerCase() : e.target.value) });
      if (s.format === 'slug') input.addEventListener('blur', () => { input.value = slugify(input.value); bind.set(input.value); });
      const f = wrapField(s, input, counter(input, s.max, opts.soft));
      f.append(live(f, s, bind));
      return f;
    }
    case 'area': {
      const ta = autosize(h('textarea', { rows: 2, value: v ?? '', oninput: (e) => bind.set(e.target.value) }));
      const f = wrapField(s, ta, counter(ta, s.max, opts.soft));
      f.append(live(f, s, bind));
      return f;
    }
    case 'rich': return wrapField(s, inlineEditor({ value: v, onChange: bind.set, label: s.label }));
    case 'lines': {
      const ta = autosize(h('textarea', { rows: Math.max(3, (v || []).length + 1), value: (v || []).join('\n'),
        oninput: (e) => bind.set(e.target.value.split('\n').map(x => x.trim()).filter(Boolean)) }));
      const f = wrapField(s, ta, h('span', { class: 'f__count', text: 'One per line' }));
      f.append(live(f, s, bind));
      return f;
    }
    case 'paras': {
      if (s.rich) {
        const list = h('div', { class: 'paras' });
        const draw = () => {
          list.textContent = '';
          (bind.get() || []).forEach((p, i) => list.appendChild(h('div', { class: 'paras__row' },
            inlineEditor({ value: p, label: `${s.label} ${i + 1}`, onChange: (x) => { bind.get()[i] = x; bind.changed(); } }),
            h('div', { class: 'paras__act' },
              btn('Move up', { iconOnly: true, icon: 'up', small: true, kind: 'plain', disabled: i === 0, onclick: () => { const a = bind.get(); [a[i - 1], a[i]] = [a[i], a[i - 1]]; bind.changed(); draw(); } }),
              btn('Delete paragraph', { iconOnly: true, icon: 'trash', small: true, kind: 'plain', onclick: () => { bind.get().splice(i, 1); bind.changed(); draw(); } })))));
          list.appendChild(btn('Add paragraph', { small: true, icon: 'plus', onclick: () => { bind.get().push('New paragraph.'); bind.changed(); draw(); } }));
        };
        draw();
        return wrapField(s, list);
      }
      const ta = autosize(h('textarea', { rows: 5, value: (v || []).join('\n\n'),
        oninput: (e) => bind.set(e.target.value.split(/\n\s*\n/).map(x => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)) }));
      const f = wrapField(s, ta, h('span', { class: 'f__count', text: 'Empty line between paragraphs' }));
      f.append(live(f, s, bind));
      return f;
    }
    case 'bool': {
      const input = h('input', { type: 'checkbox', checked: !!v, onchange: (e) => { bind.set(e.target.checked); opts.onToggle && opts.onToggle(e.target.checked); } });
      return h('label', { class: 'switch' }, input, h('span', { class: 'switch__ui', 'aria-hidden': 'true' }),
        h('span', { class: 'switch__t' }, h('strong', { text: s.label }), s.hint ? h('small', { text: s.hint }) : null));
    }
    case 'number': {
      const input = h('input', { type: 'number', value: v ?? '', min: s.min, max: s.max, oninput: (e) => bind.set(e.target.value === '' ? undefined : Number(e.target.value)) });
      return wrapField(s, input);
    }
    case 'color': {
      const text = h('input', { type: 'text', value: v || '', class: 'mono', maxlength: 7, oninput: (e) => { bind.set(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) pick.value = e.target.value; } });
      const pick = h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(v || '') ? v : '#000000', oninput: (e) => { bind.set(e.target.value); text.value = e.target.value; } });
      return wrapField(s, h('div', { class: 'row' }, pick, text));
    }
    case 'select': {
      const sel = h('select', { onchange: (e) => bind.set(e.target.value) },
        s.options.map(o => h('option', { value: o, text: (s.labels && s.labels[o]) || o, selected: o === v })));
      return wrapField(s, sel);
    }
    case 'multi': {
      const box = h('div', { class: 'pills' }, s.options.map(o => h('label', { class: 'pill' },
        h('input', { type: 'checkbox', checked: (v || []).includes(o), onchange: (e) => {
          const cur = new Set(bind.get() || []); e.target.checked ? cur.add(o) : cur.delete(o);
          bind.set(s.options.filter(x => cur.has(x)));
        } }), h('span', { text: (s.labels && s.labels[o]) || o }))));
      return wrapField(s, box);
    }
    case 'image': return imageField(s, bind);
    case 'obj': return renderObj(s, bind, opts);
    case 'list': return renderList(s, bind, opts);
    default: return h('p', { class: 'muted', text: `(${s.label}: not editable here)` });
  }
}

export function renderObj(s, bind, opts = {}) {
  const box = h('div', { class: `fs${opts.flat ? ' fs--flat' : ''}` });
  const draw = () => {
    box.textContent = '';
    const v = bind.get();
    if (s.optional && !opts.root) {
      const on = v !== undefined && v !== null;
      box.appendChild(h('div', { class: 'fs__head' },
        h('h3', { class: 'fs__t', text: s.label }),
        h('label', { class: 'switch switch--sm' }, h('input', { type: 'checkbox', checked: on, onchange: (e) => { bind.set(e.target.checked ? blank({ ...s, optional: false }) : undefined); draw(); } }),
          h('span', { class: 'switch__ui', 'aria-hidden': 'true' }), h('span', { class: 'switch__t' }, h('small', { text: on ? 'On' : 'Off' })))));
      if (!on) return;
    } else if (!opts.root && s.label) box.appendChild(h('div', { class: 'fs__head' }, h('h3', { class: 'fs__t', text: s.label })));
    const grid = h('div', { class: 'fs__body' });
    for (const [k, f] of Object.entries(s.fields)) {
      if (opts.skip && opts.skip.includes(k)) continue;
      grid.appendChild(renderField(f, sub(bind, k), { soft: opts.soft && opts.soft[k] }));
    }
    box.appendChild(grid);
  };
  draw();
  return box;
}

export function renderList(s, bind, opts = {}) {
  const box = h('div', { class: 'lst' });
  const open = new Set(opts.openAll ? [] : []);
  const draw = () => {
    box.textContent = '';
    const arr = bind.get() || [];
    box.appendChild(h('div', { class: 'lst__head' },
      h('h3', { class: 'fs__t', text: s.label }), h('span', { class: 'muted', text: `${arr.length}${s.max < 50 ? ' / ' + s.max : ''}` })));
    if (s.hint) box.appendChild(h('small', { class: 'f__h', text: s.hint }));
    arr.forEach((item, i) => {
      const title = (s.itemTitle && item && item[s.itemTitle]) || `${s.of.label || 'Item'} ${i + 1}`;
      const det = h('details', { class: 'lst__item', open: open.has(i) || opts.openAll || null,
        ontoggle: () => det.open ? open.add(i) : open.delete(i) },
        h('summary', null,
          h('span', { class: 'lst__n', text: String(i + 1) }),
          h('span', { class: 'lst__t', text: title }),
          item && item.publish === false ? badge('Hidden', 'warn') : null,
          h('span', { class: 'lst__act' },
            btn('Move up', { iconOnly: true, icon: 'up', small: true, kind: 'plain', disabled: i === 0, onclick: (e) => { e.preventDefault(); [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; bind.changed(); draw(); } }),
            btn('Move down', { iconOnly: true, icon: 'down', small: true, kind: 'plain', disabled: i === arr.length - 1, onclick: (e) => { e.preventDefault(); [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; bind.changed(); draw(); } }),
            s.fixed ? null : btn('Delete', { iconOnly: true, icon: 'trash', small: true, kind: 'plain', onclick: (e) => { e.preventDefault(); if (confirm(`Delete “${title}”?`)) { arr.splice(i, 1); bind.changed(); draw(); } } }))),
        h('div', { class: 'lst__body' }, renderObj(s.of, { get: () => arr[i], set: (v) => { arr[i] = v; bind.changed(); }, changed: () => { bind.changed(); const t = det.querySelector('.lst__t'); if (t) t.textContent = (s.itemTitle && arr[i][s.itemTitle]) || title; } }, { root: true, flat: true })));
      box.appendChild(det);
    });
    if (!s.fixed && arr.length < s.max) box.appendChild(btn(`Add ${(s.of.label || 'item').toLowerCase()}`, { icon: 'plus', small: true, onclick: () => {
      arr.push(blank(s.of)); open.add(arr.length - 1); bind.changed(); draw();
    } }));
  };
  draw();
  return box;
}

/* a whole content file (or a part of one) as cards: one card per top-level group */
export function renderCards(schema, bind, opts = {}) {
  const out = [];
  for (const [k, f] of Object.entries(schema.fields)) {
    if (opts.only && !opts.only.includes(k)) continue;
    const b = sub(bind, k);
    const body = f.t === 'obj' && !f.optional ? renderObj(f, b, { root: true }) : renderField(f, b);
    out.push(h('section', { class: 'card', id: `sec-${k}` },
      f.t === 'obj' && !f.optional ? h('div', { class: 'card__head' }, h('h2', { class: 'card__t', text: f.label })) : null, body));
  }
  return out;
}
