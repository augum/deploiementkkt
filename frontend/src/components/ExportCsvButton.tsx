import DownloadIcon from "@mui/icons-material/Download";
import { exportToCsv } from "@/utils/exportCsv";
import { LoadingButton } from "@/components/LoadingButton";

export function ExportCsvButton<T extends Record<string, unknown>>({
  filename, rows, columns, disabled,
}: {
  filename: string;
  rows: T[];
  columns?: { key: keyof T; label: string }[];
  disabled?: boolean;
}) {
  return (
    <LoadingButton
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={async () => {
        await Promise.resolve();
        exportToCsv(filename, rows, columns);
      }}
      disabled={disabled || !rows.length}
    >
      Export CSV
    </LoadingButton>
  );
}