#!/usr/bin/env node
// Runs after `vite build`. Turns dist/index.html into:
//   dist/index.html      – language screen (root URL)
//   dist/ar|ku|en/index.html – one page per language with its own <title>, description, Open Graph tags,
//                              hreflang links, Restaurant/Menu structured data and a full plain-HTML
//                              <noscript> copy of the menu (readable even if JavaScript never runs).
//   dist/sitemap.xml + robots.txt – only when a site URL is known (site.config.json → siteUrl, SITE_URL, or Vercel).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const json = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const menu = json("src/data/menu.json");
const seo = json("src/data/seo.json");
const cfg = json("src/data/site.config.json");

if (!existsSync(join(dist, "index.html"))) {
  console.error("postbuild: dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
const template = readFileSync(join(dist, "index.html"), "utf8");

const siteUrl = (process.env.SITE_URL || cfg.siteUrl || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") || "").replace(/\/$/, "");
const abs = (p) => (siteUrl ? `${siteUrl}${p}` : p);

const LANGS = {
  ar: { dir: "rtl", html: "ar", og: "ar_IQ", label: "العربية" },
  ku: { dir: "rtl", html: "ckb", og: "ckb_IQ", label: "کوردی" },
  en: { dir: "ltr", html: "en", og: "en_US", label: "English" },
};
const IQD = { ar: "د.ع", ku: "د.ع", en: "IQD" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const price = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function seoBlock(lang) {
  const meta = seo[lang];
  const L = LANGS[lang];
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(cfg.name.en)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${abs("/og-image.png")}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${L.og}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${abs("/og-image.png")}" />`,
  ];
  if (siteUrl) {
    lines.push(`<link rel="canonical" href="${siteUrl}/${lang}" />`, `<meta property="og:url" content="${siteUrl}/${lang}" />`);
    for (const k of Object.keys(LANGS)) lines.push(`<link rel="alternate" hreflang="${LANGS[k].html === "ckb" ? "ckb" : k}" href="${siteUrl}/${k}" />`);
    lines.push(`<link rel="alternate" hreflang="x-default" href="${siteUrl}/" />`);
  }
  return lines.join("\n    ");
}

function jsonLd(lang) {
  const items = (cat) => menu.items.filter((i) => i.category === cat);
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cfg.name[lang],
    slogan: cfg.tagline,
    image: abs("/og-image.png"),
    inLanguage: LANGS[lang].html,
    ...(siteUrl ? { url: `${siteUrl}/${lang}` } : {}),
    ...(cfg.phone ? { telephone: cfg.phone } : {}),
    ...(cfg.address?.[lang] ? { address: cfg.address[lang] } : {}),
    ...(cfg.instagram?.url ? { sameAs: [cfg.instagram.url] } : {}),
    servesCuisine: ["Coffee", "Middle Eastern", "Western"],
    hasMenu: {
      "@type": "Menu",
      name: `${cfg.name[lang]} — ${lang === "en" ? "Menu" : lang === "ar" ? "القائمة" : "لیست"}`,
      inLanguage: LANGS[lang].html,
      hasMenuSection: menu.categories.map((c) => ({
        "@type": "MenuSection",
        name: c.name[lang],
        ...(siteUrl ? { url: `${siteUrl}/${lang}/${c.id}` } : {}),
        hasMenuItem: items(c.id).map((i) => ({
          "@type": "MenuItem",
          name: i.name[lang],
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "IQD", availability: i.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
        })),
      })),
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

const NOJS_CSS =
  "body{margin:0}.nojs{font-family:system-ui,Segoe UI,Roboto,Tahoma,sans-serif;background:#f3f8f5;color:#0e3f2e;padding:24px 16px 48px;max-width:760px;margin:0 auto;line-height:1.5}" +
  ".nojs h1{color:#135f44;margin:.2em 0 .6em}.nojs h2{background:#135f44;color:#fff;padding:.5em .8em;border-radius:10px;font-size:1.05rem;margin:1.6em 0 .4em}" +
  ".nojs ul{list-style:none;margin:0;padding:0}.nojs li{display:flex;justify-content:space-between;gap:16px;padding:.55em .2em;border-bottom:1px solid #d7e6de}" +
  ".nojs li b{font-weight:600;white-space:nowrap}.nojs a{color:#008b62}.boot{display:none!important}";

function noscriptMenu(lang) {
  const L = LANGS[lang];
  const parts = [`<h1>${esc(cfg.name[lang])}</h1>`];
  for (const c of menu.categories) {
    parts.push(`<h2>${esc(c.name[lang])}</h2>`);
    if (c.note) parts.push(`<p>${esc(c.note[lang])}</p>`);
    parts.push("<ul>" + menu.items.filter((i) => i.category === c.id).map((i) => `<li><span>${esc(i.name[lang])}</span><b>${price(i.price)} ${IQD[lang]}</b></li>`).join("") + "</ul>");
  }
  if (cfg.instagram?.url) parts.push(`<p><a href="${esc(cfg.instagram.url)}">Instagram</a></p>`);
  return `<noscript><style>${NOJS_CSS}</style><main class="nojs" lang="${L.html}" dir="${L.dir}">${parts.join("")}</main></noscript>`;
}

function noscriptRoot() {
  const links = Object.entries(LANGS).map(([k, v]) => `<a href="/${k}" lang="${v.html}">${v.label}</a>`).join(" · ");
  return `<noscript><style>${NOJS_CSS}</style><main class="nojs"><h1>Cactus Café</h1><p>${links}</p></main></noscript>`;
}

function build(lang) {
  const L = lang ? LANGS[lang] : { html: "en", dir: "ltr" };
  let html = template
    .replace(/<html[^>]*>/, `<html lang="${L.html}" dir="${L.dir}">`)
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${seoBlock(lang || "en")}\n    ${jsonLd(lang || "en")}\n    <!--seo:end-->`)
    .replace("<!--noscript-->", lang ? noscriptMenu(lang) : noscriptRoot());
  return html;
}

writeFileSync(join(dist, "index.html"), build(null));
for (const lang of Object.keys(LANGS)) {
  mkdirSync(join(dist, lang), { recursive: true });
  writeFileSync(join(dist, lang, "index.html"), build(lang));
}
if (siteUrl) {
  const urls = ["/", ...Object.keys(LANGS).flatMap((l) => [`/${l}`, ...menu.categories.map((c) => `/${l}/${c.id}`)])];
  writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
  writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}
console.log(`postbuild ✓  pages: /, /ar, /ku, /en${siteUrl ? `  ·  site URL: ${siteUrl}` : "  ·  (no site URL set — canonical links & sitemap skipped)"}`);
