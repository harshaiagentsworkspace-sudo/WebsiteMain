// All landing page sections.

// ───────────────────────── NAVBAR ─────────────────────────
function Navbar({ onOpenMenu, active = 'home' }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
  ['Home', 'Vexel Landing.html#hero', 'home'],
  ['Services', 'Vexel Landing.html#services', 'services'],
  ['Work', 'Vexel Landing.html#testimonials', 'work'],
  ['Resources', 'Resources.html', 'resources'],
  ['Pricing', 'Vexel Landing.html#pricing', 'pricing'],
  ['FAQ', 'Vexel Landing.html#faq', 'faq']];


  return (
    <header className={"fixed top-0 inset-x-0 z-50 transition-all duration-300 " + (scrolled ? 'nav-scrolled' : '')}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
        <a href="Vexel Landing.html" className="shrink-0"><Wordmark /></a>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full glass">
          {links.map(([label, href, key]) => {
            const isActive = key === active;
            return (
              <a key={label} href={href}
              className={"px-4 py-1.5 text-[13.5px] rounded-full transition-colors " + (
              isActive ?
              'text-white bg-violet-deep/25 ring-1 ring-inset ring-violet-soft/40' :
              'text-white/75 hover:text-white hover:bg-white/5')}>
                {label}
              </a>);

          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#cta" className="hidden sm:inline-flex items-center gap-2 btn-grad text-white text-[13.5px] font-medium px-4 py-2 rounded-full">
            Book a Call <IconArrowRight size={14} />
          </a>
          <button onClick={onOpenMenu} className="md:hidden p-2 rounded-lg btn-ghost text-white/80" aria-label="Menu">
            <IconMenu size={20} />
          </button>
        </div>
      </div>
    </header>);

}

// ───────────────────────── FLOATING HERO ORNAMENTS ─────────────────────────
function HeroOrnaments() {
  return (
    <>
      {/* Orbital rings */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 -bottom-8 pointer-events-none" aria-hidden="true">
        <svg width="1100" height="500" viewBox="0 0 1100 500" className="opacity-70">
          <defs>
            <linearGradient id="ringG" x1="0" x2="1">
              <stop offset="0" stopColor="#C084FC" stopOpacity="0" />
              <stop offset=".4" stopColor="#C084FC" stopOpacity=".55" />
              <stop offset=".6" stopColor="#7C5CFF" stopOpacity=".55" />
              <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="orbCore" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".4" stopColor="#C084FC" stopOpacity=".7" />
              <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[180, 230, 280].map((r, i) =>
          <ellipse key={i} cx="550" cy="420" rx={r * 1.7} ry={r * 0.5}
          fill="none" stroke="url(#ringG)" strokeWidth={i === 1 ? 1.4 : 1} />
          )}
          <circle cx="550" cy="420" r="60" fill="url(#orbCore)" opacity=".7" />
          {/* dots on rings */}
          <circle cx="220" cy="420" r="3" fill="#C084FC" />
          <circle cx="880" cy="420" r="3" fill="#A855F7" />
          <circle cx="320" cy="295" r="2.5" fill="#fff" opacity=".8" />
          <circle cx="780" cy="305" r="2" fill="#fff" opacity=".6" />
        </svg>
      </div>

      {/* Floating chip — top left */}
      <div className="hidden lg:flex absolute -left-2 top-10 glass rounded-2xl px-4 py-3 items-center gap-3 z-20"
      style={{ boxShadow: '0 20px 50px -20px rgba(124,92,255,.5)', animation: 'floatA 6s ease-in-out infinite' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-mid to-violet-deep">
          <IconBolt size={16} />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">Deploy time</div>
          <div className="text-[15px] font-semibold leading-tight">2.4s <span className="text-emerald-300/80 text-[11px] font-mono">▼ 71%</span></div>
        </div>
      </div>

      {/* Floating chip — top right */}
      <div className="hidden lg:flex absolute -right-4 top-24 glass rounded-2xl px-4 py-3 items-center gap-3 z-20"
      style={{ boxShadow: '0 20px 50px -20px rgba(168,85,247,.5)', animation: 'floatB 7s ease-in-out infinite' }}>
        <div className="flex -space-x-2">
          {['MH', 'DA', 'PC'].map((i, idx) =>
          <div key={i} className="w-7 h-7 rounded-full border-2 border-ink-900 flex items-center justify-center text-[10px] font-semibold"
          style={{ background: `linear-gradient(135deg, oklch(0.7 0.2 ${260 + idx * 25}), oklch(0.5 0.22 ${280 + idx * 25}))` }}>
              {i}
            </div>
          )}
        </div>
        <div className="text-left">
          <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">Active builds</div>
          <div className="text-[15px] font-semibold leading-tight">3 sprints live</div>
        </div>
      </div>

      {/* Floating chip — bottom left */}
      <div className="hidden lg:flex absolute left-4 bottom-24 glass rounded-xl px-3.5 py-2.5 items-center gap-2.5 z-20"
      style={{ animation: 'floatA 8s ease-in-out infinite -2s' }}>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <div className="text-[12px] font-mono text-white/75">agent.qualify_lead → ok</div>
      </div>

      {/* Floating chip — bottom right */}
      <div className="hidden lg:flex absolute right-2 bottom-32 glass rounded-2xl px-4 py-3 flex-col z-20"
      style={{ boxShadow: '0 20px 50px -20px rgba(124,92,255,.5)', animation: 'floatB 6.5s ease-in-out infinite -1s' }}>
        <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">Conversion ↑</div>
        <svg width="120" height="36" viewBox="0 0 120 36">
          <defs>
            <linearGradient id="sparkL" x1="0" x2="1"><stop offset="0" stopColor="#C084FC" /><stop offset="1" stopColor="#7C5CFF" /></linearGradient>
          </defs>
          <path d="M2 28 L20 24 L36 26 L54 18 L72 20 L90 10 L118 4" fill="none" stroke="url(#sparkL)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="118" cy="4" r="3" fill="#C084FC" />
        </svg>
        <div className="text-[14px] font-semibold mt-1">6.2% → 18.4%</div>
      </div>

      {/* Sparkle dots */}
      {[
      ['8%', '38%', 4], ['92%', '46%', 3], ['18%', '70%', 5], ['80%', '78%', 4],
      ['50%', '12%', 3], ['28%', '20%', 2], ['72%', '18%', 2.5]].
      map(([l, t, s], i) =>
      <div key={i} className="absolute pointer-events-none" style={{ left: l, top: t }}>
          <div className="rounded-full bg-violet-soft" style={{ width: s, height: s, boxShadow: `0 0 ${s * 4}px ${s}px rgba(192,132,252,.6)` }} />
        </div>
      )}

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
      `}</style>
    </>);

}

// ───────────────────────── DASHBOARD MOCKUP ─────────────────────────
// Original abstract dashboard — not based on any real product.
function DashboardMock() {
  return (
    <div className="relative w-full max-w-[1080px] mx-auto">
      {/* Glow under */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-[80%] h-[260px] glow-orb violet" style={{ opacity: .85 }} />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 w-[60%] h-[200px] glow-orb deep" style={{ opacity: .6 }} />
      <div className="relative tilt-3d rounded-2xl overflow-hidden glass-strong"
      style={{ boxShadow: '0 60px 140px -40px rgba(124,92,255,.65), 0 0 0 1px rgba(255,255,255,0.08) inset' }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/30">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <div className="ml-3 flex-1 max-w-[280px]">
            <div className="h-6 rounded-md bg-white/5 border border-white/5 px-3 flex items-center text-[11px] font-mono text-white/40">
              vexel.studio / dashboard
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-mid to-violet-deep" />
          </div>
        </div>

        <div className="grid grid-cols-12 min-h-[340px]">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-white/5 p-4 hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-3">Workspace</div>
            {['Projects', 'Agents', 'Integrations', 'Analytics', 'Billing'].map((x, i) =>
            <div key={x} className={"flex items-center gap-2.5 px-2 py-1.5 rounded-md mb-1 text-[12px] " + (i === 1 ? 'bg-violet-deep/15 text-white' : 'text-white/55')}>
                <span className={"w-1.5 h-1.5 rounded-full " + (i === 1 ? 'bg-violet-soft' : 'bg-white/20')} />
                {x}
              </div>
            )}
            <div className="mt-6 text-[10px] font-mono uppercase tracking-wider text-white/30 mb-2">Pinned</div>
            {['Founder Site', 'Onboarding Bot'].map((x) =>
            <div key={x} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] text-white/55">
                <span className="w-3 h-3 rounded-sm bg-white/10" /> {x}
              </div>
            )}
          </aside>

          {/* Main */}
          <main className="col-span-12 sm:col-span-9 p-5">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
              ['Conversions', '12.4%', '+3.1'],
              ['Active Agents', '7', '+2'],
              ['Avg. Latency', '420ms', '-80'],
              ['MRR Impact', '$28.6k', '+14%']].
              map(([k, v, d], i) =>
              <div key={i} className="rounded-lg p-3 bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">{k}</div>
                  <div className="text-[18px] font-semibold mt-1">{v}</div>
                  <div className="text-[10.5px] font-mono text-emerald-300/80 mt-0.5">▲ {d}</div>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="mt-4 rounded-lg p-4 bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">Pipeline</div>
                  <div className="text-[15px] font-semibold mt-0.5">Last 30 days</div>
                </div>
                <div className="flex gap-1">
                  {['7d', '30d', '90d'].map((t, i) =>
                  <span key={t} className={"px-2 py-1 rounded-md text-[10px] font-mono " + (i === 1 ? 'bg-white/8 text-white' : 'text-white/40')}>{t}</span>
                  )}
                </div>
              </div>
              <svg viewBox="0 0 600 130" className="w-full h-[120px]">
                <defs>
                  <linearGradient id="chartG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#A855F7" stopOpacity=".55" />
                    <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="chartL" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#C084FC" />
                    <stop offset="1" stopColor="#7C5CFF" />
                  </linearGradient>
                </defs>
                {/* gridlines */}
                {[0, 1, 2, 3].map((i) =>
                <line key={i} x1="0" x2="600" y1={20 + i * 30} y2={20 + i * 30} stroke="rgba(255,255,255,0.05)" />
                )}
                <path d="M0 100 L40 92 L80 78 L120 84 L160 60 L200 65 L240 50 L280 58 L320 38 L360 44 L400 30 L440 36 L480 22 L520 28 L560 14 L600 18 L600 130 L0 130 Z" fill="url(#chartG)" />
                <path d="M0 100 L40 92 L80 78 L120 84 L160 60 L200 65 L240 50 L280 58 L320 38 L360 44 L400 30 L440 36 L480 22 L520 28 L560 14 L600 18" fill="none" stroke="url(#chartL)" strokeWidth="2" />
                <circle cx="480" cy="22" r="4" fill="#C084FC" />
                <circle cx="480" cy="22" r="9" fill="#C084FC" opacity=".25" />
              </svg>
            </div>

            {/* Activity rows */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3 bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Recent Builds</div>
                {['Lead-qual agent', 'Pricing page A/B', 'Stripe webhook'].map((t, i) =>
                <div key={t} className="flex items-center justify-between py-1.5 text-[12px]">
                    <span className="text-white/75">{t}</span>
                    <span className="font-mono text-[10.5px] text-white/40">{['2m', '11m', '1h'][i]}</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg p-3 bg-white/[0.02] border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Status</div>
                <div className="flex items-center gap-2 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[12px] text-white/70">All systems online</span></div>
                <div className="flex items-center gap-2 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-soft" /><span className="text-[12px] text-white/70">3 deploys in flight</span></div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/30" /><span className="text-[12px] text-white/70">2 reviews pending</span></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>);

}

// ───────────────────────── HERO ─────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative pt-[140px] md:pt-[180px] pb-[80px] md:pb-[120px] overflow-hidden noise" data-screen-label="01 Hero">
      {/* Background art */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="glow-orb deep pulse-glow"
      style={{ width: 1100, height: 1100, left: '50%', top: '40%' }} />
      <div className="glow-orb violet"
      style={{ width: 600, height: 600, left: '15%', top: '20%', opacity: .35 }} />
      <div className="glow-orb violet"
      style={{ width: 500, height: 500, right: '10%', top: '5%', opacity: .3 }} />

      <div className="relative max-w-[1240px] mx-auto px-5 md:px-8 text-center">
        <span className="pill mb-7"><span className="dot" />Now Booking · Q3 Pilot Slots</span>

        <h1 className="h-display grad-text mt-2">
          AI Powered Websites
          <br />That Actually Convert
        </h1>

        <p className="mt-7 max-w-[600px] mx-auto text-[17px] md:text-[18px] leading-[1.55] text-white/55">
          We build production-ready websites and AI automations for founders who need to ship fast — not next quarter.
        </p>

        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <a href="#testimonials" className="btn-ghost inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
            Explore Work <IconArrowRight size={15} />
          </a>
          <a href="#cta" className="btn-grad inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
            Get Started <IconArrowRight size={15} />
          </a>
        </div>

        <div className="mt-16 md:mt-24 relative">
          <HeroOrnaments />
          <DashboardMock />
        </div>
      </div>
    </section>);

}

// ───────────────────────── TRUSTED STRIP ─────────────────────────
function TrustedStrip() {
  // Original placeholder wordmarks/symbols — not real company logos
  const Logo = ({ children }) =>
  <div className="shrink-0 flex items-center gap-2 px-6 text-white/35 hover:text-white/55 transition-colors">
      {children}
    </div>;

  const items = [
  <Logo key="a"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg><span className="font-semibold tracking-tight">Northbeam</span></Logo>,
  <Logo key="b"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6l4 6 4-6h2v16h-4v-9l-2 3-2-3v9H4z" /></svg><span className="font-semibold tracking-tight">Marlin Labs</span></Logo>,
  <Logo key="c"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 3 22 19 2 19" /></svg><span className="font-semibold italic">prism</span></Logo>,
  <Logo key="d"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.5 12 4l9 13.5H3z" /></svg><span className="font-bold tracking-tight">QUARRY</span></Logo>,
  <Logo key="e"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" opacity=".4" /></svg><span className="font-semibold">Foursquare.dev</span></Logo>,
  <Logo key="f"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8" /></svg><span className="font-mono text-[14px]">orbital/</span></Logo>,
  <Logo key="g"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" opacity=".5" /></svg><span className="font-semibold tracking-wide">DUO</span></Logo>,
  <Logo key="h"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 12 3l9 9-9 9z" /></svg><span className="font-semibold">Kettle</span></Logo>];

  return (
    <section className="py-16 md:py-20 relative" data-screen-label="02 Trusted">
      <p className="text-center text-[12px] font-mono uppercase tracking-[0.18em] text-white/40 mb-8">
        Trusted by founders building the future
      </p>
      <div className="relative overflow-hidden no-scrollbar"
      style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
        <div className="flex marquee-track w-max">
          {[...items, ...items].map((it, i) => React.cloneElement(it, { key: i }))}
        </div>
      </div>
    </section>);

}

// ───────────────────────── SERVICES ─────────────────────────
function ServiceCard({ icon: Icon, title, desc, art }) {
  return (
    <div className="glass card-edge lift rounded-2xl p-7 md:p-8 relative overflow-hidden min-h-[280px]">
      <div className="absolute -top-12 -right-12 w-64 h-64 glow-orb violet" style={{ opacity: .18 }} />
      <div className="relative">
        {art /* visual block top */}
        <div className="mt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-soft/20 to-violet-deep/30 border border-white/10 text-violet-soft">
            <Icon size={18} />
          </div>
          <h3 className="text-[19px] md:text-[21px] font-semibold tracking-tight">{title}</h3>
        </div>
        <p className="mt-2.5 text-[14.5px] leading-[1.55] text-white/55 max-w-[420px]">{desc}</p>
      </div>
    </div>);

}

// Per-card decorative artwork
const ArtCode = () =>
<div className="rounded-xl bg-black/40 border border-white/5 p-3 font-mono text-[11px] leading-[1.55] text-white/55 relative overflow-hidden">
    <div className="absolute -inset-px rounded-xl pointer-events-none" style={{ background: 'radial-gradient(60% 100% at 30% 0%, rgba(168,85,247,.18), transparent 60%)' }} />
    <div className="relative">
      <div><span className="text-violet-soft">const</span> <span className="text-white">site</span> = <span className="text-emerald-300/80">await</span> <span className="text-violet-soft">vexel</span>.build({"{"}</div>
      <div className="pl-4">stack: <span className="text-emerald-300/80">'next'</span>,</div>
      <div className="pl-4">ai: <span className="text-emerald-300/80">'agentic'</span> <span className="text-white/35">// ✦</span></div>
      <div>{"})"}</div>
    </div>
  </div>;


const ArtNodes = () =>
<div className="rounded-xl bg-black/40 border border-white/5 h-[88px] relative overflow-hidden">
    <svg viewBox="0 0 320 88" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="nl" x1="0" x2="1"><stop offset="0" stopColor="#C084FC" /><stop offset="1" stopColor="#7C5CFF" /></linearGradient>
      </defs>
      <path d="M30 44 C 90 10, 130 78, 180 44 S 290 10, 300 44" fill="none" stroke="url(#nl)" strokeWidth="1.5" />
      <path d="M30 44 C 90 78, 130 10, 180 44 S 290 78, 300 44" fill="none" stroke="url(#nl)" strokeWidth="1" opacity=".5" />
      {[30, 90, 150, 210, 270, 300].map((x, i) =>
    <g key={i}>
          <circle cx={x} cy="44" r="6" fill="#0A0A0F" stroke="#C084FC" strokeWidth="1.4" />
          <circle cx={x} cy="44" r="2.2" fill="#C084FC" />
        </g>
    )}
    </svg>
  </div>;


const ArtCursor = () =>
<div className="rounded-xl bg-black/40 border border-white/5 h-[88px] relative overflow-hidden flex items-center justify-center">
    <div className="px-4 py-2 rounded-lg btn-grad text-[12px] font-medium">Start free trial</div>
    <svg width="22" height="22" viewBox="0 0 24 24" className="absolute" style={{ left: '62%', top: '52%' }}>
      <path d="m4 4 6.5 16 2.4-6.7L19.5 11 4 4Z" fill="#fff" />
    </svg>
    <div className="absolute" style={{ left: '62%', top: '52%' }}>
      <div className="w-12 h-12 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(192,132,252,.5), transparent 70%)' }} />
    </div>
  </div>;


const ArtGrid = () =>
<div className="rounded-xl bg-black/40 border border-white/5 h-[88px] grid grid-cols-6 gap-2 p-3 relative overflow-hidden">
    {Array.from({ length: 12 }).map((_, i) =>
  <div key={i} className="rounded-md border border-white/8 flex items-center justify-center"
  style={{ background: 'rgba(255,255,255,0.02)' }}>
        <span className="w-2 h-2 rounded-sm" style={{ background: i % 3 === 0 ? '#C084FC' : 'rgba(255,255,255,.18)', opacity: i % 3 === 0 ? 1 : .5 }} />
      </div>
  )}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 88">
      <path d="M40 44 H 280" stroke="#C084FC" strokeWidth="1" strokeDasharray="2 4" opacity=".55" />
    </svg>
  </div>;


function Services() {
  return (
    <section id="services" className="relative py-[100px] md:py-[140px]" data-screen-label="03 Services">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="max-w-[760px]">
          <span className="pill"><span className="dot" />What We Build</span>
          <h2 className="h-section grad-text-tight mt-5">
            Ship Faster With AI.<br />Skip the Six Month Build.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/55 max-w-[560px]">
            A focused studio that designs, develops, and ships AI-native products in weeks. No retainers, no committees — just shipped work.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
          <ServiceCard icon={IconCodeSparkle} title="AI-Powered Web Apps"
          desc="Full-stack apps with model orchestration, RAG, and streaming UI baked in from day one."
          art={<ArtCode />} />
          <ServiceCard icon={IconNodes} title="Custom AI Agents & Automations"
          desc="Multi-step agents that book, qualify, draft, and act — wired into the tools your team already uses."
          art={<ArtNodes />} />
          <ServiceCard icon={IconCursor} title="Landing Pages That Convert"
          desc="Conversion-tested pages with motion, copy, and tracking dialed in. Live in days, not weeks."
          art={<ArtCursor />} />
          <ServiceCard icon={IconGrid} title="Workflow Integrations"
          desc="We stitch Stripe, HubSpot, Slack, and your custom backend into one automation layer that just runs."
          art={<ArtGrid />} />
        </div>
      </div>
    </section>);

}

// ───────────────────────── PROCESS ─────────────────────────
function Process() {
  const steps = [
  { n: '01', title: 'Discovery Call', desc: 'A 30-minute strategy session to map the build, scope the AI surface, and lock the timeline.' },
  { n: '02', title: 'Build Sprint', desc: 'Design, develop, and integrate AI in a focused 7–14 day sprint with daily Loom updates.' },
  { n: '03', title: 'Launch & Iterate', desc: 'Deploy, monitor, and optimize — we stay on for two weeks of post-launch tuning.' }];

  return (
    <section id="process" className="relative py-[100px] md:py-[140px] overflow-hidden" data-screen-label="04 Process">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 glow-orb violet"
      style={{ width: 900, height: 600, opacity: .35 }} />
      <div className="relative max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="pill"><span className="dot" />How We Work</span>
          <h2 className="h-section grad-text-tight mt-5">
            From Idea to Live<br />in Days, Not Months
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/55 max-w-[560px] mx-auto">
            A tight, three-step process built around momentum. You stay in the loop without staying in the weeds.
          </p>
        </div>

        {/* Curve + nodes */}
        <div className="mt-16 md:mt-20 relative">
          {/* SVG curve only on md+ */}
          <svg className="hidden md:block absolute inset-0 w-full h-[200px] pointer-events-none" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="proc" x1="0" x2="1">
                <stop offset="0" stopColor="#C084FC" stopOpacity=".0" />
                <stop offset=".15" stopColor="#C084FC" />
                <stop offset=".5" stopColor="#7C5CFF" />
                <stop offset=".85" stopColor="#A855F7" />
                <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 130 C 250 30, 350 30, 600 100 S 950 170, 1200 70"
            fill="none" stroke="url(#proc)" strokeWidth="2" />
            <path d="M0 130 C 250 30, 350 30, 600 100 S 950 170, 1200 70"
            fill="none" stroke="#C084FC" strokeWidth="6" opacity=".15" filter="url(#blur)" />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {steps.map((s, i) =>
            <div key={s.n} className="relative" style={{ marginTop: i === 1 ? '40px' : i === 2 ? '80px' : 0 }}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-14 h-14 rounded-full flex items-center justify-center node-dot bg-gradient-to-br from-violet-mid to-violet-deep">
                    <span className="font-mono text-[13px] font-semibold">{s.n}</span>
                  </div>
                  <div className="mt-5 glass rounded-2xl px-6 py-5 max-w-[320px]">
                    <h3 className="text-[18px] font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.55] text-white/55">{s.desc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ───────────────────────── TESTIMONIALS ─────────────────────────
function Testimonials() {
  const cards = [
  {
    site: { name: 'LaunchMirror', url: 'https://launchmirror.vercel.app/' },
    name: 'Maren Holloway',
    role: 'Founder, Quarry',
    quote: 'They shipped our entire onboarding flow plus a working lead-qual agent in nine days. Our trial-to-paid jumped from 6% to 18% in the first month.',
    stars: 5,
    hl: false
  },
  {
    site: { name: 'TruReview', url: 'https://tru-review-lilac.vercel.app/' },
    name: 'Devon Asare',
    role: 'CEO, Marlin Labs',
    quote: 'The closest thing I have found to a senior product team I can rent for two weeks. The work feels in-house, not agency.',
    stars: 5,
    hl: true
  },
  {
    site: { name: 'ViralCheckContent', url: 'https://viralcheckcontent.vercel.app/' },
    name: 'Priya Chen',
    role: 'Co-founder, Orbital',
    quote: 'They rebuilt our pricing page and wired the AI quote-builder into Stripe. We saw results in the first 48 hours after launch.',
    stars: 5,
    hl: false
  }];

  const Avatar = ({ name }) => {
    const init = name.split(' ').map((n) => n[0]).slice(0, 2).join('');
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px] text-white shrink-0"
      style={{ background: 'linear-gradient(135deg,#C084FC,#7C5CFF)' }}>
        {init}
      </div>);
  };

  return (
    <section id="testimonials" className="relative py-[100px] md:py-[140px]" data-screen-label="05 Testimonials">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="pill"><span className="dot" />Our Work</span>
          <h2 className="h-section grad-text-tight mt-5">
            Real Sites. Real Results.<br />Shipped Fast.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/55 max-w-[520px] mx-auto">
            Every project below went from brief to live in under two weeks.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) =>
          <div key={i}
          className={"rounded-2xl lift relative flex flex-col overflow-hidden " + (c.hl ? "glass-strong" : "glass")}
          style={c.hl ? { boxShadow: '0 30px 80px -30px rgba(124,92,255,.65), 0 0 0 1px rgba(168,85,247,.45) inset' } : {}}>

            {c.hl && <div className="absolute -inset-px rounded-2xl pointer-events-none z-10"
              style={{ background: 'radial-gradient(120% 60% at 50% 0%, rgba(192,132,252,.2), transparent 70%)' }} />}

            {/* Browser screenshot */}
            <div className="w-full overflow-hidden">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 px-3 h-8"
                style={{ background: 'rgba(10,10,20,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                <div className="ml-2 flex-1 h-4 rounded-full bg-white/[0.06] flex items-center px-2">
                  <span className="text-[9px] font-mono text-white/35 truncate">{c.site.url}</span>
                </div>
              </div>
              {/* Screenshot — natural width, clipped at bottom, no stretch */}
              <div className="overflow-hidden" style={{ height: '220px' }}>
                <img
                  src={'https://image.thum.io/get/width/1200/' + c.site.url}
                  alt={c.site.name}
                  className="w-full block"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Site name + link */}
            <div className="relative z-10 px-6 pt-5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[17px] tracking-tight">{c.site.name}</div>
                <div className="text-[12px] font-mono text-white/35 mt-0.5 truncate">{c.site.url.replace('https://', '')}</div>
              </div>
              <a href={c.site.url} target="_blank" rel="noopener noreferrer"
                className="shrink-0 ml-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-violet-soft/40 text-violet-soft hover:bg-violet-deep/20 transition-colors">
                Visit <IconArrowRight size={11} />
              </a>
            </div>

            {/* Divider */}
            <div className="mx-6 mt-4 hairline" />

            {/* Review */}
            <div className="relative z-10 px-6 py-5 flex flex-col gap-3 flex-1">
              <div className="flex gap-0.5 star">
                {Array.from({ length: c.stars }).map((_, j) => <IconStar key={j} size={13} />)}
              </div>
              <p className="text-[14px] leading-[1.65] text-white/70 flex-1">"{c.quote}"</p>
              <div className="flex items-center gap-2.5 mt-2">
                <Avatar name={c.name} />
                <div>
                  <div className="font-semibold text-[13.5px]">{c.name}</div>
                  <div className="text-[12px] text-white/40 font-mono">{c.role}</div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>);
}

// ───────────────────────── PRICING ─────────────────────────
function Pricing() {
  const tiers = [
  {
    name: 'Starter',
    price: '$499',
    sub: 'per landing page',
    desc: 'A high-converting marketing site, copy included. Perfect for pre-seed launches.',
    features: ['1 high-fidelity landing page', 'Copywriting + brand polish', 'Analytics + A/B harness', '7-day delivery'],
    cta: 'Get Started',
    ctaStyle: 'btn-ghost'
  },
  {
    name: 'Growth',
    price: '$499',
    sub: 'per build sprint',
    desc: 'Full web app or marketing site with one production-grade AI feature wired in.',
    features: ['Full app build (up to 6 routes)', '1 production AI feature', 'Stripe + auth + email', '14-day delivery', '2 weeks of post-launch tuning'],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-white text-ink-900 hover:bg-white/90',
    highlight: true
  },
  {
    name: 'Custom',
    price: "Let's Talk",
    sub: 'scoped to your build',
    desc: 'Multi-agent systems, deep integrations, embedded retainers — bespoke to your team.',
    features: ['Embedded for 4–12 weeks', 'Multi-agent orchestration', 'Bespoke integrations', 'On-call launch support'],
    cta: 'Contact Us',
    ctaStyle: 'btn-ghost'
  }];


  return (
    <section id="pricing" className="relative py-[100px] md:py-[140px]" data-screen-label="06 Pricing">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="pill"><span className="dot" />Pricing</span>
          <h2 className="h-section grad-text-tight mt-5">Plans Built for Every Stage</h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/55 max-w-[560px] mx-auto">
            Fixed-fee engagements with clear deliverables. No hidden hours, no scope drift.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {tiers.map((t, i) =>
          <div key={i}
          className={"rounded-2xl p-7 md:p-8 flex flex-col " + (t.highlight ? 'price-hl' : 'glass lift')}>
              {t.highlight &&
            <div className="self-start pill mb-5" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.18)', color: '#fff' }}>
                  <span className="dot" style={{ background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,.7)' }} />Most Popular
                </div>
            }
              <div className={"text-[12px] font-mono uppercase tracking-[0.18em] " + (t.highlight ? 'text-white/80' : 'text-white/45')}>{t.name}</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[44px] md:text-[52px] font-semibold tracking-tight leading-none">{t.price}</span>
              </div>
              <div className={"mt-1 text-[13px] " + (t.highlight ? 'text-white/75' : 'text-white/45')}>{t.sub}</div>
              <p className={"mt-4 text-[14.5px] leading-[1.55] " + (t.highlight ? 'text-white/85' : 'text-white/60')}>{t.desc}</p>

              <a href="#cta" className={"mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium " + t.ctaStyle}>
                {t.cta} <IconArrowRight size={14} />
              </a>

              <div className={"mt-7 pt-6 border-t " + (t.highlight ? 'border-white/15' : 'border-white/8')}>
                <div className={"text-[11px] font-mono uppercase tracking-[0.18em] mb-3 " + (t.highlight ? 'text-white/70' : 'text-white/40')}>What's Included</div>
                <ul className="space-y-2.5">
                  {t.features.map((f, j) =>
                <li key={j} className={"flex items-start gap-2.5 text-[14px] " + (t.highlight ? 'text-white' : 'text-white/75')}>
                      <span className={"shrink-0 mt-[3px] w-4 h-4 rounded-full flex items-center justify-center " + (t.highlight ? 'bg-white/20' : 'bg-violet-deep/25 text-violet-soft')}>
                        <IconCheck size={11} />
                      </span>
                      {f}
                    </li>
                )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ───────────────────────── FAQ ─────────────────────────
function FAQ() {
  const items = [
  ['How long does a typical project take?',
  'Most landing pages ship in 7 days; full app builds run 10–14 days. We confirm a delivery date during the discovery call and work backwards from it.'],
  ['Do you offer ongoing support?',
  'Every Growth and Custom engagement includes two weeks of post-launch tuning. After that, you can opt into a lightweight retainer for fixes, A/B tests, and small features.'],
  ['Can you integrate AI into my existing site?',
  'Yes. We routinely add agents, RAG search, and automation layers onto Webflow, Next.js, and custom Rails apps without rebuilding the front end.'],
  ['What is included in the price?',
  'Design, development, copy polish, deployment, analytics setup, and a Loom-narrated walkthrough at handoff. Stock and third-party API costs are billed separately at cost.'],
  ['Do you sign NDAs?',
  'Yes — we sign mutual NDAs before discovery for any engagement. Our standard MSA also includes confidentiality and IP assignment clauses for your peace of mind.']];

  return (
    <section id="faq" className="relative py-[100px] md:py-[140px]" data-screen-label="07 FAQ">
      <div className="max-w-[920px] mx-auto px-5 md:px-8">
        <div className="text-center">
          <span className="pill"><span className="dot" />FAQ</span>
          <h2 className="h-section grad-text-tight mt-5">Everything You Need to Know</h2>
        </div>

        <div className="mt-12 space-y-3">
          {items.map(([q, a], i) =>
          <details key={i} className="glass rounded-2xl group lift" open={i === 0}>
              <summary className="flex items-center justify-between gap-5 px-6 py-5 md:px-7 md:py-6">
                <span className="text-[16.5px] md:text-[18px] font-medium tracking-tight">{q}</span>
                <span className="faq-icon shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/70">
                  <IconPlus size={16} strokeWidth={1.8} />
                </span>
              </summary>
              <div className="px-6 md:px-7 pb-6 -mt-1 text-[15px] leading-[1.65] text-white/60 max-w-[680px]">
                {a}
              </div>
            </details>
          )}
        </div>
      </div>
    </section>);

}

// ───────────────────────── CONTACT MODAL ─────────────────────────
function ContactModal({ open, onClose }) {
  const [form, setForm] = React.useState({ name: '', email: '', company: '', budget: '$5–15k', project: '' });
  const [sent, setSent] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {if (e.key === 'Escape') onClose();};
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {window.removeEventListener('keydown', onKey);document.body.style.overflow = '';};
  }, [open, onClose]);

  if (!open) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const valid = form.name.trim().length >= 2 && validEmail && form.project.trim().length >= 10;

  const close = () => {onClose();setTimeout(() => {setSent(false);setTouched(false);}, 250);};

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    style={{ background: 'rgba(8,6,16,0.7)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
    onClick={close}>
      <div className="relative w-full max-w-[540px] rounded-2xl glass-strong p-7 md:p-9 max-h-[92vh] overflow-y-auto"
      style={{ boxShadow: '0 60px 140px -40px rgba(124,92,255,.65), 0 0 0 1px rgba(168,85,247,.3) inset' }}
      onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Close"
        className="absolute top-4 right-4 w-9 h-9 rounded-full btn-ghost flex items-center justify-center text-white/70 hover:text-white">
          <IconX size={16} />
        </button>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 glow-orb violet pointer-events-none" style={{ opacity: .5 }} />

        <div className="relative">
          {!sent ?
          <>
              <span className="pill"><span className="dot" />Free 30-min Call</span>
              <h3 className="mt-4 grad-text font-semibold tracking-tight" style={{ fontSize: '30px', lineHeight: 1.1 }}>
                Tell Us About<br />Your Project
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.55] text-white/55">
                Share a few details and we'll reply within one business day with a fixed scope and price.
              </p>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setTouched(true);
                if (!valid) return;
                try {
                  await window.submitLead({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    company: form.company.trim() || null,
                    budget: form.budget,
                    project_description: form.project.trim(),
                  });
                } catch (err) { console.error('Supabase error:', err); }
                setSent(true);
              }}
            className="mt-6 space-y-4">
                <Field label="Full name" required error={touched && form.name.trim().length < 2 && 'Please enter your name.'}>
                  <input value={form.name} onChange={set('name')} placeholder="Maren Holloway" className="vx-input" />
                </Field>
                <Field label="Email" required error={touched && !validEmail && 'Please enter a valid email.'}>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@studio.com" className="vx-input" />
                </Field>
                <Field label="Company / Role">
                  <input value={form.company} onChange={set('company')} placeholder="Founder, Quarry" className="vx-input" />
                </Field>
                <Field label="Estimated budget">
                  <select value={form.budget} onChange={set('budget')} className="vx-input">
                    <option>Under $5k</option><option>$5–15k</option><option>$15–40k</option><option>$40k+</option><option>Not sure yet</option>
                  </select>
                </Field>
                <Field label="Project details" required error={touched && form.project.trim().length < 10 && 'A sentence or two helps a lot.'}>
                  <textarea rows={3} value={form.project} onChange={set('project')}
                placeholder="A landing page + lead-qual agent for our SaaS launch in Q3..."
                className="vx-input resize-none" />
                </Field>

                <button type="submit"
              className="btn-grad w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
                  Send & Book Call <IconArrowRight size={14} />
                </button>
                <p className="text-center text-[12px] text-white/40">No sales pitch. We reply within 24 hours.</p>
              </form>
            </> :

          <div className="text-center py-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-400/15 border border-emerald-400/40 text-emerald-300">
                  <IconCheck size={22} />
                </div>
              </div>
              <h3 className="mt-5 grad-text font-semibold tracking-tight" style={{ fontSize: '28px', lineHeight: 1.15 }}>
                Got it.<br />Talk soon.
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.55] text-white/55 max-w-[360px] mx-auto">
                We'll reply to <span className="text-white/85 font-mono">{form.email}</span> within one business day with next steps.
              </p>
              <button onClick={close} className="mt-7 btn-ghost inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
                Close
              </button>
            </div>
          }
        </div>
      </div>

      <style>{`
        .vx-input { width:100%; padding:12px 14px; border-radius:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.10); color:#fff; font-size:14.5px; outline:none; transition:border-color .2s; font-family:inherit; }
        .vx-input::placeholder { color:rgba(255,255,255,0.30); }
        .vx-input:focus { border-color:rgba(192,132,252,0.7); }
        .vx-input option { background:#14141E; color:#fff; }
      `}</style>
    </div>);

}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-mono uppercase tracking-[0.14em] text-white/40 mb-1.5">
        {label}{required && <span className="text-violet-soft"> *</span>}
      </label>
      {children}
      {error && <div className="mt-1.5 text-[12px] text-red-300/80">{error}</div>}
    </div>);

}

// ───────────────────────── FINAL CTA ─────────────────────────
function FinalCTA({ onOpenContact }) {
  return (
    <section id="cta" className="relative py-[100px] md:py-[140px]" data-screen-label="08 CTA">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="relative rounded-3xl glass-strong overflow-hidden px-7 py-16 md:px-16 md:py-24 text-center">
          <div className="glow-orb deep pulse-glow"
          style={{ width: 1100, height: 1100, left: '50%', top: '60%', opacity: .45 }} />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <span className="pill"><span className="dot" />Limited slots · Q3 26</span>
            <h2 className="h-cta grad-text mt-6 max-w-[860px] mx-auto">
              Ready to Build Something That Ships?
            </h2>
            <p className="mt-6 text-[17px] md:text-[18px] leading-[1.55] text-white/60 max-w-[560px] mx-auto">
              Book a free 30-minute strategy call. We will scope the build, share a fixed price, and tell you honestly if we are not the right fit.
            </p>
            <div className="mt-9 flex justify-center">
              <button onClick={onOpenContact} className="btn-grad inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium">
                Book a Free Strategy Call <IconArrowRight size={16} />
              </button>
            </div>
            <p className="mt-5 text-[12px] font-mono uppercase tracking-[0.18em] text-white/35">
              No deck · No sales pitch · 30 minutes
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// ───────────────────────── FOOTER ─────────────────────────
function Footer() {
  return (
    <footer className="relative pt-16 pb-10 border-t border-white/5" data-screen-label="09 Footer">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Wordmark />
            <p className="mt-4 text-[14px] leading-[1.55] text-white/50 max-w-[260px]">
              An AI-native studio shipping production websites and agents for ambitious founders.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="#cta" className="btn-grad inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium">Get Started</a>
              <a href="#" className="btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium">Sign Up</a>
            </div>
          </div>

          <FooterCol title="Navigation" links={[['Home', '#hero'], ['Services', '#services'], ['Work', '#testimonials'], ['Pricing', '#pricing']]} />
          <FooterCol title="Resources" links={[['Privacy', '#'], ['Terms', '#'], ['Contact', '#'], ['Blog', '#']]} />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/40 mb-4">Socials</div>
            <div className="flex gap-2">
              {[IconX2, IconInsta, IconLinkedIn, IconGitHub].map((I, i) =>
              <a key={i} href="#" className="w-9 h-9 rounded-full btn-ghost flex items-center justify-center text-white/70 hover:text-white">
                  <I size={15} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hairline mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] font-mono text-white/35">
          <div>© 2026 Vexel Studio · All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All systems online
          </div>
        </div>
      </div>
    </footer>);

}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/40 mb-4">{title}</div>
      <ul className="space-y-2.5">
        {links.map(([l, h]) =>
        <li key={l}><a href={h} className="text-[14px] text-white/65 hover:text-white">{l}</a></li>
        )}
      </ul>
    </div>);

}

// ───────────────────────── MOBILE NAV ─────────────────────────
function MobileMenu({ open, onClose }) {
  if (!open) return null;
  const links = [
  ['Home', 'Vexel Landing.html#hero'],
  ['Services', 'Vexel Landing.html#services'],
  ['Work', 'Vexel Landing.html#testimonials'],
  ['Resources', 'Resources.html'],
  ['Pricing', 'Vexel Landing.html#pricing'],
  ['FAQ', 'Vexel Landing.html#faq']];

  return (
    <div className="md:hidden fixed inset-0 z-[60] bg-ink-900/95 backdrop-blur-xl">
      <div className="px-5 h-[68px] flex items-center justify-between">
        <Wordmark />
        <button onClick={onClose} className="p-2 rounded-lg btn-ghost"><IconX size={20} /></button>
      </div>
      <div className="px-5 mt-6 flex flex-col gap-2">
        {links.map(([l, h]) =>
        <a key={l} href={h} onClick={onClose}
        className="px-4 py-4 rounded-2xl glass text-[18px] font-medium">
            {l}
          </a>
        )}
        <a href="#cta" onClick={onClose} className="mt-4 btn-grad inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-[15px] font-medium">
          Book a Call <IconArrowRight size={16} />
        </a>
      </div>
    </div>);

}

Object.assign(window, {
  Navbar, Hero, TrustedStrip, Services, Process, Testimonials, Pricing, FAQ, FinalCTA, Footer, MobileMenu, ContactModal
});