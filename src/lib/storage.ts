/** localStorage that never throws (private mode, blocked storage, SSR…). */
export const store = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

export const KEYS = {
  lang: "cactus.lang",
  secondary: "cactus.secondary",
} as const;
