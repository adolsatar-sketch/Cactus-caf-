export type Lang = "ar" | "ku" | "en";

export interface LocalizedText {
  ar: string;
  ku: string;
  en: string;
}

export type FxVariant =
  | "steam"
  | "swirl"
  | "creamy"
  | "fresh"
  | "bubbles"
  | "morning"
  | "pizza"
  | "leaf"
  | "ripple"
  | "ornament"
  | "clean"
  | "layers"
  | "fizz"
  | "smoke";

export type GlyphKey = "cactus" | "c" | "cup" | "bean";

export interface Category {
  id: string;
  order: number;
  name: LocalizedText;
  fx: FxVariant;
  glyph: GlyphKey;
  /** Optional line shown under the category header. */
  note?: LocalizedText;
}

export type AllergenKey = "gluten" | "dairy" | "nuts" | "eggs" | "fish" | "sesame" | "soy";

export interface MenuItem {
  /** Stable id shared by all three languages — images, price and availability hang off it. */
  id: string;
  category: string;
  name: LocalizedText;
  /** Price in IQD (integer). */
  price: number;
  /** Optional short description (only when the café supplies real information). */
  description: LocalizedText | null;
  /**
   * Optional image override. Normally leave it null and just drop `<id>.webp`
   * into src/assets/menu-items/ — it is picked up automatically.
   */
  image: string | null;
  featured: boolean;
  available: boolean;
  allergens: AllergenKey[];
  /** Editorial note for the café team; never shown to customers. */
  review?: string;
}

export interface MenuData {
  currency: "IQD";
  categories: Category[];
  items: MenuItem[];
}

export interface SiteConfig {
  name: LocalizedText;
  tagline: string;
  instagram: { url: string; handle: string };
  phone: string;
  whatsapp: string;
  email: string;
  address: LocalizedText;
  mapUrl: string;
  openingHours: LocalizedText;
  siteUrl: string;
}
