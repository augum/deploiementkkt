import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { GestionnaireLayout } from "@/layouts/GestionnaireLayout";
import { DynamicTable } from "@/components/DynamicTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import { ExportExcelButton } from "@/components/ExportExcelButton";
import { DynamicForm, type FieldDef } from "@/components/DynamicForm";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { medicamentThunks } from "@/redux/reducers/medicamentSlice";
import type { Medicament } from "@/services/medicamentService";
import { resolveNestedLabel, flattenRowForExport, rowFk } from "@/utils/normalizeRow";

const schema = yup.object({
  periode: yup
    .string()
    .required("Période obligatoire")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD"),
  capital_depart: yup.number().typeError("Nombre").min(0).required(),
  capital_fin_moi: yup.number().typeError("Nombre").min(0).required(),
  croissance: yup.string().required("Obligatoire"),
  benefice: yup.string().required("Obligatoire"),
});

const fields: FieldDef[] = [
  { name: "periode", label: "Sélectionner une date", type: "datepicker", required: true },
  { name: "capital_depart", label: "Capital départ", type: "number", required: true },
  { name: "capital_fin_moi", label: "Capital fin de mois", type: "number", required: true },
  { name: "croissance", label: "Croissance (ex: 50%)", type: "text", required: true },
  { name: "benefice", label: "Bénéfice (ex: 5000$)", type: "text", required: true },
];

const emptyValues = { periode: "", capital_depart: 0, capital_fin_moi: 0, croissance: "", benefice: "" };

export default function GestionnaireMedicaments() {
  const dispatch = useAppDispatch();
  const id_ess = useAppSelector((s) => s.auth.id_ess);
  const { items, loading } = useAppSelector((s) => s.medicaments);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Medicament | null>(null);
  const [toDelete, setToDelete] = useState<Medicament | null>(null);

  useEffect(() => { dispatch(medicamentThunks.fetchAll()); }, [dispatch]);
  const rows = useMemo(
    () => items.filter((m) => rowFk("id_ess", m as Record<string, unknown>) === id_ess),
    [items, id_ess],
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "periode", headerName: "Période", flex: 1 },
    { field: "capital_depart", headerName: "Capital départ", flex: 1 },
    { field: "capital_fin_moi", headerName: "Capital fin", flex: 1 },
    { field: "croissance", headerName: "Croissance", flex: 1 },
    { field: "benefice", headerName: "Bénéfice", flex: 1 },
    {
      field: "id_ess",
      headerName: "Établissement",
      flex: 1,
      renderCell: (params: any) =>
        resolveNestedLabel("id_ess", params.row, params.value),
    },
  ];

  const csvColumns = [
    { key: "id" as const, label: "ID" },
    { key: "periode" as const, label: "Période" },
    { key: "capital_depart" as const, label: "Capital départ" },
    { key: "capital_fin_moi" as const, label: "Capital fin" },
    { key: "croissance" as const, label: "Croissance" },
    { key: "benefice" as const, label: "Bénéfice" },
    { key: "id_ess" as const, label: "Établissement" },
  ];

  const csvRows = useMemo(
    () => rows.map((r) => flattenRowForExport(r as Record<string, unknown>)),
    [rows],
  );

  const handleSubmit = async (values: Omit<Medicament, "id" | "id_ess">) => {
    if (!id_ess) { toast.error("Aucune structure liée"); return; }
    const payload: Medicament = { ...values, id_ess };
    const r = editing?.id
      ? await dispatch(medicamentThunks.updateOne({ id: editing.id, data: { ...payload, id: editing.id } }))
      : await dispatch(medicamentThunks.createOne(payload));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(medicamentThunks.removeOne(toDelete.id));
    if (medicamentThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    else toast.error("Erreur");
    setToDelete(null);
  };

  return (
    <GestionnaireLayout title="Médicaments">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouveau
          </Button>
          <ExportCsvButton filename="medicaments" rows={csvRows} columns={csvColumns} />
          <ExportExcelButton filename="medicaments" rows={csvRows} columns={csvColumns} />
        </Stack>
        <DynamicTable rows={rows} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouveau"} médicament</DialogTitle>
        <DialogContent>
          <DynamicForm
            fields={fields}
            schema={schema as never}
            defaultValues={editing ? { ...emptyValues, ...editing } : emptyValues}
            onSubmit={(v) => handleSubmit(v as never)}
            onCancel={() => setOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        message="Confirmez-vous la suppression de ce rapport ?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={loading}
      />
    </GestionnaireLayout>
  );
}