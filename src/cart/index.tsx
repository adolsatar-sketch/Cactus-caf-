import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { KEYS, store } from "../lib/storage";

/** itemId → quantity. The customer's own pick-list, not a submitted order. */
export type CartLines = Record<string, number>;

interface CartCtx {
  lines: CartLines;
  /** Total number of items across all lines, for the floating button's badge. */
  count: number;
  qty: (id: string) => number;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

function loadCart(): CartLines {
  const raw = store.get(KEYS.cart);
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: CartLines = {};
    for (const [id, n] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof n === "number" && n > 0) out[id] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLines>(loadCart);

  useEffect(() => {
    store.set(KEYS.cart, JSON.stringify(lines));
  }, [lines]);

  const inc = useCallback((id: string) => {
    setLines((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const dec = useCallback((id: string) => {
    setLines((prev) => {
      const next = (prev[id] ?? 0) - 1;
      if (next <= 0) {
        const { [id]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => {
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
  }, []);

  const clear = useCallback(() => setLines({}), []);
  const qty = useCallback((id: string) => lines[id] ?? 0, [lines]);
  const count = useMemo(() => Object.values(lines).reduce((a, b) => a + b, 0), [lines]);

  const value = useMemo<CartCtx>(
    () => ({ lines, count, qty, inc, dec, remove, clear }),
    [lines, count, qty, inc, dec, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside <CartProvider>");
  return v;
}
