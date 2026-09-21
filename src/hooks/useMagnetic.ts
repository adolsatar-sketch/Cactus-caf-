import { useEffect, type RefObject } from "react";
import { gsap, finePointer, motionOK } from "../lib/gsap";

/** Desktop-only: element drifts slightly toward the pointer. Skipped on touch and for reduced motion. */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.28): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || !motionOK()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "x,y" });
    };
  }, [ref, strength]);
}
