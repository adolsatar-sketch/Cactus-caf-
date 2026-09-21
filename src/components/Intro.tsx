import { useLayoutEffect, useRef } from "react";
import { BeanGlyph, CactusGlyph, CLetterGlyph, CupGlyph } from "./BrandIcons";
import type { Lang } from "../data/types";
import { LANGS, LANG_ORDER } from "../data/ui";
import { gsap, motionOK } from "../lib/gsap";
import { isLiteDevice } from "../lib/perf";
import { useMagnetic } from "../hooks/useMagnetic";
import mark from "../assets/brand/mark-cactus-white.svg";
import word from "../assets/brand/wordmark-white.svg";

interface IntroProps {
  onChoose: (lang: Lang) => void;
  /** The moment the page underneath may start its own entrance. */
  onReveal: () => void;
  onDone: () => void;
}

function LangButton({ lang, onPick }: { lang: Lang; onPick: (l: Lang, el: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useMagnetic(ref, 0.12);
  const m = LANGS[lang];
  return (
    <button ref={ref} type="button" className="lang-btn" lang={m.htmlLang} dir={m.dir} onClick={(e) => onPick(lang, e.currentTarget)}>
      <span>{m.label}</span>
      <small dir="ltr">{lang.toUpperCase()}</small>
    </button>
  );
}

/** Full-screen language screen: logo reveal → brand glyphs → three language buttons → circular reveal into the menu. */
export function Intro({ onChoose, onReveal, onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLDivElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const leaving = useRef<gsap.core.Timeline | null>(null);
  const choosing = useRef(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!motionOK()) {
      el.dataset.ready = "true";
      return;
    }
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      el.dataset.ready = "false";
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => { el.dataset.ready = "true"; } });
      tl.from(q(".intro__mark"), { clipPath: "inset(100% 0 0 0)", y: 24, duration: 0.95, ease: "power2.inOut" }, 0.1)
        .from(q(".intro__word"), { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.7 }, 0.75)
        .from(q(".intro__chip"), { scale: 0, rotate: -35, opacity: 0, stagger: 0.09, duration: 0.6, ease: "back.out(1.8)" }, 0.8)
        .from(q(".intro__choose"), { opacity: 0, y: 12, duration: 0.5 }, 1.2)
        .from(q(".lang-btn"), { opacity: 0, y: 26, stagger: 0.08, duration: 0.55 }, 1.25)
        .call(() => { el.dataset.ready = "true"; }, undefined, 1.35);
      entrance.current = tl;
    }, el);
    return () => ctx.revert();
  }, []);

  const pick = (lang: Lang, btn: HTMLElement) => {
    const el = root.current;
    const c = circle.current;
    const s = seal.current;
    if (!el || !c || !s || choosing.current) return;
    choosing.current = true;
    entrance.current?.progress(1);
    if (!motionOK()) {
      onChoose(lang);
      onReveal();
      gsap.to(el, { opacity: 0, duration: 0.25, onComplete: onDone });
      return;
    }
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 2 + 40;
    gsap.set(c, { width: R, height: R, left: cx, top: cy, xPercent: -50, yPercent: -50, scale: 0 });
    gsap.set(s, { left: cx, top: cy, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 });
    btn.classList.add("is-picked");
    const others = el.querySelectorAll(".lang-btn:not(.is-picked), .intro__logo, .intro__choose, .intro__chip, .intro__skip");
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(others, { opacity: 0, scale: 0.92, y: -8, duration: 0.32, stagger: 0.02, ease: "power2.in" }, 0)
      .to(btn, { scale: 1.05, duration: 0.22, ease: "power2.out" }, 0)
      .add(() => onChoose(lang), 0.15)
      .to(c, { scale: 1, duration: 0.8, ease: "power3.inOut" }, 0.2)
      .to(s, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, 0.5)
      .add(onReveal, 0.9)
      .to(s, { scale: 7, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.95)
      .to(el, { opacity: 0, duration: 0.35, ease: "power1.out" }, 1.1);
    leaving.current = tl;
  };

  const skip = () => {
    if (leaving.current) leaving.current.progress(1);
    else entrance.current?.progress(1);
  };

  return (
    <div ref={root} className="intro" role="dialog" aria-modal="true" aria-label="Choose your language · اختر اللغة · زمان هەڵبژێرە" data-ready="true">
      <div className="intro__bg" aria-hidden="true">
        <div className="intro__pattern" />
        <div className="intro__vignette" />
      </div>
      <div className="intro__stage">
        <div className="intro__logo">
          <span className="intro__chip intro__chip--bean" aria-hidden="true"><BeanGlyph /></span>
          <span className="intro__chip intro__chip--cup" aria-hidden="true"><CupGlyph /></span>
          <span className="intro__chip intro__chip--c" aria-hidden="true"><CLetterGlyph /></span>
          <span className="intro__chip intro__chip--cactus" aria-hidden="true"><CactusGlyph /></span>
          <img className="intro__mark" src={mark} alt="" width={164} height={275} />
          <img className="intro__word" src={word} alt="Cactus Café" width={338} height={102} />
        </div>
        <p className="intro__choose" aria-hidden="true">
          <span lang="ar">اختر اللغة</span>·<span lang="ckb">زمان هەڵبژێرە</span>·<span lang="en">Choose your language</span>
        </p>
        <div className="intro__langs">
          {LANG_ORDER.map((l) => (
            <LangButton key={l} lang={l} onPick={pick} />
          ))}
        </div>
      </div>
      <div ref={circle} className="intro__circle" aria-hidden="true" />
      <div ref={seal} className="intro__seal" aria-hidden="true"><CLetterGlyph /></div>
      <button type="button" className="intro__skip" onClick={skip}>
        <span lang="ar">تخطّي</span> · <span lang="en">Skip</span>
      </button>
    </div>
  );
}

/** Returning visitors: a short dark veil that closes like an iris onto the page. */
export function Veil({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!motionOK()) {
      onReveal();
      onDone();
      return;
    }
    let dead = false;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, onComplete: onDone });
      tl.fromTo(el.querySelector("img"), { scale: 0.9, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }, 0)
        .add(onReveal, 0.4)
        .to(el, { clipPath: "circle(0% at 50% 50%)", duration: 0.8, ease: "power3.inOut" }, 0.4);
      gsap.set(el, { clipPath: "circle(150% at 50% 50%)" });
      const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready ?? Promise.resolve();
      Promise.race([fonts, new Promise((r) => setTimeout(r, isLiteDevice() ? 600 : 1100))]).then(() => {
        if (!dead) tl.play();
      });
    }, el);
    return () => {
      dead = true;
      ctx.revert();
    };
  }, [onDone, onReveal]);
  return (
    <div ref={root} className="veil" aria-hidden="true">
      <img src={mark} alt="" width={74} height={124} />
    </div>
  );
}
