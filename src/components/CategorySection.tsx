import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GLYPHS } from "./BrandIcons";
import { BoltIcon, LinkIcon } from "./Icons";
import { Fx, FX_TONE } from "./Fx";
import { ItemCard } from "./ItemCard";
import type { Category, Lang, MenuItem } from "../data/types";
import { UI, itemCountLabel } from "../data/ui";
import { buildEntrance } from "../lib/entrances";
import { gsap, motionOK, ScrollTrigger } from "../lib/gsap";
import { toast } from "../lib/nav";
import { buildPath } from "../lib/route";
import { isLiteDevice } from "../lib/perf";

interface Props {
  cat: Category;
  index: number;
  total: number;
  items: MenuItem[];
  matches: Set<string> | null;
  lang: Lang;
  secLang: Lang | null;
}

export const CategorySection = memo(function CategorySection({ cat, index, total, items, matches, lang, secLang }: Props) {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const Glyph = GLYPHS[cat.glyph];
  const tone = FX_TONE[cat.fx];
  const visibleCount = matches ? items.filter((i) => matches.has(i.id)).length : items.length;

  // Motifs only animate while their header is (nearly) on screen.
  useEffect(() => {
    const el = head.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll-driven entrances. Everything is visible by default: if any of this fails, the menu is still fully readable.
  useLayoutEffect(() => {
    const section = root.current;
    const h = head.current;
    if (!section || !h || !motionOK()) return;
    const ctx = gsap.context(() => {
      try {
        // Every trigger handles all four crossing directions, so nothing can stay hidden however the visitor arrives
        // (deep link near the bottom, fast flick, jump buttons, scrolling back up).
        const tl = buildEntrance(h, cat.fx);
        ScrollTrigger.create({ trigger: h, start: "top 90%", onEnter: () => tl.play(), onEnterBack: () => tl.play(), onLeave: () => tl.progress(1) });

        const els = section.querySelectorAll<HTMLElement>(".item");
        gsap.set(els, { opacity: 0, y: 22 });
        const reveal = (batch: Element[]) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power2.out", overwrite: true, clearProps: "opacity,transform" });
        ScrollTrigger.batch(els, {
          start: "top 96%",
          interval: 0.08,
          batchMax: 6,
          onEnter: reveal,
          onEnterBack: reveal,
          onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, clearProps: "opacity,transform" }),
        });

        const g = h.querySelector(".cat__glyph");
        if (g && !isLiteDevice()) {
          gsap.fromTo(g, { yPercent: -7 }, { yPercent: 9, ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        }
      } catch {
        gsap.set(section.querySelectorAll(".item, [data-e], .cat__head"), { clearProps: "all" });
      }
    }, section);
    return () => ctx.revert();
  }, [cat.fx]);

  const share = () => {
    const url = `${location.origin}${buildPath(lang, cat.id)}`;
    const done = () => toast(UI.linkCopied[lang]);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, () => window.prompt("", url));
    else window.prompt("", url);
  };

  const no = String(index + 1).padStart(2, "0");
  return (
    <section ref={root} id={cat.id} className="cat" data-glyph={cat.glyph} hidden={visibleCount === 0} aria-labelledby={`${cat.id}-t`}>
      <header ref={head} className="cat__head" data-tone={tone}>
        <Fx variant={cat.fx} live={live} />
        <div className="cat__glyph" aria-hidden="true">
          <Glyph />
        </div>
        <div className="wrap cat__in">
          <span className="cat__no" data-e>
            {no} / {String(total).padStart(2, "0")}
          </span>
          <h2 id={`${cat.id}-t`} className="cat__title" data-e>
            {cat.name[lang]}
          </h2>
          <p className="cat__meta" data-e>
            {itemCountLabel(lang, visibleCount)}
          </p>
        </div>
        <button type="button" className="cat__share" onClick={share} aria-label={`${UI.shareSection[lang]}: ${cat.name[lang]}`}>
          <LinkIcon />
        </button>
      </header>
      <div className="wrap cat__body">
        {cat.note && (
          <p className="cat__note">
            <BoltIcon />
            <span>{cat.note[lang]}</span>
          </p>
        )}
        <div className="items">
          {items.map((it) => (
            <ItemCard key={it.id} item={it} lang={lang} secLang={secLang} hidden={matches ? !matches.has(it.id) : false} />
          ))}
        </div>
      </div>
    </section>
  );
});
