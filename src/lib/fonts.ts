/**
 * Optional drop-in for the official Bluestar Medium Italic headline font.
 * Put the font file(s) in src/assets/fonts/bluestar/ (woff2 / woff / ttf / otf) and they are
 * registered automatically under the family name "Bluestar". Until then Lobster is used as the
 * stand-in (it is metrically and visually very close). See README → Fonts.
 */
const files = import.meta.glob("../assets/fonts/bluestar/*.{woff2,woff,ttf,otf}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function registerBluestar(): void {
  const entries = Object.entries(files);
  if (!entries.length) return;
  const fmt = (p: string) =>
    p.endsWith(".woff2") ? "woff2" : p.endsWith(".woff") ? "woff" : p.endsWith(".otf") ? "opentype" : "truetype";
  const src = entries.map(([p, url]) => `url("${url}") format("${fmt(p)}")`).join(", ");
  const style = document.createElement("style");
  style.textContent = `@font-face{font-family:"Bluestar";font-style:italic;font-weight:400 700;font-display:swap;src:${src};}`;
  document.head.appendChild(style);
}
