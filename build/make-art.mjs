/* Generates the category and insight visuals as local SVG.
   Custom art rather than stock: nothing hotlinked, nothing licensed,
   and each one actually depicts its category.
   Run: node build/make-art.mjs                                          */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200, H = 900;

const C = {
  bg:   '#EDEDEA', surface: '#FFFFFF', sunk: '#E3E3DE',
  ink:  '#111314', ink2: '#6E7378', line: '#D8D8D2',
  acc:  '#0E4F47', accSoft: '#DCEAE6', warm: '#C8894B',
};

const shell = (body, bg = C.bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
<rect width="${W}" height="${H}" fill="${bg}"/>
${body}
</svg>`;

/* shared pieces ------------------------------------------------------- */
const win = (x, y, w, h, fill = C.surface) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${C.line}" stroke-width="2"/>
  <path d="M${x} ${y + 46}h${w}" stroke="${C.line}" stroke-width="2"/>
  <circle cx="${x + 24}" cy="${y + 23}" r="5" fill="${C.line}"/>
  <circle cx="${x + 42}" cy="${y + 23}" r="5" fill="${C.line}"/>
  <circle cx="${x + 60}" cy="${y + 23}" r="5" fill="${C.line}"/>`;
const bar = (x, y, w, h, f = C.sunk, r = 6) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;

/* ---------- categories ---------- */
const art = {};

/* UI/UX — wireframe screens + a cursor */
art['ui-ux-design'] = shell(`
  ${win(120, 120, 620, 660)}
  ${bar(170, 200, 260, 26, C.ink)}
  ${bar(170, 246, 420, 14)}
  ${bar(170, 272, 340, 14)}
  <rect x="170" y="320" width="250" height="180" rx="14" fill="${C.accSoft}" stroke="${C.acc}" stroke-width="2"/>
  <rect x="440" y="320" width="250" height="180" rx="14" fill="${C.sunk}"/>
  ${bar(170, 536, 520, 14)} ${bar(170, 562, 420, 14)}
  ${bar(170, 618, 170, 44, C.ink, 22)}
  ${bar(360, 618, 140, 44, C.sunk, 22)}
  <rect x="780" y="250" width="300" height="470" rx="34" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <rect x="806" y="292" width="248" height="120" rx="12" fill="${C.acc}"/>
  ${bar(806, 432, 180, 12)} ${bar(806, 456, 240, 12)}
  ${bar(806, 500, 112, 90, C.sunk, 10)} ${bar(942, 500, 112, 90, C.sunk, 10)}
  ${bar(806, 620, 248, 40, C.ink, 20)}
  <path d="M612 470l0 64 16-14 12 26 14-7-12-25 22-2z" fill="${C.ink}"/>
`);

/* Web development — browser + structure + code */
art['web-development'] = shell(`
  ${win(110, 150, 980, 600)}
  <rect x="150" y="70" width="240" height="60" rx="14" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  ${bar(174, 92, 190, 16, C.sunk, 8)}
  ${bar(150, 232, 420, 34, C.ink)}
  ${bar(150, 284, 300, 16)}
  ${bar(150, 330, 150, 40, C.acc, 20)}
  <rect x="640" y="232" width="410" height="230" rx="14" fill="${C.sunk}"/>
  <g font-family="ui-monospace,monospace" font-size="21" fill="${C.ink2}">
    <text x="150" y="470">&lt;section class="hero"&gt;</text>
    <text x="182" y="506" fill="${C.acc}">&lt;h1&gt;Ostendic&lt;/h1&gt;</text>
    <text x="182" y="542">&lt;p&gt;…&lt;/p&gt;</text>
    <text x="150" y="578">&lt;/section&gt;</text>
  </g>
  ${bar(640, 494, 410, 14)} ${bar(640, 522, 330, 14)} ${bar(640, 550, 380, 14)}
  ${bar(640, 596, 176, 44, C.ink, 22)}
`);

/* Brand — type specimen + palette + marks */
art['brand-design'] = shell(`
  <rect x="110" y="120" width="500" height="470" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <text x="360" y="430" font-family="Georgia,serif" font-size="300" fill="${C.ink}" text-anchor="middle">Aa</text>
  ${bar(150, 520, 200, 14)} ${bar(150, 546, 300, 14)}
  <rect x="650" y="120" width="440" height="220" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <circle cx="726" cy="230" r="46" fill="${C.ink}"/>
  <circle cx="838" cy="230" r="46" fill="${C.acc}"/>
  <circle cx="950" cy="230" r="46" fill="${C.warm}"/>
  <circle cx="1046" cy="230" r="30" fill="${C.sunk}"/>
  <rect x="650" y="370" width="440" height="220" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <rect x="700" y="430" width="100" height="100" rx="50" fill="none" stroke="${C.ink}" stroke-width="10"/>
  <rect x="840" y="430" width="100" height="100" rx="14" fill="none" stroke="${C.ink}" stroke-width="10"/>
  <path d="M990 530l50-100 50 100z" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="110" y="630" width="980" height="150" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  ${bar(150, 676, 300, 22, C.ink)} ${bar(150, 714, 500, 14)} ${bar(700, 676, 350, 14)} ${bar(700, 704, 280, 14)}
`);

/* AI & automation — a flow that removes a manual step */
art['ai-automation'] = shell(`
  <g stroke="${C.line}" stroke-width="3" fill="none">
    <path d="M250 300h180M610 300h180M250 600h180M610 600h180"/>
    <path d="M520 360v180" stroke="${C.acc}" stroke-dasharray="10 10"/>
  </g>
  <g>
    <rect x="80" y="240" width="170" height="120" rx="16" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    ${bar(110, 276, 110, 14, C.ink)} ${bar(110, 302, 80, 12)}
    <text x="110" y="344" font-family="ui-monospace,monospace" font-size="15" fill="${C.ink2}">Enquiry</text>
  </g>
  <g>
    <rect x="430" y="230" width="180" height="140" rx="16" fill="${C.acc}"/>
    <circle cx="520" cy="286" r="26" fill="none" stroke="#fff" stroke-width="3"/>
    <circle cx="520" cy="286" r="7" fill="#fff"/>
    <text x="520" y="344" font-family="ui-monospace,monospace" font-size="15" fill="#fff" text-anchor="middle">Route</text>
  </g>
  <g>
    <rect x="790" y="240" width="200" height="120" rx="16" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    ${bar(820, 276, 140, 14, C.ink)} ${bar(820, 302, 100, 12)}
    <text x="820" y="344" font-family="ui-monospace,monospace" font-size="15" fill="${C.ink2}">Reply sent</text>
  </g>
  <g>
    <rect x="80" y="540" width="170" height="120" rx="16" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    ${bar(110, 576, 110, 14)} ${bar(110, 602, 70, 12)}
    <text x="110" y="644" font-family="ui-monospace,monospace" font-size="15" fill="${C.ink2}">Follow-up</text>
  </g>
  <g>
    <rect x="430" y="530" width="180" height="140" rx="16" fill="${C.surface}" stroke="${C.acc}" stroke-width="2"/>
    <path d="M492 600l20 20 38-42" stroke="${C.acc}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="520" y="644" font-family="ui-monospace,monospace" font-size="15" fill="${C.acc}" text-anchor="middle">Handled</text>
  </g>
  <g>
    <rect x="790" y="540" width="200" height="120" rx="16" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    ${bar(820, 576, 140, 14, C.ink)} ${bar(820, 602, 110, 12)}
    <text x="820" y="644" font-family="ui-monospace,monospace" font-size="15" fill="${C.ink2}">Converted</text>
  </g>
`);

/* E-commerce — product grid + cart */
art['ecommerce'] = shell(`
  ${win(110, 120, 980, 660)}
  ${bar(150, 200, 230, 24, C.ink)}
  ${bar(860, 196, 190, 34, C.sunk, 17)}
  <g>
    <rect x="150" y="262" width="270" height="230" rx="14" fill="${C.sunk}"/>
    <circle cx="285" cy="360" r="54" fill="${C.line}"/>
    ${bar(150, 508, 170, 16, C.ink)} ${bar(150, 534, 90, 14)}
    <rect x="440" y="262" width="270" height="230" rx="14" fill="${C.accSoft}"/>
    <rect x="530" y="316" width="90" height="90" rx="12" fill="${C.acc}"/>
    ${bar(440, 508, 200, 16, C.ink)} ${bar(440, 534, 110, 14)}
    <rect x="730" y="262" width="270" height="230" rx="14" fill="${C.sunk}"/>
    <path d="M820 400l45-70 45 70z" fill="${C.line}"/>
    ${bar(730, 508, 150, 16, C.ink)} ${bar(730, 534, 100, 14)}
  </g>
  <rect x="150" y="596" width="850" height="120" rx="14" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <path d="M196 636h34l22 58h74" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="268" cy="706" r="7" fill="${C.ink}"/>
  ${bar(350, 628, 220, 16, C.ink)} ${bar(350, 656, 300, 14)}
  ${bar(800, 634, 160, 44, C.acc, 22)}
`);

/* SaaS & product — dashboard */
art['saas-product-design'] = shell(`
  ${win(110, 120, 980, 660)}
  <rect x="110" y="166" width="220" height="614" fill="${C.sunk}"/>
  ${bar(146, 212, 140, 14, C.ink)}
  ${[0,1,2,3,4].map(i => bar(146, 268 + i*44, 148, 14)).join('')}
  ${bar(146, 268, 148, 14, C.acc)}
  ${bar(372, 212, 240, 22, C.ink)}
  <g>
    <rect x="372" y="268" width="210" height="130" rx="12" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    <text x="398" y="340" font-family="ui-sans-serif,sans-serif" font-size="42" font-weight="600" fill="${C.ink}">1.4s</text>
    ${bar(398, 360, 120, 12)}
    <rect x="606" y="268" width="210" height="130" rx="12" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    <text x="632" y="340" font-family="ui-sans-serif,sans-serif" font-size="42" font-weight="600" fill="${C.acc}">+38%</text>
    ${bar(632, 360, 140, 12)}
    <rect x="840" y="268" width="210" height="130" rx="12" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
    <text x="866" y="340" font-family="ui-sans-serif,sans-serif" font-size="42" font-weight="600" fill="${C.ink}">96</text>
    ${bar(866, 360, 110, 12)}
  </g>
  <rect x="372" y="430" width="678" height="300" rx="12" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  <path d="M410 680L500 620L590 646L680 552L770 580L860 498L950 520L1014 470"
        fill="none" stroke="${C.acc}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M410 680L500 620L590 646L680 552L770 580L860 498L950 520L1014 470L1014 706L410 706Z" fill="${C.accSoft}" opacity=".65"/>
  ${[0,1,2,3,4,5].map(i => bar(410 + i*110, 700, 60, 8, C.line, 4)).join('')}
`);

/* ---------- insight thumbnails ---------- */
const insight = (glyph, tint) => shell(`
  <rect x="0" y="0" width="${W}" height="${H}" fill="${tint}"/>
  <g opacity=".92">${glyph}</g>
`, tint);

art['insight-ai'] = insight(`
  <circle cx="600" cy="450" r="210" fill="none" stroke="${C.acc}" stroke-width="4"/>
  <circle cx="600" cy="450" r="120" fill="none" stroke="${C.acc}" stroke-width="4" opacity=".55"/>
  <circle cx="600" cy="450" r="34" fill="${C.acc}"/>
  ${[0,60,120,180,240,300].map(a => {
    const r = a * Math.PI / 180, x = 600 + Math.cos(r) * 210, y = 450 + Math.sin(r) * 210;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="${C.surface}" stroke="${C.acc}" stroke-width="4"/>
            <path d="M600 450L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${C.acc}" stroke-width="3" opacity=".4"/>`;
  }).join('')}
`, C.accSoft);

art['insight-web'] = insight(`
  ${win(180, 210, 840, 480)}
  ${bar(230, 300, 320, 28, C.ink)}
  ${bar(230, 348, 420, 14)} ${bar(230, 376, 340, 14)}
  ${bar(230, 424, 150, 42, C.acc, 21)}
  <rect x="640" y="300" width="330" height="270" rx="14" fill="${C.sunk}"/>
`, C.bg);

art['insight-automation'] = insight(`
  <g stroke="${C.ink}" stroke-width="4" fill="none" opacity=".9">
    <path d="M300 300h180M720 300h180M300 600h180M720 600h180M600 360v180"/>
  </g>
  <rect x="180" y="240" width="120" height="120" rx="60" fill="${C.surface}" stroke="${C.ink}" stroke-width="4"/>
  <rect x="480" y="240" width="240" height="120" rx="20" fill="${C.ink}"/>
  <rect x="900" y="240" width="120" height="120" rx="20" fill="${C.surface}" stroke="${C.ink}" stroke-width="4"/>
  <rect x="180" y="540" width="120" height="120" rx="20" fill="${C.surface}" stroke="${C.ink}" stroke-width="4"/>
  <rect x="480" y="540" width="240" height="120" rx="20" fill="${C.acc}"/>
  <rect x="900" y="540" width="120" height="120" rx="60" fill="${C.surface}" stroke="${C.acc}" stroke-width="4"/>
  <path d="M556 600l28 28 52-56" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
`, C.sunk);

/* ---------- write ---------- */
mkdirSync(join(ROOT, 'assets/categories'), { recursive: true });
mkdirSync(join(ROOT, 'assets/insights'), { recursive: true });
let n = 0;
for (const [k, svg] of Object.entries(art)) {
  const dir = k.startsWith('insight-') ? 'assets/insights' : 'assets/categories';
  const file = join(ROOT, dir, `${k.replace('insight-', '')}.svg`);
  writeFileSync(file, svg, 'utf8');
  console.log(`  ${dir}/${k.replace('insight-', '')}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
  n++;
}
console.log(`\n${n} visuals written.`);
