import type { SVGProps } from "react";

// Single consistent line-icon set (stroke = currentColor). Replaces emoji so
// the UI reads as a deliberate product, not a generated one.
const P: Record<string, React.ReactNode> = {
  prompt: <><path d="M4 7l5 5-5 5" /><path d="M13 17h7" /></>,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M7 9l3 3-3 3" /><path d="M13 15h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  upload: <><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />,
  arrowRight: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  arrowLeft: <><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="1.5" /><path d="M6 15H4V4a1 1 0 0 1 1-1h11v2" /></>,
  check: <path d="M4 12l5 5L20 6" />,
  flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 3 2 3H5" /></>,
  play: <path d="M7 4l13 8-13 8V4z" />,
  pause: <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>,
  replay: <><path d="M4 12a8 8 0 1 0 2.3-5.6" /><path d="M4 4v4h4" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="1.5" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  lock: <><rect x="4.5" y="10" width="15" height="11" rx="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9" /><path d="M17 6l3 3M14 9l2 2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
  radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12l6-4" /></>,
  fingerprint: <><path d="M6 11a6 6 0 0 1 12 0v2" /><path d="M9 12a3 3 0 0 1 6 0c0 3-1 5-1 5" /><path d="M12 12v4M7 15c0 2-.5 3-.5 3M18 14c0 3-1 5-1 5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M4 17l5-5 4 4 2-2 5 5" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="10" y="10" width="4" height="4" /><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" /></>,
  broadcast: <><circle cx="12" cy="12" r="2" /><path d="M6.5 6.5a8 8 0 0 0 0 11M17.5 6.5a8 8 0 0 1 0 11M9 9a4 4 0 0 0 0 6M15 9a4 4 0 0 1 0 6" /></>,
  smartphone: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
  download: <><path d="M12 4v11" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" /></>,
  bolt: <path d="M13 3L5 13h5l-1 8 8-11h-5z" />,
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></>,
};

const CAT: Record<string, string> = {
  recon: "radar", web: "globe", crypto: "lock", forensics: "fingerprint",
  stego: "image", rev: "cpu", network: "broadcast", password: "key",
  mobile: "smartphone", misc: "grid",
};

export function Icon({ name, size = 20, ...rest }: { name: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      {P[name] ?? P.grid}
    </svg>
  );
}

export const catIconName = (id: string) => CAT[id] ?? "grid";
