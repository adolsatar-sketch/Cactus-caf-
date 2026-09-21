import type { FxVariant } from "../data/types";
import { gsap } from "./gsap";

/**
 * One distinct entrance per category — all built on the same three parts (number, title, meta) plus the glyph,
 * so the design system stays unified while each section still feels different.
 * Timelines are built paused; a ScrollTrigger plays them when the header scrolls into view.
 */
export function buildEntrance(head: HTMLElement, fx: FxVariant): gsap.core.Timeline {
  const rtl = document.documentElement.dir === "rtl";
  const dir = rtl ? -1 : 1;
  const parts = head.querySelectorAll<HTMLElement>("[data-e]");
  const glyph = head.querySelector<HTMLElement>(".cat__glyph");
  const motif = head.querySelector<HTMLElement>(".fx");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.7 } });
  const clear = "clipPath,opacity,transform,filter";
  tl.eventCallback("onComplete", () => {
    gsap.set([head, ...parts], { clearProps: clear });
  });

  switch (fx) {
    case "steam": // rises like vapour
      tl.from(parts, { y: 42, opacity: 0, filter: "blur(6px)", stagger: 0.09 }).from(glyph, { y: 50, opacity: 0, duration: 0.9 }, 0);
      break;
    case "swirl": // coffee swirl: things spin into place
      tl.from(glyph, { rotate: -140, scale: 0.4, opacity: 0, duration: 1 }, 0).from(parts, { x: 36 * dir, opacity: 0, stagger: 0.09 }, 0.1).from(motif, { rotate: 40, opacity: 0, duration: 1.2 }, 0);
      break;
    case "creamy": // milk wipe from below
      tl.from(head, { clipPath: "inset(100% 0 0 0)", duration: 0.85, ease: "power3.inOut" }).from(parts, { y: 24, opacity: 0, stagger: 0.08 }, 0.35);
      break;
    case "fresh": // juicy pop
      tl.from(head, { scale: 0.94, opacity: 0, duration: 0.6 }).from(glyph, { scale: 0, rotate: 30, ease: "back.out(2)", duration: 0.8 }, 0.15).from(parts, { y: 18, opacity: 0, stagger: 0.07 }, 0.2);
      break;
    case "bubbles": // bubbles pop
      tl.from(parts, { scale: 0.5, opacity: 0, ease: "back.out(2.6)", stagger: 0.1 }).from(glyph, { y: -70, opacity: 0, ease: "bounce.out", duration: 1 }, 0.1);
      break;
    case "morning": // slow sunrise
      tl.from(head, { opacity: 0, duration: 1.1, ease: "power2.out" }).from(parts, { y: 14, opacity: 0, stagger: 0.12, duration: 0.9 }, 0.25).from(motif, { scale: 0.6, transformOrigin: "100% 0%", duration: 1.4 }, 0);
      break;
    case "pizza": // round wipe like a sliced pie
      tl.from(head, { clipPath: `circle(0% at ${rtl ? 12 : 88}% 60%)`, duration: 1, ease: "power2.inOut" }).from(parts, { y: 20, opacity: 0, stagger: 0.08 }, 0.5);
      break;
    case "leaf": // leaves unfurl
      tl.from(glyph, { rotate: -28, transformOrigin: "50% 100%", opacity: 0, duration: 0.9 }, 0).from(parts, { xPercent: -12 * dir, opacity: 0, skewX: 6, stagger: 0.09 }, 0.05);
      break;
    case "ripple": // circular ripple from the centre
      tl.from(head, { clipPath: "circle(0% at 50% 50%)", duration: 1, ease: "power2.inOut" }).from(parts, { scale: 0.9, opacity: 0, stagger: 0.08 }, 0.45);
      break;
    case "ornament": // opens from the middle like a lattice screen
      tl.from(head, { clipPath: "inset(0 50% 0 50%)", duration: 0.9, ease: "power3.inOut" }).from(parts, { opacity: 0, y: 14, stagger: 0.08 }, 0.5);
      break;
    case "clean": // minimal: tracking tightens, lines settle
      tl.from(parts, { opacity: 0, letterSpacing: "0.18em", stagger: 0.08, duration: 0.8 }).from(motif, { opacity: 0, duration: 0.9 }, 0.1);
      break;
    case "layers": // stacked layers rise one by one
      tl.from(parts, { y: 64, opacity: 0, ease: "back.out(1.3)", stagger: 0.14, duration: 0.8 }).from(glyph, { y: 60, opacity: 0, duration: 0.9 }, 0.2);
      break;
    case "fizz": // quick fizzy snap
      tl.from(head, { scale: 1.06, opacity: 0, duration: 0.35, ease: "power2.out" }).from(glyph, { rotate: 24, scale: 0.7, duration: 0.5 }, 0).from(parts, { y: 12, opacity: 0, stagger: 0.04, duration: 0.4 }, 0.1);
      break;
    case "smoke": // dissolves in from a haze
      tl.from(head, { opacity: 0, filter: "blur(14px)", duration: 1.1 }).from(parts, { y: 10, opacity: 0, stagger: 0.1, duration: 0.9 }, 0.3);
      break;
  }
  return tl;
}
