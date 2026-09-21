# Adding item photos

The menu currently has no photos (none were supplied). Everything is already designed to receive them — **no code changes needed**.

1. Take/collect one photo per item. Square or 4:3 works best; the card crops to a rounded square.
2. Resize to about **400 × 400 px** and save as **WebP** (or JPG/PNG/AVIF), roughly 20–40 KB each. Phones on mobile data will thank you.
3. Name each file exactly like the item's `id` in `src/data/menu.json`, e.g.

   ```
   src/assets/menu-items/cactus-drink.webp
   src/assets/menu-items/margherita-pizza.webp
   src/assets/menu-items/fresh-shisha.jpg
   ```
4. Run `npm run dev` (or `npm run build`). The photo appears on that item's card automatically, with a soft fade-in and lazy loading. Items without a photo keep the text-only design.

Prefer hosting photos elsewhere? Put a full URL in the item's `"image"` field in `menu.json` instead of adding a file.

To find an id quickly: open `src/data/menu.json` and search for the item's English name; the `id` sits right above it.
