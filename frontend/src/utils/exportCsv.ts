// Export CSV générique
export function exportToCsv<T extends Record<string, unknown>>(
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

  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };

  const header = cols.map((c) => escape(c.label)).join(";");
  const body = rows
    .map((row) => cols.map((c) => escape(row[c.key])).join(";"))
    .join("\n");
  const csv = `\uFEFF${header}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}