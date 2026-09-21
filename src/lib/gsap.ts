import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./perf";

gsap.registerPlugin(ScrollTrigger);
// Never let a slow frame produce a giant jump — animations stay smooth on low-end phones.
gsap.ticker.lagSmoothing(500, 33);

export { gsap, ScrollTrigger };

/** True when we are allowed to run decorative motion. */
export const motionOK = (): boolean => !prefersReducedMotion();

/** True on phones/tablets/laptops with a touch-first pointer (no hover): magnetic effects are skipped there. */
export const finePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(hover:hover) and (pointer:fine)").matches;

let raf = 0;
/** Coalesces many layout changes (search, language switch) into one ScrollTrigger refresh. */
export function refreshTriggers(): void {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => ScrollTrigger.refresh());
}
