/* ===========================================================================
   OSTENDIC — EXAMPLE WORKFLOW DIAGRAMS (home: "Automations in action")
   Each workflow is drawn the way automation editors show one: dot-grid
   canvas, square nodes with a coloured icon, curved connections, If and
   Switch nodes with labelled outputs, AI agent nodes with model/tool
   sub-nodes on dashed links, sticky notes. Plain SVG generated here: no
   screenshots, no third-party UI or logos.

   The copy for each workflow (tab label, title, steps) lives in
   content/home.json › showcase.workflows, keyed by the ids below. The
   drawing lives here because it is layout, not copy.

   A pretend run (site.js adds .is-run) lights nodes in order. `t` is the
   second a node turns green; nodes without `t` are not part of the run
   (another branch) and stay grey, as in a real execution.
   These are examples, labelled as such on the page, never client work.
   =========================================================================== */
import { esc } from './ui.mjs';

const ICON = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  filter: '<path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/>',
  sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
  split: '<path d="M16 3h5v5M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.17-2.87L3 3M15 9l6-6"/>',
  route: '<path d="M3 12h5M8 12l4-7h9M8 12h13M8 12l4 7h9"/>',
  ai: '<path d="M12 3l1.8 4.9 4.7 1.8-4.7 1.8L12 16.4l-1.8-4.9-4.7-1.8 4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  reply: '<path d="M9 17l-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
  form: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h5"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  missed: '<path d="m16 2 6 6M22 2l-6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  wait: '<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M8 4h8"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
  merge: '<path d="M6 3v6a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M12 15v6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
};

/* colours by kind of step */
const C = { trigger: '#E8590C', logic: '#0E8A7B', filter: '#4263EB', sheet: '#1E9E5A', ai: '#7048E8',
  mail: '#C92A2A', phone: '#0B7285', crm: '#1864AB', chat: '#2B8A3E', alert: '#E67700', code: '#495057' };

/* ---------------------------------------------------------------------------
   Node: { id, x, y (centre), label, sub, icon, c, t?, kind?, w?, h?, ins?, outs?, slots? }
     kind: 'trigger' (rounded left side, no input) | 'agent' (wide, label
     inside, `slots` = sub-node handles along the bottom) | 'sub' (circle
     joined to an agent slot by a dashed line: `of` = [agentId, slot])
     outs: output labels, e.g. ['true', 'false']; default one unlabelled.
   Edge: [from, to, items, outIndex = 0]
   --------------------------------------------------------------------------- */
export const WORKFLOWS = {
  /* The flagship: an AI voice agent that phones every new enquiry. The
     example run follows one website enquiry through to a booked slot. */
  'ai-call': {
    w: 1530, h: 560,
    nodes: [
      { id: 'web', x: 60, y: 115, label: 'Website form', sub: 'New enquiry', icon: 'form', c: C.trigger, kind: 'trigger', t: 0 },
      { id: 'ads', x: 60, y: 255, label: 'Lead ad form', sub: 'New lead', icon: 'megaphone', c: C.trigger, kind: 'trigger' },
      { id: 'mis', x: 60, y: 395, label: 'Missed call', sub: 'Phone line', icon: 'missed', c: C.trigger, kind: 'trigger' },
      { id: 'cln', x: 185, y: 255, label: 'Clean & dedupe', sub: 'Code', icon: 'code', c: C.code, ins: 1, t: .6 },
      { id: 'crm', x: 305, y: 255, label: 'Save to CRM', sub: 'create: contact', icon: 'db', c: C.crm, t: 1.2 },
      { id: 'hrs', x: 425, y: 255, label: 'Open now?', sub: 'If', icon: 'split', c: C.logic, outs: ['true', 'false'], t: 1.8 },
      { id: 'wt', x: 540, y: 405, label: 'Wait until open', sub: 'Wait', icon: 'wait', c: C.code },
      { id: 'agt', x: 755, y: 255, w: 250, h: 80, label: 'AI voice agent', sub: 'Calls the lead now', icon: 'bot', c: C.ai, kind: 'agent', slots: ['Voice', 'Knowledge', 'Tool'], t: 2.6 },
      { id: 'vm', x: 660, y: 420, label: 'Voice AI', sub: 'speech model', icon: 'mic', c: C.ai, kind: 'sub', of: ['agt', 0], t: 3.1 },
      { id: 'kb', x: 755, y: 420, label: 'Your FAQs', sub: 'and prices', icon: 'book', c: C.ai, kind: 'sub', of: ['agt', 1], t: 3.7 },
      { id: 'cal', x: 850, y: 420, label: 'Calendar', sub: 'free slots', icon: 'calendar', c: C.ai, kind: 'sub', of: ['agt', 2], t: 4.3 },
      { id: 'out', x: 975, y: 255, h: 180, label: 'Call outcome', sub: 'Switch', icon: 'route', c: C.logic, outs: ['Booked', 'Interested', 'Call back', 'Not now'], t: 5.2 },
      { id: 'bk', x: 1125, y: 90, label: 'Book the slot', sub: 'create: event', icon: 'calendar', c: C.crm, t: 5.8 },
      { id: 'sal', x: 1125, y: 215, label: 'Alert sales', sub: 'assign: owner', icon: 'user', c: C.alert },
      { id: 'rt', x: 1125, y: 340, label: 'Retry in 2 hrs', sub: 'Wait', icon: 'wait', c: C.code },
      { id: 'upd', x: 1125, y: 465, label: 'Update CRM', sub: 'update: contact', icon: 'db', c: C.crm },
      { id: 'wa', x: 1245, y: 90, label: 'Confirm by chat', sub: 'send: message', icon: 'chat', c: C.chat, t: 6.4 },
      { id: 'log', x: 1360, y: 255, label: 'Log the call', sub: 'transcript + summary', icon: 'file', c: C.sheet, t: 7.0 },
      { id: 'own', x: 1470, y: 255, label: 'Notify owner', sub: 'send: summary', icon: 'bell', c: C.alert, t: 7.6 },
    ],
    edges: [
      ['web', 'cln', 1], ['ads', 'cln', 1], ['mis', 'cln', 1], ['cln', 'crm', 1], ['crm', 'hrs', 1],
      ['hrs', 'agt', 1, 0], ['hrs', 'wt', 1, 1], ['wt', 'agt', 1],
      ['agt', 'out', 1],
      ['out', 'bk', 1, 0], ['out', 'sal', 1, 1], ['out', 'rt', 1, 2], ['out', 'upd', 1, 3],
      ['bk', 'wa', 1], ['wa', 'log', 1], ['sal', 'log', 1], ['rt', 'log', 1], ['upd', 'log', 1], ['log', 'own', 1],
    ],
    stickies: [
      { x: 150, y: 22, w: 250, h: 96, title: 'Every channel, one flow', lines: ['Website forms, lead ads and missed', 'calls all start the same workflow,', 'so no enquiry waits for a person.'] },
      { x: 590, y: 22, w: 300, h: 96, title: 'Honest by design', lines: ['The agent says it is an AI assistant,', 'answers only from your own information', 'and hands over to a person on request.'] },
      { x: 1290, y: 22, w: 230, h: 96, title: 'Nothing gets lost', lines: ['Every call is logged with a', 'transcript and a short summary', 'for you to read.'] },
    ],
    /* what the caller hears, shown while the agent is "on the call" */
    bubble: { x: 610, y: 135, w: 290, t: 2.9, lines: ['“Hi Priya, this is the AI assistant at Bright', 'Smile Dental. You asked about whitening,', 'is now a good time to talk?”'] },
  },

  /* The simple one: emails new leads and follows up until they reply. */
  'lead-follow-up': {
    w: 1080, h: 445,
    nodes: [
      { id: 't', x: 70, y: 170, label: 'Every hour', sub: 'Schedule', icon: 'clock', c: C.trigger, kind: 'trigger', t: 0 },
      { id: 'wd', x: 200, y: 170, label: 'Weekdays only', sub: 'Filter', icon: 'filter', c: C.filter, t: .55 },
      { id: 'gl', x: 330, y: 170, label: 'Get leads', sub: 'read: sheet', icon: 'sheet', c: C.sheet, t: 1.1 },
      { id: 'nl', x: 460, y: 170, label: 'New lead?', sub: 'If', icon: 'split', c: C.logic, outs: ['true', 'false'], t: 1.65 },
      { id: 'ai', x: 610, y: 80, label: 'Personalise email', sub: 'AI model', icon: 'ai', c: C.ai, t: 2.2 },
      { id: 'se', x: 745, y: 80, label: 'Send email', sub: 'send: message', icon: 'mail', c: C.mail, t: 2.75 },
      { id: 'lg', x: 880, y: 80, label: 'Log contact', sub: 'update: sheet', icon: 'sheet', c: C.sheet, t: 3.3 },
      { id: 'ct', x: 610, y: 280, label: 'Check thread', sub: 'get: thread', icon: 'inbox', c: C.mail, t: 2.2 },
      { id: 'rp', x: 745, y: 280, label: 'Replied?', sub: 'If', icon: 'split', c: C.logic, outs: ['true', 'false'], t: 2.75 },
      { id: 'nt', x: 880, y: 215, label: 'Notify team', sub: 'send: message', icon: 'bell', c: C.alert, t: 3.3 },
      { id: 'fu', x: 880, y: 345, label: 'Send follow-up', sub: 'reply: message', icon: 'reply', c: C.mail, t: 3.3 },
      { id: 'l2', x: 1010, y: 345, label: 'Log follow-up', sub: 'update: sheet', icon: 'sheet', c: C.sheet, t: 3.85 },
    ],
    edges: [
      ['t', 'wd', 1], ['wd', 'gl', 1], ['gl', 'nl', 12], ['nl', 'ai', 3, 0], ['nl', 'ct', 9, 1],
      ['ai', 'se', 3], ['se', 'lg', 3], ['ct', 'rp', 9], ['rp', 'nt', 2, 0], ['rp', 'fu', 7, 1], ['fu', 'l2', 7],
    ],
    stickies: [
      { x: 955, y: 18, w: 118, h: 150, title: 'Example only', lines: ['Tools, wait times', 'and wording are', 'set for each', 'business. A reply', 'always stops the', 'sequence.'] },
    ],
  },

  /* Rule-based: a new order becomes a customer, an invoice, an email and a
     sheet row, with incomplete orders sent back and failures reported. */
  'order-to-invoice': {
    w: 1060, h: 420,
    nodes: [
      { id: 't', x: 60, y: 160, label: 'New order', sub: 'Website form', icon: 'form', c: C.trigger, kind: 'trigger', t: 0 },
      { id: 'v', x: 180, y: 160, label: 'Check details', sub: 'Code', icon: 'code', c: C.code, t: .55 },
      { id: 'ok', x: 300, y: 160, label: 'All filled in?', sub: 'If', icon: 'split', c: C.logic, outs: ['true', 'false'], t: 1.1 },
      { id: 'c', x: 440, y: 80, label: 'Add customer', sub: 'create: contact', icon: 'db', c: C.crm, t: 1.7 },
      { id: 'inv', x: 570, y: 80, label: 'Create invoice', sub: 'Accounts', icon: 'file', c: C.sheet, t: 2.3 },
      { id: 'em', x: 700, y: 80, label: 'Email invoice', sub: 'send: message', icon: 'mail', c: C.mail, t: 2.9 },
      { id: 'sh', x: 830, y: 80, label: 'Update sheet', sub: 'append: row', icon: 'sheet', c: C.sheet, t: 3.5 },
      { id: 'tm', x: 960, y: 80, label: 'Tell the team', sub: 'send: message', icon: 'chat', c: C.chat, t: 4.1 },
      { id: 'ask', x: 440, y: 250, label: 'Ask for details', sub: 'send: message', icon: 'reply', c: C.mail },
      { id: 'f', x: 600, y: 320, label: 'If a step fails', sub: 'Error trigger', icon: 'bell', c: C.alert, kind: 'trigger' },
      { id: 'al', x: 720, y: 320, label: 'Alert the owner', sub: 'send: message', icon: 'user', c: C.alert },
    ],
    edges: [
      ['t', 'v', 1], ['v', 'ok', 1], ['ok', 'c', 1, 0], ['ok', 'ask', 1, 1],
      ['c', 'inv', 1], ['inv', 'em', 1], ['em', 'sh', 1], ['sh', 'tm', 1], ['f', 'al', 1],
    ],
    stickies: [
      { x: 810, y: 255, w: 210, h: 76, title: 'Failures are visible', lines: ['If any step fails, the workflow', 'stops and tells someone.'] },
    ],
  },

  /* A Monday report written by AI from the week's numbers. */
  'weekly-report': {
    w: 900, h: 440,
    nodes: [
      { id: 't', x: 60, y: 200, label: 'Monday, 8 am', sub: 'Schedule', icon: 'clock', c: C.trigger, kind: 'trigger', t: 0 },
      { id: 's', x: 200, y: 80, label: 'Sales', sub: 'read: sheet', icon: 'sheet', c: C.sheet, t: .6 },
      { id: 'e', x: 200, y: 200, label: 'Enquiries', sub: 'get: contacts', icon: 'db', c: C.crm, t: .6 },
      { id: 'c', x: 200, y: 320, label: 'Calls', sub: 'get: call log', icon: 'phone', c: C.phone, t: .6 },
      { id: 'm', x: 330, y: 200, h: 110, label: 'Combine', sub: 'Merge', icon: 'merge', c: C.code, ins: 3, t: 1.3 },
      { id: 'a', x: 530, y: 200, w: 210, h: 80, label: 'AI report writer', sub: 'Plain-English summary', icon: 'bot', c: C.ai, kind: 'agent', slots: ['Chat model', 'Last week'], t: 2.0 },
      { id: 'cm', x: 490, y: 360, label: 'AI model', sub: 'writes it', icon: 'ai', c: C.ai, kind: 'sub', of: ['a', 0], t: 2.4 },
      { id: 'lw', x: 570, y: 360, label: 'History', sub: 'compares', icon: 'clock', c: C.ai, kind: 'sub', of: ['a', 1], t: 2.8 },
      { id: 'w', x: 750, y: 130, label: 'Send by chat', sub: 'send: message', icon: 'chat', c: C.chat, t: 3.5 },
      { id: 'p', x: 750, y: 270, label: 'Email the PDF', sub: 'send: message', icon: 'mail', c: C.mail, t: 3.5 },
    ],
    edges: [
      ['t', 's', 1], ['t', 'e', 1], ['t', 'c', 1],
      ['s', 'm', 86], ['e', 'm', 41], ['c', 'm', 37],
      ['m', 'a', 1], ['a', 'w', 1], ['a', 'p', 1],
    ],
    edgeIns: { 's>m': 0, 'e>m': 1, 'c>m': 2 },
    stickies: [
      { x: 650, y: 350, w: 230, h: 76, title: 'Ready before work starts', lines: ['Last week’s numbers, what changed', 'and what needs attention.'] },
    ],
  },
};
export const WORKFLOW_IDS = Object.keys(WORKFLOWS);

/* ---------- geometry ---------- */
const box = (n) => {
  const w = n.w || (n.kind === 'sub' ? 60 : 72), h = n.h || (n.kind === 'sub' ? 60 : 72);
  return { w, h, l: n.x - w / 2, t: n.y - h / 2 };
};
const outY = (n, i) => { const b = box(n), k = (n.outs || ['']).length; return b.t + b.h * (i + 1) / (k + 1); };
const inY = (n, i) => { const b = box(n), k = n.ins || 1; return b.t + b.h * (i + 1) / (k + 1); };
const slotX = (n, i) => { const b = box(n); return b.l + b.w * (i + 1) / (n.slots.length + 1); };
const s = (v) => `${(+v).toFixed(2)}s`;

/* ---------- drawing ---------- */
const iconAt = (n, x, y, size) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${n.c}" stroke-width="${(2.3 * 24 / size).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${ICON[n.icon]}</g>`;

const okBadge = (x, y) => `<g class="wf-ok" transform="translate(${x} ${y})"><circle r="9"/><path d="m-4 0 2.6 2.6L4-2.6"/></g>`;

const drawNode = (n) => {
  const b = box(n), run = n.t !== undefined;
  const cls = `wf-node${run ? ' wf-node--run' : ''}${n.kind ? ` wf-node--${n.kind}` : ''}`;
  const style = run ? ` style="--d:${s(n.t)}"` : '';
  const g = (inner) => `<g class="${cls}"${style} transform="translate(${b.l} ${b.t})">${inner}</g>`;

  if (n.kind === 'sub') {
    const r = b.w / 2;
    return g(`<circle class="wf-box" cx="${r}" cy="${r}" r="${r}"/>
      ${iconAt(n, r - 12, r - 12, 24)}
      <path class="wf-h wf-h--d" d="M${r} -6l6 6-6 6-6-6z"/>
      ${okBadge(b.w - 4, 4)}
      <text class="wf-lbl" x="${r}" y="${b.h + 20}" text-anchor="middle">${esc(n.label)}</text>
      <text class="wf-sub" x="${r}" y="${b.h + 35}" text-anchor="middle">${esc(n.sub)}</text>`);
  }

  const shape = n.kind === 'trigger'
    ? `<path class="wf-box" d="M30 0H${b.w - 8}Q${b.w} 0 ${b.w} 8V${b.h - 8}Q${b.w} ${b.h} ${b.w - 8} ${b.h}H30A30 30 0 0 1 0 ${b.h - 30}V30A30 30 0 0 1 30 0Z"/>`
    : `<rect class="wf-box" width="${b.w}" height="${b.h}" rx="${n.kind === 'agent' ? 12 : 8}"/>`;
  const ins = n.kind === 'trigger' ? '' : Array.from({ length: n.ins || 1 }, (_, i) =>
    `<circle class="wf-h" cx="0" cy="${(inY(n, i) - b.t).toFixed(1)}" r="5"/>`).join('');
  const outs = (n.outs || ['']).map((lab, i, all) => {
    const y = outY(n, i) - b.t;
    const ly = all.length === 2 ? (i === 0 ? y - 8 : y + 15) : y - 6;
    return `<circle class="wf-h" cx="${b.w}" cy="${y.toFixed(1)}" r="5"/>${lab ? `<text class="wf-io" x="${b.w + 10}" y="${ly.toFixed(1)}">${esc(lab)}</text>` : ''}`;
  }).join('');

  if (n.kind === 'agent') {
    const slots = n.slots.map((lab, i) => {
      const x = slotX(n, i) - b.l;
      return `<path class="wf-h wf-h--d" d="M${x} ${b.h - 6}l6 6-6 6-6-6z"/><text class="wf-io" x="${x}" y="${b.h + 24}" text-anchor="middle">${esc(lab)}</text>`;
    }).join('');
    return g(`<rect class="wf-ring" width="${b.w}" height="${b.h}" rx="12"/>${shape}
      ${iconAt(n, 18, b.h / 2 - 16, 32)}
      <text class="wf-lbl wf-lbl--in" x="64" y="${b.h / 2 - 2}">${esc(n.label)}</text>
      <text class="wf-sub" x="64" y="${b.h / 2 + 15}">${esc(n.sub)}</text>
      ${ins}${outs}${slots}${okBadge(b.w - 2, 2)}`);
  }

  return g(`${n.kind === 'trigger' ? `<path class="wf-bolt" d="M-14 ${b.h / 2 - 10}l-6 11h6l-3 9 8-12h-6l3-8z"/>` : ''}${shape}
      ${iconAt(n, b.w / 2 - 18, b.h / 2 - 18, 36)}
      ${ins}${outs}${okBadge(b.w - 2, 2)}
      <text class="wf-lbl" x="${b.w / 2}" y="${b.h + 22}" text-anchor="middle">${esc(n.label)}</text>
      <text class="wf-sub" x="${b.w / 2}" y="${b.h + 38}" text-anchor="middle">${esc(n.sub)}</text>`);
};

const drawEdge = (wf, [a, b, items, out]) => {
  const A = wf.nodes.find(n => n.id === a), B = wf.nodes.find(n => n.id === b);
  const ba = box(A), bb = box(B);
  const inIdx = (wf.edgeIns || {})[`${a}>${b}`] || 0;
  const x1 = ba.l + ba.w + 5, y1 = outY(A, out || 0);
  const x2 = bb.l - 6, y2 = inY(B, inIdx);
  const dx = Math.max(30, (x2 - x1) / 2);
  const d = `M${x1} ${y1.toFixed(1)}C${x1 + dx} ${y1.toFixed(1)} ${x2 - dx} ${y2.toFixed(1)} ${x2} ${y2.toFixed(1)}`;
  const run = A.t !== undefined && B.t !== undefined;
  const arrow = `M${x2 - 7} ${(y2 - 5).toFixed(1)}L${x2 + 1} ${y2.toFixed(1)}L${x2 - 7} ${(y2 + 5).toFixed(1)}Z`;
  if (!run) return `<path class="wf-line" d="${d}"/><path class="wf-arrow" d="${arrow}"/>`;
  const style = `style="--d:${s(Math.max(0, B.t - .35))}"`;
  /* item count: mid-line on level links; on branch outputs and steep
     curves, just before the target so it clears labels and lines; into a
     node with several inputs, just after the source so counts don't stack */
  const branch = (A.outs || []).length > 1 || Math.abs(y2 - y1) > 40;
  const [mx, my] = (B.ins || 1) > 1 ? [x1 + 30, y1] : branch ? [x2 - 30, y2] : [(x1 + x2) / 2, (y1 + y2) / 2];
  return `<path class="wf-line" d="${d}"/><path class="wf-flow" pathLength="1" ${style} d="${d}"/>
        <path class="wf-arrow" ${style} d="${arrow}"/>
        <text class="wf-items" ${style} x="${mx.toFixed(1)}" y="${(my - 8).toFixed(1)}" text-anchor="middle">${items} item${items === 1 ? '' : 's'}</text>`;
};

/* dashed link from an agent's slot down to its sub-node */
const drawSubLink = (wf, n) => {
  const A = wf.nodes.find(x => x.id === n.of[0]), ba = box(A), bn = box(n);
  const x1 = slotX(A, n.of[1]), y1 = ba.t + ba.h + 6, x2 = n.x, y2 = bn.t - 6;
  const d = `M${x1} ${y1}C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`;
  return `<path class="wf-line wf-line--sub" d="${d}"/>${n.t !== undefined ? `<path class="wf-flow wf-flow--sub" pathLength="1" style="--d:${s(n.t - .3)}" d="${d}"/>` : ''}`;
};

const drawSticky = (st) => `<g class="wf-sticky" transform="translate(${st.x} ${st.y})">
          <rect width="${st.w}" height="${st.h}" rx="6"/>
          <text x="12" y="24" class="wf-sticky__h">${esc(st.title)}</text>
          ${st.lines.map((l, i) => `<text x="12" y="${44 + i * 16}">${esc(l)}</text>`).join('')}
        </g>`;

const drawBubble = (b) => `<g transform="translate(${b.x} ${b.y})"><g class="wf-bubble" style="--d:${s(b.t)}">
          <rect width="${b.w}" height="${18 + b.lines.length * 16}" rx="10"/>
          <path d="M${b.w / 2 - 8} ${18 + b.lines.length * 16}l8 9 8-9z"/>
          <circle class="wf-bubble__dot" cx="14" cy="15" r="4"/>
          ${b.lines.map((l, i) => `<text x="${i === 0 ? 26 : 14}" y="${19 + i * 16}">${esc(l)}</text>`).join('')}
        </g></g>`;

export const runMs = (id) => {
  const wf = WORKFLOWS[id];
  return Math.round((Math.max(...wf.nodes.filter(n => n.t !== undefined).map(n => n.t)) + .6) * 1000);
};
export const stepCount = (id) => WORKFLOWS[id].nodes.length;

export const workflowSvg = (id, title, desc) => {
  const wf = WORKFLOWS[id];
  return `<svg class="wf__svg" viewBox="0 0 ${wf.w} ${wf.h}" style="--w:${wf.w}" role="img" aria-labelledby="wf-${id}-t wf-${id}-d">
          <title id="wf-${id}-t">${esc(title)}</title>
          <desc id="wf-${id}-d">${esc(desc)}</desc>
        ${(wf.stickies || []).map(drawSticky).join('\n        ')}
        ${wf.nodes.filter(n => n.kind === 'sub').map(n => drawSubLink(wf, n)).join('\n        ')}
        ${wf.edges.map(e => drawEdge(wf, e)).join('\n        ')}
        ${wf.nodes.map(drawNode).join('\n        ')}
        ${wf.bubble ? drawBubble(wf.bubble) : ''}
        </svg>`;
};
