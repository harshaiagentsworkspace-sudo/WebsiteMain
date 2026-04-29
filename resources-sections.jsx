// Resources page sections.

// ───────────────────────── RESOURCES HERO ─────────────────────────
function ResourcesHero() {
  return (
    <section id="hero" className="relative pt-[140px] md:pt-[180px] pb-[60px] md:pb-[80px] overflow-hidden noise" data-screen-label="01 Resources Hero">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="glow-orb deep pulse-glow" style={{ width: 1100, height: 1100, left: '50%', top: '40%' }} />
      <div className="glow-orb violet" style={{ width: 600, height: 600, left: '15%', top: '20%', opacity: .35 }} />
      <div className="glow-orb violet" style={{ width: 500, height: 500, right: '10%', top: '5%', opacity: .3 }} />

      <div className="relative max-w-[1240px] mx-auto px-5 md:px-8 text-center">
        <span className="pill mb-7"><span className="dot" />Free Resources</span>
        <h1 className="h-display grad-text mt-2" style={{fontSize:'clamp(40px, 6.6vw, 76px)'}}>
          Steal My Playbooks.<br />Build Faster Than Ever.
        </h1>
        <p className="mt-7 max-w-[600px] mx-auto text-[17px] md:text-[18px] leading-[1.55] text-white/55">
          Free templates, workflows, and prompts I use to ship AI-powered products in days. No fluff. No upsells. Just download and build.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-white/55">
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{boxShadow:'0 0 10px rgba(52,211,153,.7)'}} />
          Updated weekly
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── RESOURCE GRID ─────────────────────────
const RESOURCES = [
  {
    cat: 'Free Guide',
    icon: 'IconSparkles',
    title: 'AI Income Starter Framework',
    desc: 'The complete playbook for building your first AI-powered income stream — tools, strategies, and step-by-step execution for founders and creators.',
    meta: 'DOCX · Free Guide',
    tone: 'blue',
    downloadUrl: 'AI Income Starter Framework Final.docx',
  },
];

const TONE_MAP = {
  green:  { bg:'rgba(52,211,153,0.12)', border:'rgba(52,211,153,0.35)', text:'#6EE7B7' },
  purple: { bg:'rgba(168,85,247,0.15)', border:'rgba(168,85,247,0.40)', text:'#D8B4FE' },
  blue:   { bg:'rgba(96,165,250,0.12)', border:'rgba(96,165,250,0.35)', text:'#93C5FD' },
  orange: { bg:'rgba(251,146,60,0.12)', border:'rgba(251,146,60,0.35)', text:'#FDBA74' },
};

function ResourceCard({ r, onOpen, compact = false }) {
  const tone = TONE_MAP[r.tone];
  const Icon = window[r.icon] || window.IconFile;
  return (
    <div className={"glass card-edge lift rounded-2xl p-6 relative overflow-hidden flex flex-col " + (compact ? 'min-h-[260px] w-[300px] shrink-0' : 'min-h-[340px]')}>
      <div className="absolute -top-16 -right-16 w-48 h-48 glow-orb violet" style={{opacity:.18}} />

      {/* Category badge */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
              style={{background: tone.bg, border: '1px solid '+tone.border, color: tone.text}}>
          {r.cat}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35">{r.meta}</span>
      </div>

      {/* Icon */}
      <div className="relative mt-5 self-center">
        <div className="absolute inset-0 -m-4 rounded-full" style={{background:'radial-gradient(closest-side, rgba(168,85,247,.4), transparent 70%)'}} />
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-soft/20 to-violet-deep/40 border border-white/10 text-violet-soft">
          <Icon size={22} />
        </div>
      </div>

      {/* Title + desc */}
      <h3 className={"mt-5 font-semibold tracking-tight text-center " + (compact ? 'text-[15.5px]' : 'text-[19px] md:text-[20px]')}>{r.title}</h3>
      {!compact && <p className="mt-2 text-[13.5px] leading-[1.55] text-white/55 text-center">{r.desc}</p>}

      {/* CTA */}
      <button onClick={() => onOpen && onOpen(r)}
              className="mt-auto pt-5 w-full">
        <span className="btn-grad inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[13.5px] font-medium">
          Get Free Access <IconArrowRight size={14} />
        </span>
      </button>
    </div>
  );
}

function ResourceGrid({ onOpen }) {
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="02 Library">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="pill"><span className="dot"/>The Library</span>
          <h2 className="h-section grad-text-tight mt-5">Pick What You Need.<br/>Get Building Today.</h2>
        </div>

        <div className="mt-14 flex justify-center">
          <div className="w-full max-w-[420px]">
            {RESOURCES.map((r, i) => <ResourceCard key={i} r={r} onOpen={onOpen} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── EMAIL CAPTURE MODAL ─────────────────────────
function ResourceModal({ resource, onClose }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [downloaded, setDownloaded] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (!resource) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, resource]);

  if (!resource) return null;
  const Icon = window[resource.icon] || window.IconFile;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validName = name.trim().length > 0;
  const valid = validEmail && validName;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    try {
      await window.submitDownload({
        name: name.trim(),
        email: email.trim(),
        resource_title: resource.title,
      });
    } catch (err) { console.error('Supabase error:', err); }
    setDownloaded(true);
    const a = document.createElement('a');
    a.href = resource.downloadUrl;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
         style={{background:'rgba(8,6,16,0.7)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)'}}
         onClick={onClose}>
      <div className="relative w-full max-w-[480px] rounded-2xl glass-strong p-7 md:p-9"
           style={{boxShadow:'0 60px 140px -40px rgba(124,92,255,.65), 0 0 0 1px rgba(168,85,247,.3) inset'}}
           onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full btn-ghost flex items-center justify-center text-white/70 hover:text-white">
          <IconX size={16}/>
        </button>

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 glow-orb violet pointer-events-none" style={{opacity:.5}}/>

        <div className="relative">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-soft/20 to-violet-deep/40 border border-white/10 text-violet-soft">
              <Icon size={22} />
            </div>
          </div>

          {!downloaded ? (
            <>
              <h3 className="mt-5 text-center grad-text font-semibold tracking-tight" style={{fontSize:'28px', lineHeight:1.1}}>
                One Last Step
              </h3>
              <p className="mt-3 text-center text-[14.5px] leading-[1.55] text-white/55">
                Tell us where to send updates for <span className="text-white/85">{resource.title}</span> and your download starts instantly.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-[0.14em] text-white/40 mb-2">Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                         placeholder="Your name"
                         className={"w-full px-4 py-3 rounded-xl bg-black/40 border text-[14.5px] text-white placeholder-white/30 outline-none transition-colors " +
                                    (touched && !validName ? 'border-red-400/60' : 'border-white/10 focus:border-violet-soft/70')}/>
                  {touched && !validName && <div className="mt-1.5 text-[12px] text-red-300/80">Please enter your name.</div>}
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-[0.14em] text-white/40 mb-2">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                         placeholder="you@studio.com"
                         className={"w-full px-4 py-3 rounded-xl bg-black/40 border text-[14.5px] text-white placeholder-white/30 outline-none transition-colors " +
                                    (touched && !validEmail ? 'border-red-400/60' : 'border-white/10 focus:border-violet-soft/70')}/>
                  {touched && !validEmail && <div className="mt-1.5 text-[12px] text-red-300/80">Please enter a valid email address.</div>}
                </div>
                <button type="submit"
                        className="btn-grad w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
                  Download Now <IconArrowRight size={14}/>
                </button>
                <p className="text-center text-[12px] text-white/40">No spam, ever. Unsubscribe anytime.</p>
              </form>
            </>
          ) : (
            <>
              <div className="mt-5 flex justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-400/15 border border-emerald-400/40 text-emerald-300">
                  <IconCheck size={20}/>
                </div>
              </div>
              <h3 className="mt-5 text-center grad-text font-semibold tracking-tight" style={{fontSize:'26px', lineHeight:1.15}}>
                Your download is starting!
              </h3>
              <p className="mt-3 text-center text-[14px] text-white/55">
                Hey <span className="text-white/80">{name.trim()}</span>, your file should be saving now. If it didn't start,{' '}
                <a href={resource.downloadUrl} download className="text-violet-soft underline underline-offset-2 hover:text-white transition-colors">
                  click here to download again
                </a>.
              </p>
              <button onClick={onClose}
                      className="mt-6 btn-ghost w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── WHAT YOU GET ─────────────────────────
function WhyTheseWork() {
  const items = [
    [IconBolt,    'Plug and Play',   'Every resource is structured to work out of the box. No setup hell, no debugging tutorials.'],
    [IconTarget,  'Founder Focused', 'Built for solo builders and small teams who need to move fast without a 10-person team.'],
    [IconRefresh, 'Always Updated',  'Resources get refreshed as the tools and APIs evolve. You always get the latest version.'],
  ];
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="03 Why">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="max-w-[760px]">
          <span className="pill"><span className="dot"/>Why These Work</span>
          <h2 className="h-section grad-text-tight mt-5">
            Battle-Tested in Real<br/>Projects. Not Theory.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {items.map(([Ic, t, d], i) => (
            <div key={i} className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-soft/15 to-violet-deep/30 border border-white/10 text-violet-soft">
                <Ic size={20}/>
              </div>
              <h3 className="mt-5 text-[20px] font-semibold tracking-tight">{t}</h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.6] text-white/55 max-w-[340px]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── INSTAGRAM TEASER ─────────────────────────
function InstagramTeaser() {
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="04 Instagram">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="relative rounded-3xl glass-strong overflow-hidden px-7 py-12 md:px-14 md:py-16">
          <div className="glow-orb deep pulse-glow" style={{ width: 900, height: 700, left: '20%', top: '60%', opacity:.5 }}/>
          <div className="glow-orb violet" style={{ width: 600, height: 600, right: '5%', top: '0%', opacity:.4 }}/>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 items-center">
            <div className="md:col-span-3">
              <span className="pill"><span className="dot"/>More Free Stuff</span>
              <h2 className="grad-text-tight mt-5 font-bold tracking-tight" style={{fontSize:'clamp(28px, 3.4vw, 40px)', lineHeight:1.05}}>
                I Drop New Builds<br/>Daily on Instagram
              </h2>
              <p className="mt-5 text-[16px] leading-[1.6] text-white/60 max-w-[460px]">
                Watch me build real AI products in public. Steal the workflows. Skip the courses.
              </p>
              <a href="#" className="mt-7 btn-grad inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium">
                <IconInsta size={15}/> Follow on Instagram <IconArrowRight size={14}/>
              </a>
            </div>

            {/* Phone mockup */}
            <div className="md:col-span-2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 glow-orb violet" style={{opacity:.6}}/>
                <div className="relative w-[220px] h-[400px] rounded-[36px] border-[6px] border-white/10 bg-black overflow-hidden"
                     style={{boxShadow:'0 40px 100px -30px rgba(124,92,255,.7), 0 0 0 1px rgba(255,255,255,0.06) inset'}}>
                  {/* Reel content */}
                  <div className="absolute inset-0" style={{background:'linear-gradient(160deg, oklch(0.4 0.22 280), oklch(0.25 0.18 290) 60%, #0A0A0F)'}}/>
                  {/* gradient blobs */}
                  <div className="absolute top-12 left-8 w-32 h-32 rounded-full"
                       style={{background:'radial-gradient(closest-side, rgba(192,132,252,.7), transparent 70%)', filter:'blur(20px)'}}/>
                  <div className="absolute bottom-20 right-6 w-24 h-24 rounded-full"
                       style={{background:'radial-gradient(closest-side, rgba(96,165,250,.6), transparent 70%)', filter:'blur(18px)'}}/>

                  {/* Top bar */}
                  <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full border border-white/30 bg-gradient-to-br from-violet-mid to-violet-deep"/>
                    <div className="text-white text-[12px] font-semibold leading-tight">@vexel.studio</div>
                    <div className="ml-auto text-white/70 text-[16px] leading-none">···</div>
                  </div>

                  {/* Caption stamp */}
                  <div className="absolute left-3 right-3 bottom-16 text-white">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Day 042</div>
                    <div className="mt-1 text-[15px] font-semibold leading-tight tracking-tight">Building a $5k MRR<br/>AI app in 7 days</div>
                  </div>

                  {/* Right action rail */}
                  <div className="absolute right-2 bottom-24 flex flex-col items-center gap-3 text-white/85">
                    <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">♥</div><span className="text-[10px] mt-0.5">12k</span></div>
                    <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">💬</div><span className="text-[10px] mt-0.5">284</span></div>
                    <div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[12px]">↗</div><span className="text-[10px] mt-0.5">Share</span></div>
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                         style={{background:'rgba(0,0,0,0.35)', backdropFilter:'blur(8px)'}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7 4v16l13-8z"/></svg>
                    </div>
                  </div>

                  {/* Scrubber */}
                  <div className="absolute bottom-3 left-3 right-3 h-1 rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-white/85" style={{width:'42%'}}/>
                  </div>
                </div>
                {/* notch */}
                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── RESOURCES FAQ ─────────────────────────
function ResourcesFAQ() {
  const items = [
    ['Are these really free?',
     'Yes. Every resource on this page is genuinely free. No credit card, no upsells. The only thing we ask is your email so we can send you the link — and so we can let you know when something new drops.'],
    ['Can I use these in client projects?',
     'Absolutely. Use them, modify them, sell projects built on top of them. The only thing you cannot do is repackage and resell the resources themselves as your own product.'],
    ['How often do you add new resources?',
     'Roughly one new resource per week. Usually pulled directly from a build I am working on, so it is something I have actually used in production within the last 30 days.'],
    ['Can I request a specific resource?',
     'Please do. Reply to any of our emails or DM on Instagram. The most-requested topics get prioritized — past requests have shaped at least half of what is on this page.'],
  ];
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="05 FAQ">
      <div className="max-w-[920px] mx-auto px-5 md:px-8">
        <div className="text-center">
          <span className="pill"><span className="dot"/>Quick Answers</span>
          <h2 className="h-section grad-text-tight mt-5">Common Questions</h2>
        </div>
        <div className="mt-12 space-y-3">
          {items.map(([q, a], i) => (
            <details key={i} className="glass rounded-2xl group lift" open={i === 0}>
              <summary className="flex items-center justify-between gap-5 px-6 py-5 md:px-7 md:py-6">
                <span className="text-[16.5px] md:text-[18px] font-medium tracking-tight">{q}</span>
                <span className="faq-icon shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/70">
                  <IconPlus size={16} strokeWidth={1.8}/>
                </span>
              </summary>
              <div className="px-6 md:px-7 pb-6 -mt-1 text-[15px] leading-[1.65] text-white/60 max-w-[680px]">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── RESOURCES FINAL CTA ─────────────────────────
function ResourcesFinalCTA({ onOpenContact }) {
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="06 CTA">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="relative rounded-3xl glass-strong overflow-hidden px-7 py-16 md:px-16 md:py-24 text-center">
          <div className="glow-orb deep pulse-glow" style={{ width: 1100, height: 1100, left: '50%', top: '60%', opacity:.45 }}/>
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <span className="pill"><span className="dot"/>Beyond the Library</span>
            <h2 className="h-cta grad-text mt-6 max-w-[860px] mx-auto">
              Need Something<br/>Custom Built?
            </h2>
            <p className="mt-6 text-[17px] md:text-[18px] leading-[1.55] text-white/60 max-w-[560px] mx-auto">
              These resources are great. But if you need a full AI-powered product shipped, let us talk.
            </p>
            <div className="mt-9 flex justify-center">
              <button onClick={onOpenContact} className="btn-grad inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium">
                Book a Strategy Call <IconArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── HOMEPAGE TEASER ─────────────────────────
function ResourcesTeaser({ onOpen }) {
  const preview = RESOURCES.slice(0, 6);
  return (
    <section className="relative py-[100px] md:py-[120px]" data-screen-label="X Resources Teaser">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="pill"><span className="dot"/>Free Resources</span>
          <h2 className="h-section grad-text-tight mt-5">Steal My Playbooks. Free.</h2>
          <p className="mt-5 text-[17px] leading-[1.55] text-white/55 max-w-[560px] mx-auto">
            Templates, workflows, and prompts I use to ship AI products fast. Yours, no strings attached.
          </p>
        </div>

        <div className="mt-12 relative">
          <div className="overflow-x-auto no-scrollbar"
               style={{maskImage:'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)', WebkitMaskImage:'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)'}}>
            <div className="flex gap-5 px-5 md:px-2 pb-2">
              {preview.map((r, i) => (
                <ResourceCard key={i} r={r} onOpen={onOpen} compact />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a href="Resources.html" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-medium border border-violet-soft/50 text-white hover:bg-violet-deep/15 transition-colors"
             style={{boxShadow:'0 0 0 1px rgba(168,85,247,.2) inset, 0 0 30px -8px rgba(168,85,247,.4)'}}>
            Browse All Resources <IconArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  ResourcesHero, ResourceGrid, ResourceCard, ResourceModal,
  WhyTheseWork, InstagramTeaser, ResourcesFAQ, ResourcesFinalCTA,
  ResourcesTeaser, RESOURCES,
});
