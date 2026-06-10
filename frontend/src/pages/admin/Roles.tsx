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
import { roleThunks } from "@/redux/reducers/roleSlice";
import type { Role } from "@/services/roleService";

const schema = yup.object({
  libelle: yup.string().required("Libellé obligatoire"),
});
const empty: Role = { libelle: "" };
const fields: FieldDef[] = [
  { name: "libelle", label: "Libellé", required: true },
];

export default function AdminRoles() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.roles);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [toDelete, setToDelete] = useState<Role | null>(null);

  useEffect(() => { dispatch(roleThunks.fetchAll()); }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "libelle", headerName: "Libellé", flex: 1 },
  ];

  const handleSubmit = async (v: Role) => {
    const r = editing?.id
      ? await dispatch(roleThunks.updateOne({ id: editing.id, data: { ...v, id: editing.id } }))
      : await dispatch(roleThunks.createOne(v));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(roleThunks.removeOne(toDelete.id));
    if (roleThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <AdminLayout title="Rôles">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouveau rôle
          </Button>
          <ExportCsvButton filename="roles" rows={items as unknown as Record<string, unknown>[]} />
          <ExportExcelButton filename="roles" rows={items as unknown as Record<string, unknown>[]} />
        </Stack>
        <DynamicTable rows={items} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouveau"} rôle</DialogTitle>
        <DialogContent>
          <DynamicForm fields={fields} schema={schema as never}
            defaultValues={editing ? { ...empty, ...editing } : empty}
            onSubmit={(v) => handleSubmit(v as Role)}
            onCancel={() => setOpen(false)} loading={loading} />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} message="Supprimer ce rôle ?"
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} loading={loading} />
    </AdminLayout>
  );
}