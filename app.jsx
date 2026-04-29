// Root app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 270,
  "headlineWeight": 700,
  "showGrid": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const [tw, setTw] = useTweaks(TWEAK_DEFAULTS);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openResource, setOpenResource] = React.useState(null);
  const [contactOpen, setContactOpen] = React.useState(false);

  // Apply accentHue live by overriding violet stops via CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    const h = tw.accentHue;
    // Approximate violet→purple→lilac swap by offsetting hue
    root.style.setProperty('--vx-soft', `oklch(0.82 0.18 ${h})`);
    root.style.setProperty('--vx-mid',  `oklch(0.65 0.22 ${h})`);
    root.style.setProperty('--vx-deep', `oklch(0.55 0.24 ${h - 10})`);
    // restyle gradients
    const id = 'vx-tweak-style';
    let s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
    s.textContent = `
      .grad-text { background-image: linear-gradient(180deg, #FFFFFF 0%, color-mix(in oklch, var(--vx-soft) 70%, white) 55%, var(--vx-soft) 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important; }
      .grad-text-tight { background-image: linear-gradient(180deg, #FFFFFF 0%, color-mix(in oklch, var(--vx-soft) 65%, white) 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important; }
      .btn-grad { background-image: linear-gradient(180deg, color-mix(in oklch, var(--vx-soft) 60%, white 5%) 0%, var(--vx-deep) 60%, color-mix(in oklch, var(--vx-deep) 80%, black) 100%) !important; }
      .glow-orb.violet { background: radial-gradient(closest-side, color-mix(in oklch, var(--vx-mid) 80%, transparent), transparent 70%) !important; }
      .glow-orb.deep   { background: radial-gradient(closest-side, color-mix(in oklch, var(--vx-deep) 75%, transparent), transparent 70%) !important; }
      .price-hl { background: radial-gradient(120% 90% at 50% 0%, color-mix(in oklch, var(--vx-soft) 60%, transparent), transparent 60%), linear-gradient(180deg, var(--vx-deep) 0%, color-mix(in oklch, var(--vx-deep) 60%, black) 100%) !important; }
      .h-display, .h-section, .h-cta { font-weight: ${tw.headlineWeight} !important; }
      ${tw.showGrid ? '' : '.grid-bg { background-image: none !important; }'}
    `;
  }, [tw.accentHue, tw.headlineWeight, tw.showGrid]);

  // Density adjusts section padding
  React.useEffect(() => {
    const id = 'vx-density-style';
    let s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
    const map = { tight: ['72px','96px'], comfortable: ['100px','140px'], spacious: ['128px','180px'] };
    const [a, b] = map[tw.density] || map.comfortable;
    s.textContent = `
      @media (min-width: 768px) { section.relative { /* noop */ } }
      section { padding-top: ${a}; padding-bottom: ${a}; }
      @media (min-width: 768px) { section { padding-top: ${b}; padding-bottom: ${b}; } }
      #hero { padding-top: calc(${a} + 60px); }
      @media (min-width: 768px) { #hero { padding-top: calc(${b} + 60px); } }
    `;
  }, [tw.density]);

  return (
    <>
      <Navbar onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero />
        <TrustedStrip />
        <Services />
        <Process />
        <Testimonials />
        <ResourcesTeaser onOpen={setOpenResource} />
        <Pricing />
        <FAQ />
        <FinalCTA onOpenContact={() => setContactOpen(true)} />
      </main>
      <Footer />

      <ResourceModal resource={openResource} onClose={() => setOpenResource(null)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent">
          <TweakSlider label="Hue" min={220} max={330} step={1}
                       value={tw.accentHue} onChange={v => setTw('accentHue', v)} />
        </TweakSection>
        <TweakSection title="Type">
          <TweakRadio label="Headline weight"
                      options={[{label:'Medium', value:600},{label:'Bold', value:700},{label:'Black', value:800}]}
                      value={tw.headlineWeight} onChange={v => setTw('headlineWeight', v)}/>
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio label="Density"
                      options={[{label:'Tight', value:'tight'},{label:'Comfortable', value:'comfortable'},{label:'Spacious', value:'spacious'}]}
                      value={tw.density} onChange={v => setTw('density', v)}/>
          <TweakToggle label="Background grid" value={tw.showGrid} onChange={v => setTw('showGrid', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
