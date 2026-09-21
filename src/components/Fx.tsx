import type { CSSProperties } from "react";
import type { FxVariant } from "../data/types";

/** Tone of each category header. Alternates dark / mid / light so the long page keeps a rhythm. */
export const FX_TONE: Record<FxVariant, "dark" | "mid" | "light"> = {
  steam: "dark", swirl: "dark", creamy: "light", fresh: "mid", bubbles: "mid", morning: "light", pizza: "dark",
  leaf: "mid", ripple: "dark", ornament: "dark", clean: "light", layers: "light", fizz: "mid", smoke: "dark",
};

const v = (o: Record<string, string>): CSSProperties => o as CSSProperties;

function spiral(): string {
  let d = "";
  for (let a = 0; a <= 26; a += 0.18) {
    const r = 3 + a * 3.6;
    d += `${a === 0 ? "M" : "L"}${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)} `;
  }
  return d;
}
const SPIRAL = spiral();
const WAVE = "M0 22 Q25 2 50 22 T100 22 T150 22 T200 22 V40 H0Z";
const LEAF = "M35 70C6 52 6 20 35 0c29 20 29 52 0 70Z";
const SLICE = "M30 4v52M4 30h52M11.6 11.6l36.8 36.8M48.4 11.6 11.6 48.4";

const bubbles = Array.from({ length: 9 }, (_, i) => v({ "--x": `${8 + i * 10.5}%`, "--s": `${10 + ((i * 7) % 14)}px`, "--t": `${5.5 + (i % 4) * 1.3}s`, "--d": `${-i * 0.9}s`, "--w": `${(i % 2 ? 1 : -1) * (8 + i * 2)}px` }));
const fizz = Array.from({ length: 16 }, (_, i) => v({ "--x": `${4 + i * 6}%`, "--s": `${3 + (i % 3)}px`, "--t": `${2.2 + (i % 5) * 0.5}s`, "--d": `${-i * 0.37}s`, "--w": `${(i % 2 ? 1 : -1) * 6}px` }));
const leaves = [ ["8%", "-30deg", "0s"], ["22%", "-12deg", "-1.4s"], ["38%", "8deg", "-2.6s"], ["54%", "24deg", "-0.8s"], ["70%", "-6deg", "-3.4s"] ].map(([x, r, d]) => v({ "--x": x, "--r": r, "--d": d }));
const smoke = [ ["30%", "0s", "50px"], ["48%", "-3.6s", "-40px"], ["66%", "-7s", "36px"] ].map(([x, d, w]) => v({ "--x": x, "--d": d, "--w": w }));

/** Decorative motif for a category header. Purely visual (aria-hidden). */
export function Fx({ variant, live }: { variant: FxVariant; live: boolean }) {
  let kids: React.ReactNode = null;
  switch (variant) {
    case "steam":
      kids = [0, 1, 2].map((k) => (<i key={k}><svg viewBox="0 0 40 120"><path d="M20 118C6 96 34 84 20 62S6 28 20 4" /></svg></i>));
      break;
    case "swirl":
      kids = (<i><svg viewBox="0 0 200 200"><path d={SPIRAL} /></svg></i>);
      break;
    case "creamy":
      kids = [0, 1, 2].map((k) => (<i key={k}><svg viewBox="0 0 200 40" preserveAspectRatio="none"><path d={WAVE} /></svg></i>));
      break;
    case "fresh":
      kids = [0, 1, 2].map((k) => (<i key={k}><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" /><circle cx="30" cy="30" r="20" /><path d={SLICE} /></svg></i>));
      break;
    case "bubbles":
      kids = bubbles.map((s, k) => <i key={k} style={s} />);
      break;
    case "morning":
      kids = [0, 1].map((k) => <i key={k} />);
      break;
    case "pizza":
      kids = [0, 1].map((k) => <i key={k} />);
      break;
    case "leaf":
      kids = leaves.map((s, k) => (<i key={k} style={s}><svg viewBox="0 0 70 70"><path d={LEAF} /></svg></i>));
      break;
    case "ripple":
      kids = [0, 1, 2].map((k) => <i key={k} />);
      break;
    case "ornament":
      kids = <i />;
      break;
    case "clean":
      kids = [0, 1, 2, 3].map((k) => <i key={k} style={v({ "--d": `${-k * 1.6}s` })} />);
      break;
    case "layers":
      kids = [0, 1, 2, 3].map((k) => <i key={k} style={v({ "--d": `${-k * 0.7}s` })} />);
      break;
    case "fizz":
      kids = fizz.map((s, k) => <i key={k} style={s} />);
      break;
    case "smoke":
      kids = smoke.map((s, k) => <i key={k} style={s} />);
      break;
  }
  return (
    <div className={`fx fx--${variant}${live ? " is-live" : ""}`} aria-hidden="true">
      {kids}
    </div>
  );
}
