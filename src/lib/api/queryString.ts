/**
 * Build a query string from an object of params.
 * Skips null, undefined, and empty-string values.
 * Numbers are coerced to strings.
 *
 * @example
 * buildQueryString({ a: 1, b: null, c: "x" }) // "?a=1&c=x"
 */
export function buildQueryString(params: object): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    qs.set(key, String(value));
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}
