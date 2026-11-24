/* ===========================================================================
   OSTENDIC — PRODUCT MOCKUPS FOR THE SERVICE PAGES
   Small, realistic UI scenes (an inbox, a CRM card, a call screen, a
   spreadsheet, an AI plan) that show a buyer what the work looks like in
   their own business. Plain HTML + CSS (.mk-*), no images, so they stay
   sharp, light and translatable. All names and businesses are made up.

   MOCKS[id]() returns the scene. The ids are mirrored in schema.mjs
   (MOCK_IDS) so the admin can choose a mockup per card.
   =========================================================================== */

/* ---------- tiny icons (24px grid, stroke) ---------- */
const P = {
  check: '<path d="m5 12 5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  missed: '<path d="m16 2 6 6M22 2l-6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  form: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h5"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4M8 4h8"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  spark: '<path d="M12 3l1.8 4.9 4.7 1.8-4.7 1.8L12 16.4l-1.8-4.9-4.7-1.8 4.7-1.8z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
};
const i = (name, cls = '') => `<svg class="mk-i${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

/* ---------- building blocks ---------- */
const av = (ini, c) => `<span class="mk-av" style="--c:${c}">${ini}</span>`;
const chip = (t, k = '', ic = '') => `<span class="mk-chip${k ? ` mk-chip--${k}` : ''}">${ic ? i(ic) : ''}${t}</span>`;
const win = (title, body, { cls = '', right = '' } = {}) => `<div class="mk mk-win${cls ? ` ${cls}` : ''}">
  <div class="mk__bar"><span class="mk__dots"><i></i><i></i><i></i></span><span class="mk__title">${title}</span>${right ? `<span class="mk__right">${right}</span>` : ''}</div>
  <div class="mk__body">${body}</div></div>`;
const card = (body, cls = '') => `<div class="mk mk-card${cls ? ` ${cls}` : ''}">${body}</div>`;
const field = (k, v) => `<div class="mk-field"><span>${k}</span><b>${v}</b></div>`;
const toast = (ic, t, s, k = 'ok') => `<div class="mk mk-toast mk-toast--${k}"><span class="mk-toast__i">${i(ic)}</span><span><b>${t}</b><small>${s}</small></span></div>`;
const bubble = (t, who = 'in', meta = '') => `<div class="mk-msg mk-msg--${who}">${t}${meta ? `<small>${meta}</small>` : ''}</div>`;
const step = (state, t) => `<li class="mk-step mk-step--${state}">${state === 'done' ? i('check') : state === 'wait' ? i('clock') : '<i></i>'}<span>${t}</span></li>`;
const appTile = (ic, t, c) => `<span class="mk-app" style="--c:${c}"><span class="mk-app__i">${i(ic)}</span><b>${t}</b></span>`;
const link = (ok = true) => `<span class="mk-link${ok ? ' mk-link--ok' : ''}">${i('arrow')}</span>`;

const timeline = (rows) => `<div class="mk-timeline">${rows.map(([ic, c, t, s, time]) =>
  `<div class="mk mk-event"><span class="mk-app__i" style="--c:${c}">${i(ic)}</span><span><b>${t}</b><small>${s}</small></span><span class="mk-event__t">${time}</span>${i('check', 'mk-i--ok')}</div>`).join('')}</div>`;

const inboxRow = (who, c, name, subj, right, unread = false) =>
  `<div class="mk-row${unread ? ' is-unread' : ''}">${av(who, c)}<span class="mk-row__t"><b>${name}</b><small>${subj}</small></span><span class="mk-row__r">${right}</span></div>`;

/* ---------- the scenes ---------- */
export const MOCKS = {
  'inbox-messy': () => `<div class="mk-stack">${win('Inbox', [
      inboxRow('RM', '#E8590C', 'Ravi Mehta', 'Price for 3 rooms? Need it today', '<small class="mk-warn">2 days</small>', true),
      inboxRow('SK', '#1864AB', 'Sarah Klein', 'Are you open on Saturday?', '<small class="mk-warn">1 day</small>', true),
      inboxRow('W', '#495057', 'Website form', 'New enquiry #212', '<small>Yesterday</small>', true),
      inboxRow('AP', '#7048E8', 'Amit Patel', 'Following up again…', chip('3rd message', 'warn'), true),
    ].join(''), { right: chip('47 unread', 'warn') })}
    <div class="mk-sticky mk-sticky--a">call Ravi back!!</div><div class="mk-sticky mk-sticky--b">update the sheet</div></div>`,

  'inbox-handled': () => win('Inbox', [
      inboxRow('RM', '#E8590C', 'Ravi Mehta', 'Price for 3 rooms?', chip('Replied 9:02', 'ok', 'check')),
      inboxRow('SK', '#1864AB', 'Sarah Klein', 'Are you open on Saturday?', chip('Booked Sat 11:00', 'ok', 'calendar')),
      inboxRow('W', '#495057', 'Website form', 'Bulk order, 200 units', chip('Sent to Priya', 'ai', 'user')),
      inboxRow('AP', '#7048E8', 'Amit Patel', 'Quote request', chip('Follow-up Thu', '', 'clock')),
    ].join(''), { right: chip('0 waiting', 'ok') }),

  'lead-card': () => card(`<div class="mk-person">${av('NJ', '#C2255C')}<span><b>Neha Joshi</b><small>New enquiry · website form</small></span>${chip('Hot lead', 'ok')}</div>
    ${field('Looking for', 'Kitchen renovation')}${field('Budget', 'Fits your range')}${field('Timeline', 'This month')}
    <div class="mk-foot">${i('check')} Follow-up sent 2 min after enquiry</div>`),

  'email-draft': () => win('Draft reply', `<p class="mk-p"><b>To:</b> Sarah Klein</p>
    <p class="mk-p">Hi Sarah, yes, we are open on Saturday from 10 to 4. Would 11:00 suit you? I can hold it for you.</p>
    <div class="mk-row mk-row--plain">${chip('Written from your FAQ', 'ai', 'spark')}</div>
    <div class="mk-btns"><span class="mk-btn mk-btn--pri">Approve &amp; send</span><span class="mk-btn">Edit</span></div>`, { right: chip('Ready for review', 'ai') }),

  'invoice-extract': () => `<div class="mk-flow">${card(`<div class="mk-doc">${i('file')}<b>INV-2291.pdf</b><i></i><i></i><i class="s"></i><i></i><i class="s"></i></div>`, 'mk-card--doc')}
    ${link()}${card(`${field('Supplier', 'Green Leaf Ltd')}${field('Amount', '18,450.00')}${field('Due', '30 Nov')}<div class="mk-foot">${i('check')} Added to accounts sheet</div>`)}</div>`,

  'tool-chain': () => `<div class="mk-chainwrap"><div class="mk-chain">${appTile('form', 'Form', '#E8590C')}${link()}${appTile('db', 'CRM', '#1864AB')}${link()}${appTile('sheet', 'Sheet', '#1E9E5A')}${link()}${appTile('mail', 'Email', '#C92A2A')}</div>
    <div class="mk-chain__note">${chip('Synced 1 min ago', 'ok', 'check')}</div></div>`,

  'report-message': () => `<div class="mk mk-phone mk-phone--sm"><div class="mk-phone__top">${av('O', '#0E4F47')}<b>Weekly summary</b><small>Mon 8:00</small></div>
    <div class="mk-phone__body">${bubble(`<b>Last week</b><span class="mk-kv"><span>Enquiries</span><b>42</b></span><span class="mk-kv"><span>Booked</span><b>15</b></span><span class="mk-kv"><span>Need a call back</span><b>3</b></span>`, 'in', 'Full report attached · PDF')}</div></div>`,

  'quote-tool': () => win('New quote', `${field('Client', 'Ravi Mehta')}${field('Service', 'Deep clean · 3 rooms')}${field('Date', 'Sat 30 Nov')}
    <div class="mk-btns"><span class="mk-btn mk-btn--pri">Generate quote</span></div><div class="mk-foot">${i('file')} Quote_Ravi_Mehta.pdf emailed</div>`),

  'call-screen': () => `<div class="mk mk-phone mk-phone--call"><div class="mk-call__top"><span class="mk-call__live"></span>AI assistant · on a call</div>
    <div class="mk-call__who">${av('PS', '#C2255C')}<b>Priya Sharma</b><small>New enquiry · 1:12</small></div>
    <div class="mk-wave" aria-hidden="true">${Array.from({ length: 22 }, (_, k) => `<i style="--h:${[30, 60, 45, 80, 50, 90, 35, 70, 55, 85, 40, 65, 30, 75, 50, 95, 45, 60, 35, 80, 50, 40][k]}%"></i>`).join('')}</div>
    <div class="mk-call__tx">${bubble('Is Tuesday morning free for a cleaning?', 'in')}${bubble('Yes, I can book you at 10:30 on Tuesday. Shall I confirm that?', 'out')}</div></div>`,

  'chat-booking': () => `<div class="mk mk-phone"><div class="mk-phone__top">${av('BS', '#0E8A7B')}<b>Bright Smile Dental</b><small>AI assistant</small></div>
    <div class="mk-phone__body">${bubble('Hi, can I book a cleaning this week?', 'in', '11:48 pm')}
    ${bubble('Of course! I have Tuesday 10:30 or Thursday 4:00. Which suits you?', 'out', 'AI assistant')}
    ${bubble('Tuesday please', 'in')}
    <div class="mk-booked">${i('check')}<span><b>Booked · Tue 10:30</b><small>Confirmation sent</small></span></div></div></div>`,

  'missed-calls': () => `<div class="mk mk-phone"><div class="mk-phone__top"><b>Recent calls</b></div><div class="mk-phone__body mk-list">
    ${['9:14', '11:02', '1:47', '4:30'].map((t, k) => `<div class="mk-row mk-row--call">${i('missed', 'mk-i--warn')}<span class="mk-row__t"><b>${['+91 98•• ••• 210', 'Unknown', '+44 77•• •••• 08', '+91 99•• ••• 551'][k]}</b><small>Missed call</small></span><small>${t}</small></div>`).join('')}
    <div class="mk-foot mk-foot--warn">${i('clock')} No one called them back</div></div></div>`,

  'task-checklist': () => card(`<div class="mk-person">${av(i('bot'), '#7048E8')}<span><b>Refund request #881</b><small>Handled by your AI agent</small></span></div>
    <ul class="mk-steps">${step('done', 'Read the customer’s email')}${step('done', 'Found order #5521')}${step('done', 'Checked your refund policy')}${step('wait', 'Waiting for your approval')}</ul>`),

  'agent-handoff': () => `<div class="mk-chainwrap"><div class="mk-chain mk-chain--agents">${appTile('mail', 'Intake agent', '#1864AB')}${link()}${appTile('search', 'Research agent', '#7048E8')}${link()}${appTile('chat', 'Reply agent', '#2B8A3E')}</div>
    <div class="mk-chain__note">${chip('Ticket #312 · answered in 4 min', 'ok', 'check')}</div></div>`,

  'approval-card': () => card(`<div class="mk-person">${av(i('bell'), '#E67700')}<span><b>Approval needed</b><small>From your support agent</small></span></div>
    <p class="mk-p">Send a 10% discount code to <b>Meera S.</b>?</p><p class="mk-p mk-muted">Reason: her last two orders arrived late.</p>
    <div class="mk-btns"><span class="mk-btn mk-btn--pri">Approve</span><span class="mk-btn">Decline</span></div>`),

  'knowledge-answer': () => card(`<div class="mk-search">${i('search')}What is our cancellation policy?</div>
    <p class="mk-p">Free cancellation up to 24 hours before the appointment. After that, a fee of one session applies.</p>
    ${chip('Booking-policy.pdf · page 2', '', 'file')}`),

  'order-chain': () => timeline([
      ['form', '#E8590C', 'New order received', 'Website form', '09:41'],
      ['db', '#1864AB', 'Customer added', 'CRM', '09:41'],
      ['file', '#1E9E5A', 'Invoice #1043 created', 'Accounts', '09:41'],
      ['chat', '#2B8A3E', 'Team notified', 'Team chat', '09:42'],
    ]),

  'enquiry-timeline': () => timeline([
      ['form', '#E8590C', 'Enquiry from Neha Joshi', 'Website form', '09:00'],
      ['spark', '#7048E8', 'Scored as a hot lead', 'Budget and timeline fit', '09:00'],
      ['mail', '#C92A2A', 'Reply sent', 'Drafted by AI, approved by you', '09:02'],
      ['calendar', '#1864AB', 'Call booked', 'Thursday 11:00', '09:05'],
    ]),

  'sheet-manual': () => `<div class="mk-stack">${win('orders.xlsx', `<div class="mk-grid">${[
      ['Customer', 'Item', 'Qty', 'Invoice'],
      ['Ravi M.', 'Chairs', '12', '1039'],
      ['Sarah K.', 'Tables', '3', '<span class="mk-typing">10|</span>'],
      ['<span class="mk-err">Amti P.</span>', 'Lamps', '', ''],
      ['', '', '', ''],
    ].map((r, k) => `<div class="mk-grid__r${k === 0 ? ' is-h' : ''}">${r.map(c => `<span>${c}</span>`).join('')}</div>`).join('')}</div>`)}
    <div class="mk-sticky mk-sticky--a">copy from email → paste here</div></div>`,

  'sheet-synced': () => win('orders.xlsx', `<div class="mk-grid">${[
      ['Customer', 'Item', 'Qty', 'Invoice'],
      ['Ravi M.', 'Chairs', '12', '1039'],
      ['Sarah K.', 'Tables', '3', '1040'],
      ['Amit P.', 'Lamps', '8', '1041'],
      ['Neha J.', 'Shelves', '2', '1042'],
    ].map((r, k) => `<div class="mk-grid__r${k === 0 ? ' is-h' : k > 2 ? ' is-new' : ''}">${r.map(c => `<span>${c}</span>`).join('')}</div>`).join('')}</div>`, { right: chip('Synced from orders', 'ok', 'check') }),

  'process-map': () => card(`<b class="mk-h">Order process today</b><ul class="mk-pmap">${[
      ['Order arrives by email', 'manual'], ['Copied into the sheet', 'automate'], ['Invoice typed up', 'automate'],
      ['Payment chased', 'automate'], ['Special requests checked', 'keep'],
    ].map(([t, k]) => `<li><span>${t}</span>${chip(k === 'manual' ? 'Trigger' : k === 'automate' ? 'Automate' : 'Keep with a person', k === 'automate' ? 'ok' : k === 'keep' ? 'ai' : '')}</li>`).join('')}</ul>`),

  'enquiry-routing': () => `<div class="mk-flow mk-flow--col">${card(`<div class="mk-person">${av(i('mail'), '#C92A2A')}<span><b>Bulk order for 200 units</b><small>info@ inbox · 10:14</small></span></div>`)}
    <div class="mk-tags">${chip('Sales', 'ai', 'spark')}${chip('High value', 'ai')}</div>
    ${card(`<div class="mk-person">${av('AK', '#1864AB')}<span><b>Sent to Arjun · Sales</b><small>With the customer’s history attached</small></span>${i('check', 'mk-i--ok')}</div>`)}</div>`,

  'form-to-doc': () => `<div class="mk-flow">${card(`${field('Name', 'Meera Shah')}${field('Plan', 'Annual')}${field('Start', '1 Dec')}`)}${link()}
    ${card(`<div class="mk-doc">${i('file')}<b>Agreement.pdf</b><i></i><i class="s"></i><i></i></div><div class="mk-foot">${i('check')} Sent for signature</div>`, 'mk-card--doc')}</div>`,

  'ai-plan': () => win('Your AI plan · Bright Smile Dental', `<div class="mk-plan">${[
      ['1', 'Instant replies to enquiries', ['High impact', 'ok'], ['Low effort', 'ok'], 'Start here'],
      ['2', 'Appointment reminders', ['High impact', 'ok'], ['Low effort', 'ok'], ''],
      ['3', 'Invoice data entry', ['Medium', ''], ['Medium', ''], ''],
      ['4', 'AI phone assistant', ['High impact', 'ok'], ['More effort', 'ai'], 'Later'],
    ].map(([n, t, a, b, tag]) => `<div class="mk-plan__r"><span class="mk-plan__n">${n}</span><b>${t}</b><span class="mk-tags">${chip(a[0], a[1])}${chip(b[0], b[1])}${tag ? chip(tag, tag === 'Later' ? '' : 'pri') : ''}</span></div>`).join('')}</div>`, { right: chip('3 quick wins', 'ok') }),

  'idea-cloud': () => `<div class="mk-cloud">${['Do we need a chatbot?', 'Which tool?', 'Is our data safe?', 'Where do we even start?', 'What will it cost?', 'Will the team use it?']
      .map((t, k) => `<span class="mk-q mk-q--${k}">${t.replace('?', '<b>?</b>')}</span>`).join('')}</div>`,

  'roadmap': () => `<div class="mk-road">${[
      ['Now', ['Instant enquiry replies', 'Appointment reminders']],
      ['Next', ['Invoice data entry', 'Weekly AI report']],
      ['Later', ['AI phone assistant']],
    ].map(([h, items], k) => `<div class="mk-road__c mk-road__c--${k}"><b>${h}</b>${items.map(t => `<span class="mk mk-road__i">${t}</span>`).join('')}</div>`).join('')}</div>`,

  'readiness-check': () => card(`<b class="mk-h">AI readiness</b>${[
      ['Data in one place', 2], ['Clear, repeatable processes', 3], ['Tools that connect', 2], ['Team ready to try it', 1],
    ].map(([t, n]) => `<div class="mk-meter"><span>${t}</span><span class="mk-dots">${[1, 2, 3].map(d => `<i${d <= n ? ' class="on"' : ''}></i>`).join('')}</span></div>`).join('')}`),

  'process-audit': () => card(`<b class="mk-h">Where the week goes</b>${[
      ['Answering enquiries', 85], ['Copying orders into sheets', 60], ['Chasing payments', 40], ['Weekly reporting', 25],
    ].map(([t, w]) => `<div class="mk-bar"><span>${t}</span><span class="mk-bar__t"><i style="width:${w}%"></i></span></div>`).join('')}<div class="mk-foot">${i('spark')} Top 3 can be automated</div>`),

  'impact-matrix': () => `<div class="mk mk-matrix"><span class="mk-matrix__y">Impact</span><span class="mk-matrix__x">Effort</span>
    <span class="mk-matrix__q">Quick wins</span>
    ${[['Enquiry replies', 8, 20, 'ok'], ['Reminders', 22, 36, 'ok'], ['Invoices', 40, 56, ''], ['Phone assistant', 56, 18, 'ai'], ['New CRM', 62, 70, 'muted']]
      .map(([t, x, y, k]) => `<span class="mk-pt mk-pt--${k || 'n'}" style="left:${x}%;top:${y}%">${t}</span>`).join('')}</div>`,

  'tool-compare': () => card(`<div class="mk-cmp"><span></span><b>Option A</b><b>Option B</b>
    ${[['Works with your CRM', 1, 1], ['Data stays in your region', 1, 0], ['Fits your budget', 1, 1], ['Easy for the team', 1, 0]]
      .map(([t, a, b]) => `<span>${t}</span>${[a, b].map(v => v ? i('check', 'mk-i--ok') : i('x', 'mk-i--warn')).join('')}`).join('')}</div>
    <div class="mk-foot">${i('check')} Recommended: Option A</div>`),

  'risk-list': () => card(`<b class="mk-h">${i('shield')} Safeguards</b><ul class="mk-steps">${step('done', 'Customer data stays private')}${step('done', 'AI answers only from your documents')}${step('done', 'A person approves refunds and offers')}${step('done', 'Every action is logged')}</ul>`),

  'team-guide': () => win('Guide · Using the enquiry assistant', `<ol class="mk-ol"><li>Check drafts in the <b>Review</b> tab</li><li>Approve, or edit and send</li><li>Flag anything odd with one click</li></ol>
    <div class="mk-foot">${i('user')} 20-minute team walkthrough</div>`),

  /* ---------- websites (Web Development page): a made-up gift shop ---------- */
  'site-desktop': () => `<div class="mk mk-win mk-browser"><div class="mk__bar"><span class="mk__dots"><i></i><i></i><i></i></span><span class="mk-url">${i('shield')}riyasgiftcorner.in</span></div>
    <div class="mk-site">
      <div class="mk-site__nav"><b>Riya’s <em>Gift Corner</em></b><span>Hampers</span><span>Corporate</span><span>About</span><span class="mk-site__btn">Order now</span></div>
      <div class="mk-site__hero"><div><small>Same-day delivery in Pune</small><h4>Gifts for every occasion, wrapped with care.</h4>
        <div class="mk-btns"><span class="mk-btn mk-btn--pri">Shop hampers</span><span class="mk-btn">${i('chat')} WhatsApp us</span></div></div>
        <div class="mk-site__img"><span class="mk-gift"></span></div></div>
      <div class="mk-site__row">${['Diwali hampers', 'Birthday boxes', 'Corporate gifts'].map((t, k) => `<span class="mk-site__tile mk-site__tile--${k}"><i></i>${t}</span>`).join('')}</div>
    </div></div>`,

  'site-old': () => `<div class="mk mk-win mk-browser mk-old"><div class="mk__bar"><span class="mk__dots"><i></i><i></i><i></i></span><span class="mk-url mk-url--bad">${i('x')}riyasgiftcorner.com/index.html</span></div>
    <div class="mk-old__body">
      <div class="mk-old__marquee">★ WELCOME TO OUR WEBSITE ★ BEST GIFTS IN TOWN ★</div>
      <p class="mk-old__h">Riya Gift Corner</p>
      <p class="mk-old__p">We are leading gift shop since 2009. We are dealing in all types of gifts items, hampers, soft toys, show pieces etc. For more details please visit our shop.</p>
      <div class="mk-old__cols"><span class="mk-old__img">${i('x')}</span><span class="mk-old__links"><u>Home</u> | <u>Products</u> | <u>Gallery</u> | <u>Contact</u></span></div>
      <div class="mk-old__uc">🚧 Page under construction 🚧</div>
      <p class="mk-old__p">Visitors: 004213 · Best viewed in 1024×768</p>
    </div></div>`,

  'site-phone': () => `<div class="mk mk-phone mk-mob"><div class="mk-mob__top"><b>Riya’s <em>Gift Corner</em></b><span class="mk-mob__menu"><i></i><i></i><i></i></span></div>
    <div class="mk-mob__img"><span class="mk-gift"></span></div>
    <div class="mk-mob__body"><h4>Gifts for every occasion.</h4><p>Hampers delivered the same day across Pune.</p>
      <span class="mk-btn mk-btn--pri mk-btn--block">Shop hampers</span>
      <div class="mk-mob__row">${[0, 1, 2].map(k => `<span class="mk-site__tile mk-site__tile--${k}"><i></i></span>`).join('')}</div></div>
    <div class="mk-mob__bar"><span>${i('phone')} Call</span><span class="mk-mob__wa">${i('chat')} WhatsApp</span></div></div>`,

  'site-form': () => card(`<b class="mk-h">Ask about a custom hamper</b>
    <div class="mk-input"><span>Name</span>Ananya Kulkarni</div><div class="mk-input"><span>Phone</span>98•• ••• 412</div>
    <div class="mk-input mk-input--area"><span>What do you need?</span>40 hampers for our office, by Friday</div>
    <span class="mk-btn mk-btn--pri mk-btn--block">Send enquiry</span>
    <div class="mk-foot">${i('check')} Thanks! We’ll reply within the hour.</div>`),

  'landing-page': () => `<div class="mk mk-phone mk-mob mk-lp"><div class="mk-mob__body">${chip('Diwali 2026', 'warn')}<h4>Corporate gift hampers, delivered to every desk.</h4>
    <ul class="mk-steps">${step('done', 'Your logo on every box')}${step('done', 'From 20 to 2,000 hampers')}${step('done', 'Delivered across India')}</ul>
    <span class="mk-btn mk-btn--pri mk-btn--block">Get a quote in 1 hour</span></div></div>`,

  'shop-product': () => card(`<div class="mk-prod__img"><span class="mk-gift mk-gift--sm"></span>${chip('Bestseller', 'ok')}</div>
    <div class="mk-person"><span><b>Brass diya gift set</b><small>Hand-polished · gift wrapped</small></span><b class="mk-price">₹1,299</b></div>
    <div class="mk-btns"><span class="mk-btn mk-btn--pri">Add to cart</span><span class="mk-btn">Buy now</span><span class="mk-cart">${i('check')} Cart (2)</span></div>`),

  'cms-edit': () => win('Edit page · Home', `<div class="mk-cms"><div class="mk-cms__page"><small>Heading</small><span class="mk-cms__edit">Gifts for every occasion<i class="mk-caret"></i></span>
      <small>Offer banner</small><span class="mk-cms__field">Free wrapping this week</span></div>
      <div class="mk-cms__side"><span class="mk-btn mk-btn--pri">Publish</span><span class="mk-btn">Preview</span></div></div>
    <div class="mk-foot">${i('check')} Updated by you. No developer needed.</div>`, { right: chip('Draft saved', 'ok') }),

  'web-app': () => win('Bookings · Today', `${[
      ['10:00', 'Ananya K.', 'Hamper pickup', ['Confirmed', 'ok']],
      ['11:30', 'Rohit S.', 'Custom order call', ['New', 'ai']],
      ['14:00', 'Meera P.', 'Corporate quote', ['Confirmed', 'ok']],
      ['16:15', 'Vikram J.', 'Delivery slot', ['Rescheduled', '']],
    ].map(([t, n, w, [s, k]]) => `<div class="mk-row"><span class="mk-time">${t}</span><span class="mk-row__t"><b>${n}</b><small>${w}</small></span>${chip(s, k)}</div>`).join('')}`, { right: chip('4 today', '') }),

  'search-result': () => card(`<div class="mk-search">${i('search')}gift hampers in Pune</div>
    <div class="mk-serp"><small>riyasgiftcorner.in › hampers</small><b>Gift Hampers in Pune · Same-Day Delivery | Riya’s Gift Corner</b>
      <p>Diwali, birthday and corporate hampers, wrapped by hand and delivered across Pune the same day. Order online or on WhatsApp.</p>
      <div class="mk-tags">${chip('Diwali hampers')}${chip('Corporate gifts')}${chip('Contact')}</div></div>
    <div class="mk-foot">${i('check')} Mobile-friendly · loads in 1.1 s</div>`),
};
export const MOCK_IDS = Object.keys(MOCKS);
export const mock = (id) => (MOCKS[id] ? MOCKS[id]() : '');

/* Stock photos (media/stock/, Unsplash License, sources in CREDITS.md):
   a real person in the visitor's situation, with the mockups laid over
   it. Indian business owners and settings, chosen per page: the hero
   (the owner, or their customer), "Today" (the strain) and "After" (the
   relief). [file, width, height, object-position] */
const STOCK = {
  'ai-automation': {
    hero: ['automation-hero', 1400, 788, '30% 35%'], before: ['automation-today', 1400, 788, '45% 28%'], after: ['automation-after', 1400, 788, '50% 30%'] },
  'ai-agent-development': {
    hero: ['agents-hero', 1400, 934, '12% 30%'], before: ['agents-today', 1400, 930, '35% 28%'], after: ['agents-after', 826, 1100, '72% 42%'] },
  'workflow-automation': {
    hero: ['workflow-hero', 1200, 796, '48% 55%'], before: ['workflow-today', 734, 1100, '50% 28%'], after: ['workflow-after', 1400, 788, '25% 32%'] },
  'web-development': {
    hero: ['web-hero', 1200, 842, '28% 30%'], before: ['web-today', 900, 676, '50% 30%'], after: ['web-after', 720, 900, '50% 48%'] },
  'ai-consulting': {
    hero: ['consulting-hero', 1200, 654, '72% 45%'], before: ['consulting-today', 1400, 934, '50% 35%'], after: ['consulting-after', 826, 1100, '50% 62%'] },
};
const photo = ([f, w, h, pos], eager = false) => `<img src="/media/stock/${f}.webp" alt="" width="${w}" height="${h}" style="object-position:${pos}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
/* any stock photo by file name (homepage cards): sizes and crops from STOCK,
   plus the photos used only on the homepage */
const HOME_PHOTOS = {
  'contact-message': ['contact-message', 1200, 676, '50% 30%'],
  'about-problem': ['about-problem', 900, 600, '50% 40%'], 'about-cost': ['about-cost', 900, 534, '45% 40%'],
  'about-running': ['about-running', 900, 600, '45% 40%'], 'about-loop': ['about-loop', 600, 900, '50% 40%'],
  'about-clinic': ['about-clinic', 900, 600, '50% 30%'], 'about-food': ['about-food', 900, 600, '62% 35%'],
  'home-local': ['home-local', 600, 900, '50% 45%'], 'home-growing': ['home-growing', 900, 600, '50% 45%'],
  'home-services': ['home-services', 900, 600, '50% 35%'], 'home-international': ['home-international', 900, 506, '64% 30%'],
};
const PHOTO_BY_FILE = { ...HOME_PHOTOS, ...Object.fromEntries(Object.values(STOCK).flatMap(s => Object.values(s)).map(p => [p[0], p])) };
export const stockImg = (file) => PHOTO_BY_FILE[file] ? photo(PHOTO_BY_FILE[file]) : '';

/* the photo strip above a before/after mockup; k = 'before' | 'after' */
export const sidePhoto = (slug, k) => STOCK[slug] && STOCK[slug][k] ? `<div class="ba__photo">${photo(STOCK[slug][k])}</div>` : '';

/* Hero scenes: a photo, one main mockup over its corner and notifications
   floating on top. Without a photo, the mockup sits on a dot-grid card. */
export const HERO_SCENES = {
  'ai-automation': { main: 'enquiry-timeline', toasts: [['spark', 'New lead qualified', 'Neha Joshi · Hot lead'], ['mail', 'Reply drafted', 'Waiting for your approval', 'ai']] },
  'ai-agent-development': { main: 'chat-booking', toasts: [['calendar', 'Appointment booked', 'Tue 10:30 · confirmation sent'], ['bell', 'Summary sent', 'To the clinic owner', 'ai']] },
  'workflow-automation': { main: 'order-chain', toasts: [['sheet', 'Sheet updated', 'Row 214 · nobody typed it']] },
  'web-development': { main: 'site-desktop', toasts: [['mail', 'New enquiry', 'From your website · 2 min ago'], ['spark', 'Loads in 1.1 s', 'On a phone', 'ai']] },
  'ai-consulting': { main: 'ai-plan', toasts: [['spark', 'Opportunities found', '3 quick wins, 1 bigger project', 'ai']] },
};
export const heroScene = (slug) => {
  const h = HERO_SCENES[slug];
  if (!h) return '';
  const ph = STOCK[slug] && STOCK[slug].hero;
  return `<div class="mk-scene mk-scene--${slug}${ph ? ' mk-scene--photo' : ''}" aria-hidden="true">
    ${ph ? `<div class="mk-scene__photo">${photo(ph, true)}</div>` : ''}
    <div class="mk-scene__main">${mock(h.main)}</div>
    ${h.toasts.map(([ic, t, s, k], n) => `<div class="mk-scene__toast mk-scene__toast--${n}" style="--n:${n}">${toast(ic, t, s, k)}</div>`).join('')}
  </div>`;
};
