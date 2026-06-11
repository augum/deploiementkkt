/**
 * Global helpers to normalize API rows coming from the backend.
 *
 * Many endpoints return rows that embed related entities as nested objects
 * (e.g. `etablissement`, `sourceEnergie`, `categorie`, `role`, ...).
 * These helpers are domain-agnostic: they work for ANY user / ANY establishment
 * and should be used consistently across all `/gestionnaire/*` pages so that
 * HTML rendering and CSV / Excel exports stay synchronized.
 */

/** Map of foreign-key field -> nested object field -> label field to extract. */
export const NESTED_LABEL_MAP: Record<string, { nested: string; label: string }> = {
  id_ess: { nested: "etablissement", label: "nom" },
  id_se: { nested: "sourceEnergie", label: "libelle" },
  id_cat: { nested: "categorie", label: "libelle" },
  id_role: { nested: "role", label: "libelle" },
};

/** Nested object keys that must never be displayed or exported. */
export const HIDDEN_NESTED_KEYS = new Set(
  Object.values(NESTED_LABEL_MAP).map((m) => m.nested),
);

/** Flat keys that must never be displayed or exported (e.g. sensitive fields). */
export const HIDDEN_KEYS = new Set<string>(["password"]);

/** Reverse map: nested object field -> foreign-key field. */
export const NESTED_TO_FK: Record<string, string> = Object.fromEntries(
  Object.entries(NESTED_LABEL_MAP).map(([fk, m]) => [m.nested, fk]),
);

/**
 * Collect a stable, dynamic list of column keys from a list of rows:
 * - skips any nested-object value (so embedded objects never become columns)
 * - skips known nested keys (etablissement, sourceEnergie, ...)
 * - ensures the matching foreign-key column (id_ess, id_se, ...) is present
 *   whenever its nested object appears on at least one row, even if the
 *   backend omits the raw id field for some users / establishments.
 */
export function collectDynamicKeys(
  rows: ReadonlyArray<Record<string, unknown>>,
): string[] {
  const keys = new Set<string>();
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    for (const [k, v] of Object.entries(r)) {
      if (HIDDEN_KEYS.has(k)) continue;
      if (HIDDEN_NESTED_KEYS.has(k)) {
        const fk = NESTED_TO_FK[k];
        if (fk) keys.add(fk);
        continue;
      }
      if (v && typeof v === "object" && !Array.isArray(v)) continue;
      keys.add(k);
    }
  }
  return Array.from(keys);
}

/**
 * For a given field name and row, returns the human-readable label resolved
 * from the embedded nested object when available, otherwise the raw value.
 */
export function resolveNestedLabel(
  field: string,
  row: Record<string, unknown> | undefined | null,
  fallback: unknown,
): string {
  const map = NESTED_LABEL_MAP[field];
  if (!map || !row) return fallback == null ? "" : String(fallback);
  const nested = row[map.nested] as Record<string, unknown> | null | undefined;
  if (nested && typeof nested === "object") {
    const v = nested[map.label];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return fallback == null ? "" : String(fallback);
}

/**
 * Produces a flat record ready for CSV / Excel export: nested objects are
 * removed, and any *_id field that has a matching nested object is replaced
 * with the corresponding label.
 */
export function flattenRowForExport<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (HIDDEN_KEYS.has(k)) continue; // never export sensitive flat keys
    if (HIDDEN_NESTED_KEYS.has(k)) continue; // never export nested objects
    if (v && typeof v === "object" && !Array.isArray(v)) continue; // skip any other nested object
    out[k] = NESTED_LABEL_MAP[k] ? resolveNestedLabel(k, row, v) : v;
  }
  return out;
}

/**
 * Returns the effective foreign-key value for a row, falling back to the
 * nested object's `id` when the raw FK field has been stripped by the API.
 * Example: rowEss(row) returns row.id_ess ?? row.etablissement?.id.
 */
export function rowFk(field: string, row: Record<string, unknown> | undefined | null): unknown {
  if (!row) return undefined;
  const direct = row[field];
  if (direct !== undefined && direct !== null) return direct;
  const map = NESTED_LABEL_MAP[field];
  if (!map) return undefined;
  const nested = row[map.nested] as Record<string, unknown> | null | undefined;
  return nested && typeof nested === "object" ? nested.id : undefined;
}
