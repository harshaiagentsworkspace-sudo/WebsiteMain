// Lucide-style inline SVG icons. Stroke-based, 1.6 stroke width.

const Icon = ({ children, size = 20, className = "", strokeWidth = 1.6 }) =>
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
fill="none" stroke="currentColor" strokeWidth={strokeWidth}
strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>;


const IconArrowRight = (p) =>
<Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;

const IconArrowUpRight = (p) =>
<Icon {...p}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></Icon>;

const IconCheck = (p) =>
<Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;

const IconPlus = (p) =>
<Icon {...p}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>;

const IconStar = (p) =>
<Icon {...p} strokeWidth={0}>
    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" fill="currentColor" />
  </Icon>;

const IconMenu = (p) =>
<Icon {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>;

const IconX = (p) =>
<Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;


// Service icons — original, line-style with subtle gradient stops
const IconCodeSparkle = (p) =>
<Icon {...p} strokeWidth={1.4}>
    <path d="M9 7 4 12l5 5" />
    <path d="m15 7 5 5-5 5" />
    <path d="M11 4.5 9.5 10 4 11.5 9.5 13 11 18.5 12.5 13 18 11.5 12.5 10 11 4.5Z" opacity=".0" />
    <circle cx="17.5" cy="5.5" r=".7" fill="currentColor" />
    <circle cx="20" cy="3.5" r=".5" fill="currentColor" />
    <circle cx="14.5" cy="3" r=".4" fill="currentColor" />
  </Icon>;


const IconNodes = (p) =>
<Icon {...p} strokeWidth={1.4}>
    <circle cx="5" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="12" cy="12" r="1.4" />
    <path d="M7 6c3 0 4.5 1.7 5 6" />
    <path d="M7 18c3 0 4.5-1.7 5-6" />
    <path d="M13.4 12H17" />
  </Icon>;


const IconCursor = (p) =>
<Icon {...p} strokeWidth={1.4}>
    <path d="m4 4 6.5 16 2.4-6.7L19.5 11 4 4Z" />
    <rect x="11" y="15" width="9" height="5" rx="2.5" />
  </Icon>;


const IconGrid = (p) =>
<Icon {...p} strokeWidth={1.4}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <path d="M10 6.5h4M6.5 10v4M17.5 10v4M14 17.5h-4" opacity=".6" />
  </Icon>;


const IconCalendar = (p) =>
<Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></Icon>;

const IconRocket = (p) =>
<Icon {...p}>
    <path d="M14 14a7 7 0 0 1-7 0c0-4 3-9 7-11 4 2 7 7 7 11a7 7 0 0 1-7 0Z" />
    <circle cx="14" cy="9" r="1.6" />
    <path d="M9 17c-1 1-1.5 3-1 5 2 .5 4 0 5-1" />
  </Icon>;

const IconBolt = (p) =>
<Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></Icon>;

const IconTarget = (p) =>
<Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></Icon>;

const IconRefresh = (p) =>
<Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></Icon>;

const IconDownload = (p) =>
<Icon {...p}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></Icon>;

const IconBook = (p) =>
<Icon {...p}><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" /><path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8Z" /></Icon>;

const IconWand = (p) =>
<Icon {...p}><path d="M15 4 20 9" /><path d="m4 20 11-11" /><path d="M18 2v3M21 4h-3M5 13v3M7 14H4" /></Icon>;

const IconWorkflow = (p) =>
<Icon {...p}><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="15" width="6" height="6" rx="1.5" /><path d="M9 6h7a2 2 0 0 1 2 2v7" /></Icon>;

const IconFile = (p) =>
<Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></Icon>;

const IconSparkles = (p) =>
<Icon {...p}><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M6.5 17.5 9 15M15 9l2.5-2.5" /></Icon>;

const IconPalette = (p) =>
<Icon {...p}><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-2 2-2 3-2h1a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="9.5" cy="7" r="1" fill="currentColor" /><circle cx="14.5" cy="7" r="1" fill="currentColor" /><circle cx="17" cy="11" r="1" fill="currentColor" /></Icon>;

const IconClipboard = (p) =>
<Icon {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 11h6M9 15h4" /></Icon>;

const IconHeadphones = (p) =>
<Icon {...p}><path d="M3 14a9 9 0 0 1 18 0" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></Icon>;


Object.assign(window, {
  IconTarget, IconRefresh, IconDownload, IconBook, IconWand, IconWorkflow, IconFile,
  IconSparkles, IconPalette, IconClipboard, IconHeadphones
});


// Social
const IconX2 = (p) =>
<Icon {...p} strokeWidth={1.6}>
    <path d="M4 4l16 16M20 4 4 20" />
  </Icon>;

const IconInsta = (p) =>
<Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r=".8" fill="currentColor" /></Icon>;

const IconLinkedIn = (p) =>
<Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 10v7M8 7.2v.1M12 17v-4.5a2 2 0 0 1 4 0V17M12 12v5" /></Icon>;

const IconGitHub = (p) =>
<Icon {...p}>
    <path d="M9 19c-4 1-4-2-6-2" />
    <path d="M15 21v-3.5c0-1 .1-1.4-.5-2 3-.3 5.5-1.5 5.5-6.5a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 1.7 5.4 2 5.4 2a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 4 8.6c0 5 2.5 6.2 5.5 6.5-.6.6-.6 1.2-.5 2V21" />
  </Icon>;


// Logo lockup — Orbit (original): tilted orbital ring with an orbiting dot
const Wordmark = ({ className = "" }) =>
<div className={"flex items-center gap-2.5 " + className}>
    <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
      <defs>
        <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#C084FC" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
      </defs>
      {/* tilted orbit ring */}
      <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-30 12 12)"
    fill="none" stroke="url(#lg1)" strokeWidth="1.6" />
      {/* core */}
      <circle cx="12" cy="12" r="2.2" fill="url(#lg1)" />
      {/* orbiting satellite */}
      <circle cx="19.5" cy="8.2" r="1.5" fill="#C084FC" />
    </svg>
    <span className="text-[18px] font-semibold tracking-tight">Build AI Solutions</span>
  </div>;


Object.assign(window, {
  IconArrowRight, IconArrowUpRight, IconCheck, IconPlus, IconStar, IconMenu, IconX,
  IconCodeSparkle, IconNodes, IconCursor, IconGrid, IconCalendar, IconRocket, IconBolt,
  IconX2, IconInsta, IconLinkedIn, IconGitHub,
  Wordmark
});