import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

export const SearchIcon = (p: P) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const CloseIcon = (p: P) => (<svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const ChevronIcon = (p: P) => (<svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>);
export const ArrowUpIcon = (p: P) => (<svg {...base} {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
export const LinkIcon = (p: P) => (<svg {...base} {...p}><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.4" /><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.33-1.3" /></svg>);
export const InstagramIcon = (p: P) => (<svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></svg>);
export const GlobeIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3Z" /></svg>);
export const BoltIcon = (p: P) => (<svg {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>);
export const PhoneIcon = (p: P) => (<svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const EmptyIcon = (p: P) => (<svg {...base} strokeWidth={1.6} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M8.5 11h5" /></svg>);
