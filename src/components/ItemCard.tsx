import { memo, useState } from "react";
import type { Lang, MenuItem } from "../data/types";
import { UI } from "../data/ui";
import { htmlLangOf } from "../i18n";
import { formatPrice } from "../lib/format";
import { itemImage } from "../lib/images";

interface Props {
  item: MenuItem;
  lang: Lang;
  secLang: Lang | null;
  hidden: boolean;
}

export const ItemCard = memo(function ItemCard({ item, lang, secLang, hidden }: Props) {
  const [loaded, setLoaded] = useState(false);
  const img = itemImage(item);
  const name = item.name[lang];
  const desc = item.description?.[lang];
  const cls = ["item", item.featured && "item--featured", !item.available && "item--off", img && "item--photo"].filter(Boolean).join(" ");
  return (
    <article className={cls} hidden={hidden} data-id={item.id}>
      {!item.available ? (
        <span className="item__badge">{UI.unavailable[lang]}</span>
      ) : item.featured ? (
        <span className="item__badge">{UI.signature[lang]}</span>
      ) : null}
      {img && (
        <div className="item__media">
          <img src={img} alt={name} width={84} height={84} loading="lazy" decoding="async" className={loaded ? "is-loaded" : ""} onLoad={() => setLoaded(true)} />
        </div>
      )}
      <div className="item__body">
        <h3 className="item__name">{name}</h3>
        {secLang && (
          <p className="item__alt" lang={htmlLangOf(secLang)}>
            {item.name[secLang]}
          </p>
        )}
        {desc && <p className="item__desc">{desc}</p>}
        {item.allergens.length > 0 && (
          <ul className="item__tags">
            {item.allergens.map((a) => (
              <li key={a}>{UI.allergen[a]?.[lang] ?? a}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="item__price">
        <b>{formatPrice(item.price)}</b>
        <small>{UI.price[lang]}</small>
      </div>
    </article>
  );
});
