import type { MenuItem } from "../data/types";

/**
 * Item photos are discovered at build time: drop `<item-id>.webp` (or .jpg/.png/.avif)
 * into src/assets/menu-items/ and it shows up inside the same design automatically.
 * See docs/ADDING_ITEM_IMAGES.md.
 */
const found = import.meta.glob("../assets/menu-items/*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byId: Record<string, string> = {};
for (const [path, url] of Object.entries(found)) {
  const file = path.split("/").pop() ?? "";
  const id = file.replace(/\.[^.]+$/, "").toLowerCase();
  byId[id] = url;
}

export function itemImage(item: MenuItem): string | null {
  return item.image || byId[item.id] || null;
}
