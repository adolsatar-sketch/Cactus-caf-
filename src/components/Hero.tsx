import { useLayoutEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { gsap, motionOK } from "../lib/gsap";
import { isLiteDevice } from "../lib/perf";
import site from "../data/site.config.json";
import mark from "../assets/brand/mark-cactus.svg";
import word from "../assets/brand/wordmark.svg";
import cluster from "../assets/brand/pattern-cluster.svg";

export function Hero({ entered }: { entered: boolean }) {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !motionOK()) return;
    const ctx = gsap.context(() => {
      const q = (s: string) => el.querySelector(s);
      const t1 = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      t1.from(q(".hero__mark"), { clipPath: "inset(100% 0 0 0)", y: 26, duration: 1, ease: "power2.out" }, 0)
        .from(q(".hero__word"), { clipPath: "inset(0 100% 0 0)", opacity: 0, duration: 0.8 }, 0.45)
        .from(".hero__welcome, .hero__sub", { y: 22, opacity: 0, stagger: 0.12, duration: 0.7 }, 0.75)
        .from(q(".band"), { scaleX: 0, transformOrigin: document.documentElement.dir === "rtl" ? "100% 50%" : "0% 50%", duration: 1, ease: "power2.inOut" }, 0.5)
        .from(q(".hero__cluster"), { opacity: 0, y: 40, duration: 1 }, 0.6)
        .call(() => {
          gsap.set(el.querySelectorAll(".hero__mark, .hero__word, .hero__welcome, .hero__sub, .band, .hero__cluster"), { clearProps: "clipPath,opacity,transform" });
        });
      tl.current = t1;
      if (!isLiteDevice()) {
        gsap.to(".hero__inner", { yPercent: -10, opacity: 0.35, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero__cluster", { yPercent: 14, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (entered) tl.current?.play();
  }, [entered]);

  return (
    <section ref={root} className="hero" id="top" data-spy-null aria-label={site.name.en}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__cluster" aria-hidden="true">
        <img src={cluster} alt="" width={312} height={468} decoding="async" />
      </div>
      <div className="wrap hero__inner">
        <img className="hero__mark" src={mark} alt="" width={164} height={275} />
        <img className="hero__word" src={word} alt={site.name.en} width={338} height={102} />
        <h1 className="hero__welcome">{t("welcomeTitle")}</h1>
        <p className="hero__sub">{t("welcomeSub")}</p>
      </div>
      <div className="band" aria-hidden="true">
        <div className="band__track" />
      </div>
    </section>
  );
}
