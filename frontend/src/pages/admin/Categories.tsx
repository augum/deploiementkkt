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
import { categorieThunks } from "@/redux/reducers/categorieSlice";
import type { Categorie } from "@/services/categorieService";

const schema = yup.object({ libelle: yup.string().required("Libellé obligatoire") });
const empty: Categorie = { libelle: "" };
const fields: FieldDef[] = [{ name: "libelle", label: "Libellé", required: true }];

export default function AdminCategories() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.categories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Categorie | null>(null);
  const [toDelete, setToDelete] = useState<Categorie | null>(null);

  useEffect(() => { dispatch(categorieThunks.fetchAll()); }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "libelle", headerName: "Libellé", flex: 1 },
  ];

  const handleSubmit = async (v: Categorie) => {
    const r = editing?.id
      ? await dispatch(categorieThunks.updateOne({ id: editing.id, data: { ...v, id: editing.id } }))
      : await dispatch(categorieThunks.createOne(v));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(categorieThunks.removeOne(toDelete.id));
    if (categorieThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    else toast.error("Erreur de suppression");
    setToDelete(null);
  };

  return (
    <AdminLayout title="Catégories">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouvelle catégorie
          </Button>
          <ExportCsvButton filename="categories" rows={items as unknown as Record<string, unknown>[]} />
          <ExportExcelButton filename="categories" rows={items as unknown as Record<string, unknown>[]} />
        </Stack>
        <DynamicTable rows={items} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouvelle"} catégorie</DialogTitle>
        <DialogContent>
          <DynamicForm fields={fields} schema={schema as never}
            defaultValues={editing ? { ...empty, ...editing } : empty}
            onSubmit={(v) => handleSubmit(v as Categorie)}
            onCancel={() => setOpen(false)} loading={loading} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} message="Supprimer cette catégorie ?"
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} loading={loading} />
    </AdminLayout>
  );
}