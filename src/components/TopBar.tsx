import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronIcon, CloseIcon, GlobeIcon, SearchIcon } from "./Icons";
import { useI18n } from "../i18n";
import { LANGS, LANG_ORDER } from "../data/ui";
import type { Category } from "../data/types";
import mark from "../assets/brand/mark-cactus.svg";
import { useMagnetic } from "../hooks/useMagnetic";

interface Props {
  cats: Category[];
  query: string;
  setQuery: (q: string) => void;
  onGo: (id: string) => void;
  onActive: (id: string | null) => void;
  resultsLabel: string | null;
  searching: boolean;
}

export function TopBar({ cats, query, setQuery, onGo, onActive, resultsLabel, searching }: Props) {
  const { lang, t, switchLang, secondary, setSecondary } = useI18n();
  const sentinel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const langBtn = useRef<HTMLButtonElement>(null);
  const [stuck, setStuck] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const focused = useRef(false);
  useMagnetic(langBtn, 0.22);

  // --bar-h feeds scroll-margin so section headers land just under the bar
  useLayoutEffect(() => {
    const el = bar.current;
    if (!el) return;
    // The sticky bar tucks its search row away while scrolling, so sections are aligned to the chip row only.
    const set = () => {
      const row = el.querySelector<HTMLElement>(".bar__row1");
      document.documentElement.style.setProperty("--bar-h", `${el.offsetHeight - (row?.offsetHeight ?? 0)}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // stuck state via a 1px sentinel above the bar
  useEffect(() => {
    const s = sentinel.current;
    if (!s || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(s);
    return () => io.disconnect();
  }, []);

  // tuck the search row away while scrolling down, bring it back on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = y - last;
        if (focused.current) setTucked(false);
        else if (d > 8 && y > 260) setTucked(true);
        else if (d < -6 || y < 200) setTucked(false);
        if (Math.abs(d) > 4) last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: a thin band at ~1/3 of the viewport decides the current section
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = new Set(cats.map((c) => c.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = ids.has(e.target.id) ? e.target.id : null;
          setActive(id);
        }
      },
      { rootMargin: "-32% 0px -64% 0px", threshold: 0 },
    );
    cats.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    document.querySelectorAll("[data-spy-null]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cats]);

  useEffect(() => {
    onActive(active);
    // keep the active chip centred (direction-aware)
    const box = chips.current;
    const chip = active ? box?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!box || !chip) return;
    const rtl = getComputedStyle(box).direction === "rtl";
    const x = chip.offsetLeft + chip.offsetWidth / 2 - box.clientWidth / 2;
    box.scrollTo({ left: rtl ? x - (box.scrollWidth - box.clientWidth) : x, behavior: "smooth" });
  }, [active, onActive]);

  // close language menu on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const off = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".lang-menu") && !t.closest("[data-lang-btn]")) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", off);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", off);
      document.removeEventListener("keydown", esc);
    };
  }, [menuOpen]);

  const onInput = (v: string) => {
    if (!query && v) {
      // first keystroke: bring the results to the top of the screen
      const s = sentinel.current;
      if (s) {
        const top = s.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY < top) window.scrollTo({ top, behavior: "auto" });
      }
    }
    setQuery(v);
  };

  const nudge = (dirn: 1 | -1) => {
    const box = chips.current;
    if (!box) return;
    const rtl = getComputedStyle(box).direction === "rtl";
    box.scrollBy({ left: dirn * (rtl ? -1 : 1) * 280, behavior: "smooth" });
  };

  return (
    <>
      <div ref={sentinel} aria-hidden="true" style={{ height: 1, marginBlockEnd: -1 }} />
      <header ref={bar} className={`bar${stuck ? " is-stuck" : ""}${tucked && !menuOpen ? " is-tucked" : ""}`}>
        <div className="wrap">
          <div className="bar__row1">
            <a
              className="bar__logo"
              href={`/${lang}`}
              aria-label={t("home")}
              onClick={(e) => {
                e.preventDefault();
                setQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img src={mark} alt="" width={20} height={34} />
            </a>
            <div className="search" role="search">
              <span className="search__icon">
                <SearchIcon width={20} height={20} />
              </span>
              <input
                ref={input}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchLabel")}
                onChange={(e) => onInput(e.target.value)}
                onFocus={() => {
                  focused.current = true;
                  setTucked(false);
                }}
                onBlur={() => {
                  focused.current = false;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                  if (e.key === "Enter") input.current?.blur();
                }}
              />
              <button type="button" className="search__clear" hidden={!query} aria-label={t("searchClear")} onClick={() => { setQuery(""); input.current?.focus(); }}>
                <CloseIcon width={18} height={18} />
              </button>
            </div>
            <button type="button" className="icon-btn" aria-pressed={secondary} aria-label={t("secondaryLang")} title={t("secondaryLang")} onClick={() => setSecondary(!secondary)}>
              <span aria-hidden="true" style={{ fontFamily: "var(--f-en)" }}>A<span lang="ar" style={{ fontFamily: "var(--f-ar)", fontWeight: 700, fontSize: "1.12em", marginInlineStart: 1 }}>ع</span></span>
            </button>
            <button ref={langBtn} data-lang-btn type="button" className="icon-btn" aria-haspopup="true" aria-expanded={menuOpen} aria-label={`${t("language")}: ${LANGS[lang].label}`} onClick={() => setMenuOpen((v) => !v)}>
              <GlobeIcon />
              <span aria-hidden="true" style={{ fontFamily: "var(--f-en)", letterSpacing: "0.06em" }}>{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lang-menu" role="radiogroup" aria-label={t("chooseLanguage")}>
            {LANG_ORDER.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={l === lang}
                lang={LANGS[l].htmlLang}
                dir={LANGS[l].dir}
                onClick={() => {
                  setMenuOpen(false);
                  switchLang(l);
                }}
              >
                <span>{LANGS[l].label}</span>
                <small style={{ fontFamily: "var(--f-en)", opacity: 0.6, letterSpacing: "0.12em" }}>{l.toUpperCase()}</small>
              </button>
            ))}
          </div>
        )}
        <nav className="chips-wrap" aria-label={t("categoriesNav")}>
          <button type="button" className="chips-arrow" aria-label={t("scrollPrev")} onClick={() => nudge(-1)} style={{ transform: "scaleX(-1)" }}>
            <ChevronIcon />
          </button>
          <div ref={chips} className="chips">
            {cats.map((c) => (
              <button key={c.id} type="button" data-id={c.id} className="chip" aria-current={!searching && active === c.id ? "true" : undefined} onClick={() => onGo(c.id)}>
                {c.name[lang]}
              </button>
            ))}
          </div>
          <button type="button" className="chips-arrow" aria-label={t("scrollNext")} onClick={() => nudge(1)}>
            <ChevronIcon />
          </button>
        </nav>
        <p className="sr-only" role="status" aria-live="polite">{resultsLabel}</p>
      </header>
    </>
  );
}
