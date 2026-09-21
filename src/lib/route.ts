import type { Lang } from "../data/types";
import { isLang } from "../data/ui";

export interface Route {
  lang: Lang | null;
  category: string | null;
}

/**
 * QR-friendly URLs:
 *   /            → intro screen (choose a language)
 *   /ar /ku /en  → menu in that language
 *   /ar/pizza    → menu scrolled to the “pizza” section
 */
export function parseRoute(pathname: string, categoryIds: readonly string[], hash = ""): Route {
  const parts = pathname.split("/").filter(Boolean).map((p) => decodeURIComponent(p).toLowerCase());
  const lang = isLang(parts[0]) ? parts[0] : null;
  let category: string | null = null;
  const candidate = parts[1] ?? hash.replace(/^#/, "").toLowerCase();
  if (candidate && categoryIds.includes(candidate)) category = candidate;
  return { lang, category };
}

export function buildPath(lang: Lang, category?: string | null): string {
  return category ? `/${lang}/${category}` : `/${lang}`;
}
