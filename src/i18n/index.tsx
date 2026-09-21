import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Lang } from "../data/types";
import { LANGS, SEO, UI, type UIKey } from "../data/ui";
import { KEYS, store } from "../lib/storage";
import { motionOK } from "../lib/gsap";

/** Which language shows as the small “second name” under each item. */
const SECOND: Record<Lang, Lang> = { ar: "en", ku: "en", en: "ar" };

interface I18n {
  lang: Lang;
  dir: "rtl" | "ltr";
  htmlLang: string;
  /** Instant switch (used by the language screen, which has its own transition). */
  setLang: (l: Lang) => void;
  /** Switch with the curtain transition, no page reload. */
  switchLang: (l: Lang) => void;
  t: (key: UIKey) => string;
  secondary: boolean;
  setSecondary: (v: boolean) => void;
  secLang: Lang;
  registerCurtain: (fn: ((swap: () => void) => void) | null) => void;
}

const Ctx = createContext<I18n | null>(null);

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside <I18nProvider>");
  return v;
}

function applyDocument(lang: Lang) {
  const meta = LANGS[lang];
  const root = document.documentElement;
  root.lang = meta.htmlLang;
  root.dir = meta.dir;
  document.title = SEO[lang].title;
  const set = (sel: string, attr: string, val: string) => document.head.querySelector(sel)?.setAttribute(attr, val);
  set('meta[name="description"]', "content", SEO[lang].description);
  set('meta[property="og:title"]', "content", SEO[lang].title);
  set('meta[property="og:description"]', "content", SEO[lang].description);
  set('meta[property="og:locale"]', "content", meta.ogLocale);
}

export function I18nProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);
  const [secondary, setSecondaryState] = useState<boolean>(() => store.get(KEYS.secondary) !== "off");
  const curtain = useRef<((swap: () => void) => void) | null>(null);

  // Keep <html lang/dir>, title and meta in sync — must run before paint so RTL/LTR never flashes.
  useEffect(() => {
    applyDocument(lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    store.set(KEYS.lang, l);
  }, []);

  const switchLang = useCallback(
    (l: Lang) => {
      if (l === lang) return;
      if (curtain.current && motionOK()) curtain.current(() => setLang(l));
      else setLang(l);
    },
    [lang, setLang],
  );

  const setSecondary = useCallback((v: boolean) => {
    setSecondaryState(v);
    store.set(KEYS.secondary, v ? "on" : "off");
  }, []);

  const registerCurtain = useCallback((fn: ((swap: () => void) => void) | null) => {
    curtain.current = fn;
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      dir: LANGS[lang].dir,
      htmlLang: LANGS[lang].htmlLang,
      setLang,
      switchLang,
      t: (key) => UI[key][lang],
      secondary,
      setSecondary,
      secLang: SECOND[lang],
      registerCurtain,
    }),
    [lang, setLang, switchLang, secondary, setSecondary, registerCurtain],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function htmlLangOf(l: Lang): string {
  return LANGS[l].htmlLang;
}
