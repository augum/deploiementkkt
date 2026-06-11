import DownloadIcon from "@mui/icons-material/Download";
import { exportToExcel } from "@/utils/exportExcel";
import { LoadingButton } from "@/components/LoadingButton";

export function ExportExcelButton<T extends Record<string, unknown>>({
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
        exportToExcel(filename, rows, columns);
      }}
      disabled={disabled || !rows.length}
    >
      Export Excel
    </LoadingButton>
  );
}
