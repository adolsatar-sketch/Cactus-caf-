import type { MenuItem } from "../data/types";

const AR_MARKS = /[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g;

const FOLD: Record<string, string> = {
  أ: "ا", إ: "ا", آ: "ا", ٱ: "ا",
  ى: "ي", ی: "ي", ې: "ي", ێ: "ي", ئ: "ي",
  ة: "ه", ە: "ه", ھ: "ه",
  ؤ: "و", ۆ: "و", ۊ: "و",
  ک: "ك", گ: "ك",
  ڕ: "ر", ڵ: "ل", ڤ: "ف", پ: "ب", چ: "ج", ژ: "ز",
};

/**
 * Loose matching so people can type however they like:
 * strips Arabic marks and Latin accents, unifies Arabic / Persian / Kurdish letter variants,
 * and maps Arabic-Indic digits to Latin ones.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(AR_MARKS, "")
    .replace(/[أإآٱىیېێئةەھؤۆۊکگڕڵڤپچژ]/g, (c) => FOLD[c] ?? c)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[&+\-_/·.,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SearchIndexEntry {
  item: MenuItem;
  haystack: string;
}

export function buildIndex(items: MenuItem[], categoryNames: Record<string, string>): SearchIndexEntry[] {
  return items.map((item) => ({
    item,
    haystack: normalize(
      [item.name.ar, item.name.ku, item.name.en, item.id.replace(/-/g, " "), categoryNames[item.category] ?? ""].join(" "),
    ),
  }));
}

export function searchItems(index: SearchIndexEntry[], query: string): Set<string> | null {
  const q = normalize(query);
  if (!q) return null;
  const tokens = q.split(" ");
  const out = new Set<string>();
  for (const entry of index) {
    if (tokens.every((t) => entry.haystack.includes(t))) out.add(entry.item.id);
  }
  return out;
}
