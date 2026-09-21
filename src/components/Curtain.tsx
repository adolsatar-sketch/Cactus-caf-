import { useEffect, useRef } from "react";
import { CLetterGlyph } from "./BrandIcons";
import { useI18n } from "../i18n";
import { gsap } from "../lib/gsap";

/** The wipe that covers the page while the language changes underneath. No reload. */
export function Curtain() {
  const { registerCurtain } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    gsap.set(node, { yPercent: 101 });
    registerCurtain((swap) => {
      gsap.killTweensOf(node);
      node.style.visibility = "visible";
      const glyph = node.querySelector("svg");
      gsap
        .timeline({ onComplete: () => { node.style.visibility = "hidden"; gsap.set(node, { yPercent: 101 }); } })
        .fromTo(node, { yPercent: 101 }, { yPercent: 0, duration: 0.4, ease: "power3.inOut" })
        .fromTo(glyph, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 0.22)
        .add(swap)
        .to({}, { duration: 0.16 })
        .to(node, { yPercent: -101, duration: 0.5, ease: "power3.inOut" });
    });
    return () => registerCurtain(null);
  }, [registerCurtain]);
  return (
    <div ref={el} className="curtain" aria-hidden="true">
      <CLetterGlyph />
    </div>
  );
}
