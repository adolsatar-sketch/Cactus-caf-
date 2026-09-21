type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Low-power heuristic: few cores, little memory, or data-saver on. Ambient effects are switched off there. */
export function isLiteDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as NavigatorExtras;
  const slowNet = n.connection?.saveData === true || /(^|-)2g$/.test(n.connection?.effectiveType ?? "");
  const lowMem = typeof n.deviceMemory === "number" && n.deviceMemory <= 2;
  const lowCpu = typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2;
  return slowNet || lowMem || lowCpu;
}

/** Writes data-motion / data-perf on <html> so CSS can react. Returns a cleanup function. */
export function initPerfFlags(): () => void {
  const root = document.documentElement;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () => {
    root.dataset.motion = mq.matches ? "reduced" : "full";
  };
  apply();
  root.dataset.perf = isLiteDevice() ? "lite" : "full";
  mq.addEventListener?.("change", apply);
  return () => mq.removeEventListener?.("change", apply);
}
