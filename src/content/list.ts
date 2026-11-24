/** Accepts "a, b, c" (as saved by the admin) or ["a", "b", "c"] and returns a clean list. */
export function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
  return [];
}
