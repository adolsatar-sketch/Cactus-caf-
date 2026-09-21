#!/usr/bin/env node
// Content audit: compares the live menu data (src/data/menu.json) with the transcription of the
// original PDF (src/data/menu.source.json). Nothing here is imported by the website.
//   npm run audit            → prints the comparison table
//   node scripts/audit.mjs --check   → same, but exits with an error if anything is off (runs before every build)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const menu = read("src/data/menu.json");
const src = read("src/data/menu.source.json");
const check = process.argv.includes("--check");

const errors = [];
const warn = [];
const FX = new Set(["steam", "swirl", "creamy", "fresh", "bubbles", "morning", "pizza", "leaf", "ripple", "ornament", "clean", "layers", "fizz", "smoke"]);
const catIds = new Set(menu.categories.map((c) => c.id));

// 1. per-category counts
const rows = [];
let totalSrc = 0, totalSite = 0;
for (const c of menu.categories) {
  const site = menu.items.filter((i) => i.category === c.id).length;
  const original = src.sourceCounts[c.id];
  totalSrc += original ?? 0; totalSite += site;
  if (original !== site) errors.push(`Count mismatch in "${c.id}": PDF ${original}, site ${site}`);
  if (!FX.has(c.fx)) errors.push(`Unknown fx "${c.fx}" in category ${c.id}`);
  rows.push([c.id, src.sourceSectionNames[c.id] ?? "?", original, site, original === site ? "OK" : "MISMATCH"]);
}

// 2. every source line has a site item with the same price (except where a REVIEW price was assumed)
const byId = new Map(menu.items.map((i) => [i.id, i]));
for (const s of src.items) {
  const it = byId.get(s.id);
  if (!it) { errors.push(`Item "${s.id}" from the PDF is missing on the site`); continue; }
  if (it.category !== s.category) errors.push(`Item "${s.id}" moved category (${s.category} → ${it.category})`);
  if (it.price !== s.price) errors.push(`Price changed for "${s.id}": PDF ${s.price}, site ${it.price}`);
}
if (src.items.length !== menu.items.length) errors.push(`Item total differs: PDF ${src.items.length}, site ${menu.items.length}`);

// 3. structural checks
const seen = new Set();
for (const i of menu.items) {
  if (seen.has(i.id)) errors.push(`Duplicate id "${i.id}"`);
  seen.add(i.id);
  if (!catIds.has(i.category)) errors.push(`"${i.id}" points to unknown category "${i.category}"`);
  if (!Number.isInteger(i.price) || i.price <= 0) errors.push(`"${i.id}" has an invalid price`);
  for (const l of ["ar", "ku", "en"]) if (!i.name?.[l]?.trim()) errors.push(`"${i.id}" has no ${l} name`);
  if (/[a-z]/i.test(i.name.ar) && !/Cactus/i.test(i.name.ar)) warn.push(`"${i.id}" Arabic name contains Latin letters: ${i.name.ar}`);
  if (i.review) warn.push(`REVIEW ${i.id}: ${i.review}`);
}

const pad = (v, n) => String(v).padEnd(n);
console.log("\nContent audit — original PDF vs. website\n");
console.log(pad("category", 20), pad("PDF section", 20), pad("PDF", 5), pad("site", 5), "status");
for (const r of rows) console.log(pad(r[0], 20), pad(r[1], 20), pad(r[2], 5), pad(r[3], 5), r[4]);
console.log(pad("TOTAL", 20), pad("", 20), pad(totalSrc, 5), pad(totalSite, 5), totalSrc === totalSite ? "OK" : "MISMATCH");
console.log(`\nItems flagged for the café to review: ${menu.items.filter((i) => i.review).length}`);
if (!check && warn.length) console.log("\nNotes:\n" + warn.map((w) => "  - " + w).join("\n"));
if (errors.length) {
  console.error("\nAudit FAILED:\n" + errors.map((e) => "  ✗ " + e).join("\n"));
  process.exit(check ? 1 : 0);
}
console.log("\nAudit passed ✓\n");
