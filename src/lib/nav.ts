import { prefersReducedMotion } from "./perf";

export function scrollToCategory(id: string, instant = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: instant || prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

export function toast(message: string): void {
  window.dispatchEvent(new CustomEvent("cactus:toast", { detail: message }));
}
