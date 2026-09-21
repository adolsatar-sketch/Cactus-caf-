import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { BackToTop } from "./components/BackToTop";
import { CategorySection } from "./components/CategorySection";
import { Curtain } from "./components/Curtain";
import { EmptyIcon } from "./components/Icons";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Intro, Veil } from "./components/Intro";
import { Shortcuts } from "./components/Shortcuts";
import { Toast } from "./components/Toast";
import { TopBar } from "./components/TopBar";
import type { Lang } from "./data/types";
import { resultsLabel } from "./data/ui";
import { useI18n } from "./i18n";
import { refreshTriggers } from "./lib/gsap";
import { categories, categoryIds, itemsByCategory, menu } from "./lib/menu";
import { scrollToCategory } from "./lib/nav";
import { buildPath, parseRoute } from "./lib/route";
import { buildIndex, searchItems } from "./lib/search";

const counts: Record<string, number> = Object.fromEntries(categories.map((c) => [c.id, itemsByCategory[c.id].length]));
const searchIndex = buildIndex(
  menu.items,
  Object.fromEntries(categories.map((c) => [c.id, `${c.name.ar} ${c.name.ku} ${c.name.en}`])),
);

export default function App({ needIntro, initialCategory }: { needIntro: boolean; initialCategory: string | null }) {
  const { lang, setLang, t, secondary, secLang } = useI18n();
  const [overlay, setOverlay] = useState<"intro" | "veil" | null>(needIntro ? "intro" : "veil");
  const [entered, setEntered] = useState(false);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const activeCat = useRef<string | null>(initialCategory);
  const urlTimer = useRef(0);
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  const matches = useMemo(() => searchItems(searchIndex, deferred), [deferred]);
  const searching = matches !== null;

  // Lock scrolling while a full-screen overlay is up.
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", overlay !== null);
    return () => document.documentElement.classList.remove("is-locked");
  }, [overlay]);

  // Failsafe: never leave the page waiting for an animation callback.
  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  // Keep ScrollTrigger positions right when the layout changes (search, language).
  useEffect(() => {
    refreshTriggers();
  }, [deferred, lang, secondary]);

  // Back/forward buttons and manual URL edits.
  useEffect(() => {
    const onPop = () => {
      const r = parseRoute(location.pathname, categoryIds, location.hash);
      if (r.lang && r.lang !== langRef.current) setLang(r.lang);
      if (r.category) scrollToCategory(r.category, true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setLang]);

  // Reflect the current language / section in the address bar (shareable, QR-friendly links).
  const syncUrl = useCallback((cat: string | null) => {
    window.clearTimeout(urlTimer.current);
    urlTimer.current = window.setTimeout(() => {
      const next = buildPath(langRef.current, cat);
      if (location.pathname !== next) history.replaceState(null, "", next);
    }, 250);
  }, []);
  const onActive = useCallback((id: string | null) => {
    activeCat.current = id;
    if (!needIntro || overlay === null) syncUrl(id);
  }, [syncUrl, needIntro, overlay]);
  useEffect(() => {
    if (overlay === null) syncUrl(activeCat.current);
  }, [lang, overlay, syncUrl]);

  const goTo = useCallback((id: string) => {
    setQuery("");
    // wait one frame so hidden sections (after a search) are laid out again
    requestAnimationFrame(() => {
      scrollToCategory(id);
      history.replaceState(null, "", buildPath(langRef.current, id));
    });
  }, []);

  const onChoose = useCallback((l: Lang) => {
    setLang(l);
    history.pushState(null, "", buildPath(l));
  }, [setLang]);
  const reveal = useCallback(() => setEntered(true), []);
  const done = useCallback(() => {
    setOverlay(null);
    if (initialCategory) requestAnimationFrame(() => scrollToCategory(initialCategory, true));
  }, [initialCategory]);

  const resultCount = matches ? matches.size : 0;
  const second = secondary ? secLang : null;

  return (
    <div className={`app${searching ? " is-searching" : ""}`}>
      <a className="skip-link" href="#menu" onClick={(e) => { e.preventDefault(); scrollToCategory("menu-start"); }}>
        {t("skipToContent")}
      </a>
      <div className="ambient" aria-hidden="true"><i /><i /><i /></div>
      <div {...(overlay ? { inert: true } : {})}>
        <Hero entered={entered} />
        <TopBar cats={categories} query={query} setQuery={setQuery} onGo={goTo} onActive={onActive} resultsLabel={searching ? resultsLabel(lang, resultCount) : null} searching={searching} />
        <main id="menu" className="menu">
          <span id="menu-start" />
          {!searching && <Shortcuts cats={categories} counts={counts} lang={lang} onGo={goTo} />}
          {searching && (
            <div className="wrap results">
              <h2>{t("results")}</h2>
              <p>{resultsLabel(lang, resultCount)}</p>
            </div>
          )}
          {searching && resultCount === 0 && (
            <div className="wrap empty">
              <EmptyIcon />
              <h3>{t("noResults")}</h3>
              <p>{t("noResultsHint")}</p>
            </div>
          )}
          {categories.map((c, i) => (
            <CategorySection key={c.id} cat={c} index={i} total={categories.length} items={itemsByCategory[c.id]} matches={matches} lang={lang} secLang={second} />
          ))}
        </main>
        <Footer />
      </div>
      <BackToTop />
      <Toast />
      <Curtain />
      {overlay === "intro" && <Intro onChoose={onChoose} onReveal={reveal} onDone={done} />}
      {overlay === "veil" && <Veil onReveal={reveal} onDone={done} />}
    </div>
  );
}

