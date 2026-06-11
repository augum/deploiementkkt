import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { EmptyState } from "./EmptyState";
import { PAGE_SIZE_OPTIONS } from "@/global/constants";

export interface DynamicTableProps<T extends { id?: number }> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  height?: number;
}

export function DynamicTable<T extends { id?: number }>({
  rows, columns, loading, onEdit, onDelete, height = 520,
}: DynamicTableProps<T>) {
  const cols: GridColDef[] = [...columns];
  if (onEdit || onDelete) {
    cols.push({
      field: "__actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params) => (
        <Box>
          {onEdit && (
            <Tooltip title="Modifier">
              <IconButton size="small" onClick={() => onEdit(params.row as T)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Supprimer">
              <IconButton size="small" color="error" onClick={() => onDelete(params.row as T)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    });
  }

  if (!loading && rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box sx={{ height, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={cols}
        loading={loading}
        getRowId={(r) => (r as T).id ?? Math.random()}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Box>
  );
}