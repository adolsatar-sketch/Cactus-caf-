import { useEffect, useRef, useState } from "react";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import type { MenuItem } from "../data/types";
import { UI } from "../data/ui";
import { useCart } from "../cart";
import { useI18n } from "../i18n";
import { useMagnetic } from "../hooks/useMagnetic";
import { formatPrice } from "../lib/format";
import { itemsById } from "../lib/menu";

/** Floating button + bottom-sheet: the customer's own pick-list, not a submitted order. */
export function Cart() {
  const { lang } = useI18n();
  const { lines, count, inc, dec, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const fab = useRef<HTMLButtonElement>(null);
  useMagnetic(fab, 0.3);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const entries = Object.entries(lines)
    .map(([id, n]) => ({ item: itemsById[id], n }))
    .filter((e): e is { item: MenuItem; n: number } => !!e.item);
  const total = entries.reduce((sum, e) => sum + e.item.price * e.n, 0);

  return (
    <>
      <button ref={fab} type="button" className="cart-fab" aria-label={UI.cartLabel[lang]} onClick={() => setOpen(true)}>
        <BagIcon />
        {count > 0 && <span className="cart-fab__badge">{count}</span>}
      </button>
      {open && (
        <div className="cart-sheet" role="dialog" aria-modal="true" aria-label={UI.cart[lang]}>
          <button type="button" className="cart-sheet__backdrop" aria-label={UI.closeCart[lang]} onClick={() => setOpen(false)} />
          <div className="cart-sheet__panel">
            <header className="cart-sheet__head">
              <h2>{UI.cart[lang]}</h2>
              <button type="button" className="cart-sheet__close" aria-label={UI.closeCart[lang]} onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </header>
            {entries.length === 0 ? (
              <p className="cart-sheet__empty">{UI.cartEmpty[lang]}</p>
            ) : (
              <>
                <p className="cart-sheet__hint">{UI.cartHint[lang]}</p>
                <ul className="cart-sheet__list">
                  {entries.map(({ item, n }) => (
                    <li key={item.id}>
                      <span className="cart-sheet__name">{item.name[lang]}</span>
                      <div className="cart-sheet__step">
                        <button type="button" aria-label={`${UI.decreaseQty[lang]}: ${item.name[lang]}`} onClick={() => dec(item.id)}>
                          <MinusIcon />
                        </button>
                        <b>{n}</b>
                        <button type="button" aria-label={`${UI.increaseQty[lang]}: ${item.name[lang]}`} onClick={() => inc(item.id)}>
                          <PlusIcon />
                        </button>
                      </div>
                      <span className="cart-sheet__price">
                        {formatPrice(item.price * n)} {UI.price[lang]}
                      </span>
                      <button type="button" className="cart-sheet__remove" aria-label={`${UI.removeFromCart[lang]}: ${item.name[lang]}`} onClick={() => remove(item.id)}>
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
                <footer className="cart-sheet__foot">
                  <button type="button" className="cart-sheet__clear" onClick={clear}>
                    {UI.clearCart[lang]}
                  </button>
                  <div className="cart-sheet__total">
                    <span>{UI.cartTotal[lang]}</span>
                    <b>
                      {formatPrice(total)} {UI.price[lang]}
                    </b>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
