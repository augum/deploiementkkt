import { useEffect, useState } from "react";
import * as yup from "yup";
import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DynamicTable } from "@/components/DynamicTable";
import { DynamicForm, type FieldDef } from "@/components/DynamicForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import { ExportExcelButton } from "@/components/ExportExcelButton";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { sourceThunks } from "@/redux/reducers/sourceSlice";
import type { SourceEnergie } from "@/services/sourceService";
import documentation from "@/global/documentation.json";

// Extrait dynamiquement les valeurs de l'enum typeEnergie depuis la documentation Swagger.
// On parcourt tous les schémas pour trouver une propriété "typeEnergie" portant un enum,
// afin d'être robuste aux variations de nommage côté API.
function extractTypeEnergieEnum(): string[] {
  const schemas = (documentation as {
    components?: { schemas?: Record<string, { properties?: Record<string, { enum?: string[] }> }> };
  }).components?.schemas ?? {};
  for (const schema of Object.values(schemas)) {
    const e = schema?.properties?.typeEnergie?.enum;
    if (Array.isArray(e) && e.length > 0) return e;
  }
  return [];
}
const typeEnergieEnum = extractTypeEnergieEnum();

const typeEnergieOptions = typeEnergieEnum.map((v) => ({ value: v, label: v }));

const schema = yup.object({
  libelle: yup.string().required("Libellé obligatoire"),
  typeEnergie: yup.string().required("Type obligatoire"),
});
const empty: SourceEnergie = { libelle: "", typeEnergie: "" };
const fields: FieldDef[] = [
  { name: "libelle", label: "Libellé", required: true },
  { name: "typeEnergie", label: "Type d'énergie", required: true, type: "select", options: typeEnergieOptions },
];

export default function AdminSources() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.sources);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SourceEnergie | null>(null);
  const [toDelete, setToDelete] = useState<SourceEnergie | null>(null);

  useEffect(() => { dispatch(sourceThunks.fetchAll()); }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "libelle", headerName: "Libellé", flex: 1 },
    { field: "typeEnergie", headerName: "Type", flex: 1 },
  ];

  const handleSubmit = async (v: SourceEnergie) => {
    const r = editing?.id
      ? await dispatch(sourceThunks.updateOne({ id: editing.id, data: { ...v, id: editing.id } }))
      : await dispatch(sourceThunks.createOne(v));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(sourceThunks.removeOne(toDelete.id));
    if (sourceThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <AdminLayout title="Sources d'énergie">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouvelle source
          </Button>
          <ExportCsvButton filename="sources" rows={items as unknown as Record<string, unknown>[]} />
          <ExportExcelButton filename="sources" rows={items as unknown as Record<string, unknown>[]} />
        </Stack>
        <DynamicTable rows={items} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouvelle"} source</DialogTitle>
        <DialogContent>
          <DynamicForm fields={fields} schema={schema as never}
            defaultValues={editing ? { ...empty, ...editing } : empty}
            onSubmit={(v) => handleSubmit(v as SourceEnergie)}
            onCancel={() => setOpen(false)} loading={loading} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} message="Supprimer cette source ?"
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} loading={loading} />
    </AdminLayout>
  );
}