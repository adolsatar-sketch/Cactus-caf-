# Cactus Café — digital menu

A fast, animated, **trilingual (Arabic · Sorani Kurdish · English)** menu website for Cactus Café.
React 19 + Vite + TypeScript + GSAP. No backend, no database, no tracking — it builds to plain static files you can host anywhere.

- 126 items in 14 categories, prices in IQD, checked against the original PDF (`npm run audit`)
- Language screen on first visit → circular reveal into the menu; returning visitors go straight in
- Instant search across all three languages, sticky category bar, share-link per category
- 14 different animated header motifs (one per category), all in the brand's green/white palette
- Works with JavaScript disabled (full plain-HTML menu), respects "reduce motion", and switches off decorative effects on low-power phones

## Quick start

Requires **Node 18.18+** (Node 20/22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173 with live reload
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Content audit → type-check → production build → per-language pages (`dist/`) |
| `npm run preview` | Serve the built `dist/` locally (use this to test the real build) |
| `npm run audit` | Compare menu data with the PDF transcription (also runs before every build) |
| `npm run typecheck` | TypeScript check only |

## Editing the menu

Everything customers see lives in **`src/data/menu.json`** — no code changes needed.

```jsonc
{
  "id": "margherita-pizza",          // stable id (also the photo file name)
  "category": "pizza",
  "name": { "ar": "…", "ku": "…", "en": "Margherita Pizza" },
  "price": 6500,                     // whole IQD
  "description": null,               // or { "ar": "…", "ku": "…", "en": "…" } — only if you have real info
  "image": null,                     // normally leave null, see docs/ADDING_ITEM_IMAGES.md
  "featured": false,                 // true → dark "Signature" card
  "available": true,                 // false → greyed out with an "Unavailable" tag
  "allergens": []                    // any of: gluten dairy nuts eggs fish sesame soy
}
```

- **Add an item:** copy an existing block, give it a new unique `id`, put it where you want it in the list.
- **Reorder categories:** change `order` on the category.
- **Hide something temporarily:** set `"available": false`.
- After editing, run `npm run audit` — it tells you if a translation or price is missing.
- Currently `featured` marks the "Cactus …" signature items (Cactus Drink, Cactus Milkshake, Cactus Rizo, …). Change freely.

Interface texts (button labels, messages) are in `src/data/ui.ts`; page titles/descriptions per language are in `src/data/seo.json`.

**Please read `docs/CONTENT_AUDIT.md` before going live** — 15 items are flagged for confirmation, most importantly the **shisha prices** (the PDF has 12 flavours but only 10 prices).

## Café details (phone, address, hours…)

Edit **`src/data/site.config.json`**. Anything left empty is simply not shown.

| Field | Effect |
|---|---|
| `instagram.url` / `handle` | Footer button (URL was decoded from the QR in the PDF; `handle` is optional text such as `@cactus.cafe`) |
| `phone`, `whatsapp`, `email` | Contact lines in the footer |
| `address`, `openingHours` | Per-language text in the footer |
| `mapUrl` | "Show on map" link |
| `siteUrl` | Your final domain (e.g. `https://menu.cactuscafe.iq`) — enables canonical links, hreflang and `sitemap.xml`. On Vercel this is detected automatically. |

## URLs (good for QR codes)

| URL | Result |
|---|---|
| `/` | Language screen (or straight into the saved language) |
| `/ar` · `/ku` · `/en` | Menu directly in that language — ideal for separate QR codes |
| `/en/pizza`, `/ar/shisha`, … | Opens scrolled to that category; the address bar follows as you scroll, so any moment is shareable |

## Fonts

| Use | Font | Notes |
|---|---|---|
| Arabic | Almarai | self-hosted |
| Kurdish (Sorani) | Noto Sans Arabic | covers ڕ ڵ ۆ ێ ە ک گ, which Almarai lacks |
| English body | Roboto | self-hosted |
| English headlines | **Lobster** (stand-in) | The brand's *Bluestar* is a paid font and can't be bundled |

**To use the real Bluestar:** put your licensed font file(s) (`.woff2` preferred, `.woff/.ttf/.otf` also fine) into `src/assets/fonts/bluestar/` and rebuild. They register automatically as the headline font; no code edits.

All fonts are self-hosted subsets — no requests to Google Fonts, so it also works behind restrictive networks.

## Photos

None were supplied. Drop `<item-id>.webp` files into `src/assets/menu-items/` and they appear automatically — see **`docs/ADDING_ITEM_IMAGES.md`**.

## Deploying

The build output is the `dist/` folder — plain static files.

### Vercel (recommended)
1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New → Project** → import the repo. Framework: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
3. Deploy. `vercel.json` already contains the `/ar`, `/ku`, `/en` rewrites and cache headers.
4. Optional: add your custom domain, then put it in `siteUrl` (or set the `SITE_URL` environment variable).

### Netlify
Build command `npm run build`, publish directory `dist`. `public/_redirects` is included.

### Any other static host (Cloudflare Pages, GitHub Pages, nginx, cPanel…)
Upload the contents of `dist/`. For deep links such as `/en/pizza` the host should fall back to `/en/index.html` (or `/index.html`) for unknown paths — most hosts have a "single-page app" toggle for this. Without it the site still works from `/`, `/ar`, `/ku`, `/en`.

### Putting it on GitHub
```bash
git init
git add .
git commit -m "Cactus Café digital menu"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
`node_modules/` and `dist/` are git-ignored.

## How it behaves (design notes)

- **Motion:** GSAP + ScrollTrigger for the intro, hero and per-category entrances; CSS-only animations for the header motifs (paused until visible). Everything is *visible by default* — if an animation ever failed the menu would still be fully readable.
- **Reduced motion:** with the OS setting "reduce motion", all intro/entrance animation is skipped.
- **Low-power devices:** phones reporting ≤ 2 CPU cores, ≤ 2 GB memory or data-saver mode get the same menu without the ambient/motif animation layers.
- **Language switch:** no reload — a green curtain wipes across while text and direction (RTL/LTR) swap underneath.
- **Search:** ignores Arabic diacritics, hamza/ya/kaf variants and Persian/Kurdish letter forms, and searches all three languages at once.
- **Offline:** a tiny service worker caches visited pages and assets (pages are always fetched fresh first, so price changes show immediately).
- **Accessibility:** automated axe-core audit passes with 0 violations on the intro, Arabic and English pages; keyboard navigable; screen-reader labels in all three languages.

## Testing status — please read

This project was built and tested in an environment that only has **Chromium (via Playwright)**. Verified there: layouts at 390 px (phone), 820 px (tablet) and 1366 px (desktop) in both RTL and LTR with no horizontal overflow; intro → language → menu flow; search; deep links; language switching; reduced-motion and low-power modes; no-JavaScript mode; no console errors; axe accessibility audit.

**Not tested — no such engines were available:** real **Safari / iOS**, **Firefox**, real **Android** devices, real-world mobile networks. Before printing QR codes, please open the deployed site on at least one iPhone and one Android phone and check: the language screen, RTL Arabic/Kurdish text, the sticky bar while scrolling, and the animation smoothness. Emulated devices cannot measure real frame rates, so the animation-heavy parts (intro reveal, header motifs) deserve a look on a modest Android phone.

## Project layout

```
src/
  App.tsx, main.tsx          app shell, startup
  components/                Intro, Hero, TopBar, Shortcuts, CategorySection, ItemCard, Fx, Footer …
  data/                      menu.json, site.config.json, ui.ts (texts), seo.json
  lib/                       search, routing, GSAP setup, entrance animations, perf flags
  styles/                    base, intro, hero, menu, fx (category motifs)
  assets/brand/              real brand vectors extracted from the brand guideline PDF
  assets/menu-items/         drop item photos here
  assets/fonts/bluestar/     drop the licensed Bluestar font here
scripts/                     audit.mjs, postbuild.mjs
docs/                        CONTENT_AUDIT.md, ADDING_ITEM_IMAGES.md
```
