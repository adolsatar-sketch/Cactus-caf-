/** One consistent thousands format everywhere: 5,000 (Latin digits in every language). */
export function formatPrice(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
