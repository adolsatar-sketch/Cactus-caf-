# Content audit — original menu PDF vs. the website

The website's content was transcribed from the 5-page menu PDF and then checked **programmatically**:

```bash
npm run audit          # prints the comparison table
```

The same check runs automatically before every `npm run build` (`prebuild`) and **stops the build** if a category count, item, price or translation drifts from the PDF transcription (`src/data/menu.source.json`, used only by the audit script).

## Result

| Category | Arabic | Rows in PDF | Items on site | Match |
|---|---|---:|---:|:--:|
| Hot Drinks | مشروبات ساخنة | 10 | 10 | ✅ |
| Hot Coffee | قهوة ساخنة | 14 | 14 | ✅ |
| Milkshakes | ميلك شيك | 5 | 5 | ✅ |
| Fresh Juices | عصائر طازجة | 11 | 11 | ✅ |
| Mojitos | موهيتو | 5 | 5 | ✅ |
| Breakfast | الفطور | 7 | 7 | ✅ |
| Pizza | بيتزا | 8 | 8 | ✅ |
| Salads | سلطات | 7 | 7 | ✅ |
| Soups | شوربات | 3 | 3 | ✅ |
| Eastern Cuisine | المطبخ الشرقي | 6 | 6 | ✅ |
| Western Cuisine | المطبخ الغربي | 23 | 23 | ✅ |
| Pastries & Cakes | الحلويات والكيك | 9 | 9 | ✅ |
| Soft Drinks & Water | المشروبات الغازية والماء | 6 | 6 | ✅ |
| Shisha | أرجيلة | 12 | 12 | ✅ |
| **Total** | | **126** | **126** | ✅ |

Every item has an Arabic, Sorani Kurdish and English name; every price is a whole number in IQD; no duplicate ids.

The brand guideline PDF also contains a *sample* menu (pages 16–17). It was used as a **visual reference only** and never as a content source.

## Items the café should confirm (15)

These are flagged with a `review` field in `src/data/menu.json`. The field is internal — it is **not shown to guests**. Once confirmed, edit the item and delete its `review` line.

### 1. Shisha prices — please confirm (11 items)

The PDF's Shisha page lists **12 flavours but only 10 prices**: nine × 8,000 and one 10,000. The prices cannot be matched to flavours with certainty, so the site currently uses:

- **Fresh Shisha — 10,000 IQD** (the only price that differs; it is the only item printed with it)
- **all 11 other flavours — 8,000 IQD** (assumed)

Please check the printed menu / the café's real prices for: Bounty, Cactus, Double Apple, English, Gum & Mint, Lemon & Mint, Havana, Qazwan, Blueberry, Sindi, Gum & Watermelon. To change a price, edit the `price` number of that item in `src/data/menu.json`.

### 2. Names that were unclear in the PDF (4 items)

Nothing was guessed; each is kept as written and flagged.

| Item id | Shown as (EN / AR) | Question |
|---|---|---|
| `tede-coffee` | Tede Coffee / قهوة تيدي | Is the spelling "Tede" correct (Tedy / Teddy)? |
| `sunny-side-up-eggs` | Sunny-Side-Up Eggs / بيض عين | The source English reads "EGGS CHAW"; the site follows the clear Arabic name. |
| `eggs-kas` | Eggs & Kas / بيض وكص | "كص / KAS" is unclear; transliterated as written. |
| `kofta-ba-gosht` | Kofta Ba Gosht / كبة سراي | The source English and Arabic names describe different dishes; both kept as printed. |

### 3. Kurdish (Sorani) wording

Kurdish names were written for this project (the PDF is Arabic + English only). Dish names that are loanwords are transliterated (e.g. ڕیزۆ, بەرگەر). Please have a Sorani speaker skim `ku` fields once — they are plain text in `menu.json`.

## Other content decisions

- **Mojito energy-drink offer** ("Add an energy drink for only 1,000 IQD") appears in the PDF as a line under Mojito, not as an item. It is shown as a note above the mojito list, not counted as an item.
- **Instagram link** `https://shortlab.link/r/J7Ll` was decoded from the QR code on the last PDF page. Replace it in `src/data/site.config.json` with the direct profile link if preferred.
- **Not invented:** phone, address, opening hours, map link, WhatsApp, e-mail and photos are empty in `site.config.json` and are simply hidden until filled in.
