import type { Lang, LocalizedText } from "./types";
import seoData from "./seo.json";

export interface LangMeta {
  code: Lang;
  /** Native label shown on the language buttons. */
  label: string;
  dir: "rtl" | "ltr";
  htmlLang: string;
  ogLocale: string;
}

export const LANGS: Record<Lang, LangMeta> = {
  ar: { code: "ar", label: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_IQ" },
  ku: { code: "ku", label: "کوردی", dir: "rtl", htmlLang: "ckb", ogLocale: "ckb_IQ" },
  en: { code: "en", label: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
};

export const LANG_ORDER: Lang[] = ["ar", "ku", "en"];

export function isLang(v: unknown): v is Lang {
  return v === "ar" || v === "ku" || v === "en";
}

/**
 * All interface strings. To edit a sentence, change it here — every language
 * lives side by side so nothing gets out of sync.
 */
export const UI = {
  welcomeTitle: {
    ar: "أهلاً بكم",
    ku: "بەخێربێن",
    en: "Welcome",
  },
  welcomeSub: {
    ar: "اختر ما يناسب يومك من قائمتنا.",
    ku: "لە لیستەکەمان ئەوەی بۆ ڕۆژەکەت گونجاوە هەڵیبژێرە.",
    en: "Pick whatever suits your day from our menu.",
  },
  searchPlaceholder: {
    ar: "ابحث عن صنف…",
    ku: "بەدوای خواردنێکدا بگەڕێ…",
    en: "Search the menu…",
  },
  searchLabel: { ar: "بحث في القائمة", ku: "گەڕان لە لیست", en: "Search the menu" },
  searchClear: { ar: "مسح البحث", ku: "سڕینەوەی گەڕان", en: "Clear search" },
  searchOpen: { ar: "فتح البحث", ku: "کردنەوەی گەڕان", en: "Open search" },
  searchClose: { ar: "إغلاق البحث", ku: "داخستنی گەڕان", en: "Close search" },
  noResults: {
    ar: "لا توجد نتائج مطابقة",
    ku: "هیچ ئەنجامێک نەدۆزرایەوە",
    en: "No matching items",
  },
  noResultsHint: {
    ar: "جرّب كلمة أخرى أو اختر قسماً من الأعلى.",
    ku: "وشەیەکی تر تاقی بکەرەوە یان بەشێک هەڵبژێرە.",
    en: "Try another word or pick a category above.",
  },
  categories: { ar: "الأقسام", ku: "بەشەکان", en: "Categories" },
  categoriesNav: { ar: "أقسام القائمة", ku: "بەشەکانی لیست", en: "Menu categories" },
  language: { ar: "اللغة", ku: "زمان", en: "Language" },
  chooseLanguage: { ar: "اختر اللغة", ku: "زمان هەڵبژێرە", en: "Choose your language" },
  skip: { ar: "تخطّي", ku: "تێپەڕاندن", en: "Skip" },
  backToTop: { ar: "العودة إلى الأعلى", ku: "گەڕانەوە بۆ سەرەوە", en: "Back to top" },
  unavailable: { ar: "غير متوفر", ku: "بەردەست نییە", en: "Unavailable" },
  signature: { ar: "مميز", ku: "تایبەت", en: "Signature" },
  shareSection: { ar: "نسخ رابط القسم", ku: "لەبەرگرتنەوەی بەستەری بەش", en: "Copy link to this section" },
  linkCopied: { ar: "تم نسخ الرابط", ku: "بەستەر لەبەرگیرایەوە", en: "Link copied" },
  secondaryLang: { ar: "عرض الاسم بلغة ثانية", ku: "پیشاندانی ناو بە زمانی دووەم", en: "Show names in a second language" },
  thanks: {
    ar: "شكراً لزيارتكم! تابعونا على إنستغرام",
    ku: "سوپاس بۆ سەردانتان! لە ئینستاگرام شوێنمان بکەون",
    en: "Thank you for visiting! Follow us on Instagram",
  },
  instagram: { ar: "إنستغرام", ku: "ئینستاگرام", en: "Instagram" },
  price: { ar: "د.ع", ku: "د.ع", en: "IQD" },
  priceLabel: { ar: "دينار عراقي", ku: "دیناری عێراقی", en: "Iraqi dinars" },
  callUs: { ar: "اتصل بنا", ku: "پەیوەندیمان پێوە بکە", en: "Call us" },
  address: { ar: "العنوان", ku: "ناونیشان", en: "Address" },
  hours: { ar: "ساعات العمل", ku: "کاتی کارکردن", en: "Opening hours" },
  showOnMap: { ar: "عرض على الخريطة", ku: "پیشاندان لەسەر نەخشە", en: "Show on map" },
  loadError: {
    ar: "تعذّر تحميل بعض العناصر. القائمة ما زالت متاحة أدناه.",
    ku: "هەندێک توخم بار نەبوون. لیستەکە هێشتا لە خوارەوە بەردەستە.",
    en: "Some visual effects failed to load. The menu is still available below.",
  },
  menuTitle: { ar: "قائمة الطعام والمشروبات", ku: "لیستی خواردن و خواردنەوە", en: "Food & drinks menu" },
  skipToContent: { ar: "تخطّي إلى القائمة", ku: "بازدان بۆ لیستەکە", en: "Skip to the menu" },
  results: { ar: "نتائج البحث", ku: "ئەنجامەکانی گەڕان", en: "Search results" },
  exploreMenu: { ar: "تصفّح القائمة", ku: "لیستەکە بگەڕێ", en: "Explore the menu" },
  scrollPrev: { ar: "الأقسام السابقة", ku: "بەشەکانی پێشوو", en: "Previous categories" },
  scrollNext: { ar: "الأقسام التالية", ku: "بەشەکانی دواتر", en: "Next categories" },
  home: { ar: "الصفحة الرئيسية", ku: "پەڕەی سەرەکی", en: "Home" },
  /** Names of the allergen tags (shown only when an item lists any). */
  allergen: {
    gluten: { ar: "غلوتين", ku: "گلووتین", en: "Gluten" },
    dairy: { ar: "ألبان", ku: "بەرهەمی شیر", en: "Dairy" },
    nuts: { ar: "مكسرات", ku: "گوێز و فستق", en: "Nuts" },
    eggs: { ar: "بيض", ku: "هێلکە", en: "Eggs" },
    fish: { ar: "أسماك", ku: "ماسی", en: "Fish" },
    sesame: { ar: "سمسم", ku: "کونجی", en: "Sesame" },
    soy: { ar: "صويا", ku: "سۆیا", en: "Soy" },
  } as Record<string, LocalizedText>,
} satisfies Record<string, LocalizedText | Record<string, LocalizedText>>;

export type UIKey = Exclude<keyof typeof UI, "allergen">;

export function itemCountLabel(lang: Lang, n: number): string {
  if (lang === "ar") {
    if (n === 1) return "صنف واحد";
    if (n === 2) return "صنفان";
    return n <= 10 ? `${n} أصناف` : `${n} صنفاً`;
  }
  if (lang === "ku") return `${n} جۆر`;
  return n === 1 ? "1 item" : `${n} items`;
}

export function resultsLabel(lang: Lang, n: number): string {
  if (lang === "ar") return n === 1 ? "نتيجة واحدة" : n === 2 ? "نتيجتان" : n <= 10 ? `${n} نتائج` : `${n} نتيجة`;
  if (lang === "ku") return `${n} ئەنجام`;
  return n === 1 ? "1 result" : `${n} results`;
}

/** Site title + description per language — lives in seo.json so scripts/postbuild.mjs can read it too. */
export const SEO = seoData as Record<Lang, { title: string; description: string }>;
