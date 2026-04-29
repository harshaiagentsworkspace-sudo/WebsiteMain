// Resources page root

function ResourcesApp() {
  const [tw, setTw] = useTweaks(/*EDITMODE-BEGIN*/{
    "accentHue": 270,
    "headlineWeight": 700,
    "showGrid": true
  }/*EDITMODE-END*/);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openResource, setOpenResource] = React.useState(null);
  const [contactOpen, setContactOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const h = tw.accentHue;
    root.style.setProperty('--vx-soft', `oklch(0.82 0.18 ${h})`);
    root.style.setProperty('--vx-mid',  `oklch(0.65 0.22 ${h})`);
    root.style.setProperty('--vx-deep', `oklch(0.55 0.24 ${h - 10})`);
    const id = 'vx-tweak-style';
    let s = document.getElementById(id);
    if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); }
    s.textContent = `
      .grad-text { background-image: linear-gradient(180deg, #FFFFFF 0%, color-mix(in oklch, var(--vx-soft) 70%, white) 55%, var(--vx-soft) 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important; }
      .grad-text-tight { background-image: linear-gradient(180deg, #FFFFFF 0%, color-mix(in oklch, var(--vx-soft) 65%, white) 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important; }
      .btn-grad { background-image: linear-gradient(180deg, color-mix(in oklch, var(--vx-soft) 60%, white 5%) 0%, var(--vx-deep) 60%, color-mix(in oklch, var(--vx-deep) 80%, black) 100%) !important; }
      .glow-orb.violet { background: radial-gradient(closest-side, color-mix(in oklch, var(--vx-mid) 80%, transparent), transparent 70%) !important; }
      .glow-orb.deep   { background: radial-gradient(closest-side, color-mix(in oklch, var(--vx-deep) 75%, transparent), transparent 70%) !important; }
      .h-display, .h-section, .h-cta { font-weight: ${tw.headlineWeight} !important; }
      ${tw.showGrid ? '' : '.grid-bg { background-image: none !important; }'}
    `;
  }, [tw.accentHue, tw.headlineWeight, tw.showGrid]);

  return (
    <>
      <Navbar onOpenMenu={() => setMenuOpen(true)} active="resources" />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <ResourcesHero />
        <ResourceGrid onOpen={setOpenResource} />
        <WhyTheseWork />
        <InstagramTeaser />
        <ResourcesFAQ />
        <ResourcesFinalCTA onOpenContact={() => setContactOpen(true)} />
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
          <TweakToggle label="Background grid" value={tw.showGrid} onChange={v => setTw('showGrid', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ResourcesApp />);
