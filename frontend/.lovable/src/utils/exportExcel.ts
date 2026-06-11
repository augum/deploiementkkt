import * as XLSX from "xlsx";

export function exportToExcel<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns?: { key: keyof T; label: string }[],
) {
  if (!rows || rows.length === 0) {
    return;
  }
  const cols =
    columns ??
    (Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k })) as {
      key: keyof T;
      label: string;
    }[]);

  const headers = cols.map((c) => c.label);
  const data = rows.map((row) =>
    cols.map((c) => {
      const v = row[c.key];
      return v === null || v === undefined ? "" : v;
    }),
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Données");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
