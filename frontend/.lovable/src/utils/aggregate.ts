// Agrège les valeurs numériques de doublons groupés par une clé (ex: id_ess)
export function aggregateByKey<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T,
): T[] {
  const map = new Map<unknown, T>();
  rows.forEach((row) => {
    const k = row[key];
    const existing = map.get(k);
    if (!existing) {
      map.set(k, { ...row });
    } else {
      const merged: Record<string, unknown> = { ...existing };
      Object.keys(row).forEach((field) => {
        const a = (existing as Record<string, unknown>)[field];
        const b = (row as Record<string, unknown>)[field];
        if (typeof a === "number" && typeof b === "number") {
          merged[field] = a + b;
        } else {
          merged[field] = b ?? a;
        }
      });
      map.set(k, merged as T);
    }
  });
  return Array.from(map.values());
}

export function filterByDateRange<T extends Record<string, unknown>>(
  rows: T[],
  field: keyof T,
  from?: string | null,
  to?: string | null,
): T[] {
  if (!from && !to) return rows;
  return rows.filter((r) => {
    const v = r[field];
    if (!v) return false;
    const d = new Date(String(v)).getTime();
    if (Number.isNaN(d)) return false;
    if (from && d < new Date(from).getTime()) return false;
    if (to && d > new Date(to).getTime()) return false;
    return true;
  });
}