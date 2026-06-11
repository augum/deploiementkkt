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
import { etablissementThunks } from "@/redux/reducers/etablissementSlice";
import { categorieThunks } from "@/redux/reducers/categorieSlice";
import type { Etablissement } from "@/services/etablissementService";
import { flattenRowForExport, resolveNestedLabel, rowFk } from "@/utils/normalizeRow";

const schema = yup.object({
  nom: yup.string().required("Nom obligatoire"),
  zone: yup.string().required("Zone obligatoire"),
  id_cat: yup.number().typeError("Catégorie obligatoire").required(),
});
const empty: Etablissement = { nom: "", zone: "", id_cat: 0 };

export default function AdminEtablissements() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.etablissements);
  const categories = useAppSelector((s) => s.categories.items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Etablissement | null>(null);
  const [toDelete, setToDelete] = useState<Etablissement | null>(null);

  useEffect(() => {
    dispatch(etablissementThunks.fetchAll());
    dispatch(categorieThunks.fetchAll());
  }, [dispatch]);

  const fields: FieldDef[] = [
    { name: "nom", label: "Nom", required: true },
    { name: "zone", label: "Zone", required: true },
    { name: "id_cat", label: "Catégorie", type: "select", required: true,
      options: categories.map((c) => ({ value: c.id ?? 0, label: c.libelle ?? "—" })) },
  ];
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "zone", headerName: "Zone", flex: 1 },
    {
      field: "id_cat",
      headerName: "Catégorie",
      flex: 1,
      valueGetter: (_v: unknown, row: Record<string, unknown>) => {
        const fk = rowFk("id_cat", row);
        return resolveNestedLabel("id_cat", row, fk);
      },
    },
  ];

  const handleSubmit = async (values: Etablissement) => {
    const r = editing?.id
      ? await dispatch(etablissementThunks.updateOne({ id: editing.id, data: { ...values, id: editing.id } }))
      : await dispatch(etablissementThunks.createOne(values));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };
  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(etablissementThunks.removeOne(toDelete.id));
    if (etablissementThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <AdminLayout title="Établissements">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouvel établissement
          </Button>
          <ExportCsvButton filename="etablissements" rows={(items as unknown as Record<string, unknown>[]).map(flattenRowForExport)} />
          <ExportExcelButton filename="etablissements" rows={(items as unknown as Record<string, unknown>[]).map(flattenRowForExport)} />
        </Stack>
        <DynamicTable rows={items} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouvel"} établissement</DialogTitle>
        <DialogContent>
          <DynamicForm fields={fields} schema={schema as never}
            defaultValues={editing ? { ...empty, ...editing } : empty}
            onSubmit={(v) => handleSubmit(v as Etablissement)}
            onCancel={() => setOpen(false)} loading={loading} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} message="Supprimer cet établissement ?"
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} loading={loading} />
    </AdminLayout>
  );
}