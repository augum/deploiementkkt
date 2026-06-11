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
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { StepperForm, type StepDef } from "@/components/StepperForm";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { personnelThunks } from "@/redux/reducers/personnelSlice";
import { etablissementThunks } from "@/redux/reducers/etablissementSlice";
import type { Personnel } from "@/services/personnelService";
import { resolveNestedLabel, flattenRowForExport, rowFk } from "@/utils/normalizeRow";

const numericField = yup.number().typeError("Doit être un nombre").min(0, "≥ 0").required("Obligatoire");
const schema = yup.object({
  nb_agent_matricule: numericField,
  nb_agent_nu: numericField,
  nb_nv_agent_matricule: numericField,
  nb_nv_agent_salaireEtat: numericField,
  nb_nv_agent_primeEtat: numericField,
  nb_agent_primeLocale: numericField,
});

const steps: StepDef[] = [
  { label: "Agents existants", fields: [
    { name: "nb_agent_matricule", label: "Agents matriculés", type: "number", required: true },
    { name: "nb_agent_nu", label: "Agents non matriculés", type: "number", required: true },
    { name: "nb_agent_primeLocale", label: "Agents prime locale", type: "number", required: true },
  ] },
  { label: "Nouveaux agents", fields: [
    { name: "nb_nv_agent_matricule", label: "Nv agents matriculés", type: "number", required: true },
    { name: "nb_nv_agent_salaireEtat", label: "Nv agents salaire État", type: "number", required: true },
    { name: "nb_nv_agent_primeEtat", label: "Nv agents prime État", type: "number", required: true },
  ] },
];

const summaryLabels: Record<string, string> = {
  nb_agent_matricule: "Agents matriculés",
  nb_agent_nu: "Agents non matriculés",
  nb_agent_primeLocale: "Agents prime locale",
  nb_nv_agent_matricule: "Nv. matriculés",
  nb_nv_agent_salaireEtat: "Nv. salaire État",
  nb_nv_agent_primeEtat: "Nv. prime État",
};

const emptyValues = {
  nb_agent_matricule: 0, nb_agent_nu: 0, nb_nv_agent_matricule: 0,
  nb_nv_agent_salaireEtat: 0, nb_nv_agent_primeEtat: 0, nb_agent_primeLocale: 0,
};

export default function GestionnairePersonnels() {
  const dispatch = useAppDispatch();
  const id_ess = useAppSelector((s) => s.auth.id_ess);
  const { items, loading, error } = useAppSelector((s) => s.personnels);
  const etablissements = useAppSelector((s) => s.etablissements.items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Personnel | null>(null);
  const [toDelete, setToDelete] = useState<Personnel | null>(null);

  useEffect(() => {
    dispatch(personnelThunks.fetchAll());
    dispatch(etablissementThunks.fetchAll());
  }, [dispatch]);

  const etabById = useMemo(() => {
    const m = new Map<number, string>();
    for (const e of etablissements) {
      if (e?.id != null && e.nom) m.set(e.id, e.nom);
    }
    return m;
  }, [etablissements]);

  const resolveEtab = (row: Record<string, unknown>): string => {
    const fk = rowFk("id_ess", row);
    if (typeof fk === "number" && etabById.has(fk)) return etabById.get(fk)!;
    if (typeof fk === "string") {
      const n = Number(fk);
      if (!Number.isNaN(n) && etabById.has(n)) return etabById.get(n)!;
    }
    return resolveNestedLabel("id_ess", row, fk);
  };

  const rows = useMemo(
    () => items.filter((p) => rowFk("id_ess", p as Record<string, unknown>) === id_ess),
    [items, id_ess],
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "id_ess", headerName: "Établissement", flex: 1, renderCell: (params: any) => resolveEtab(params.row) },
    { field: "nb_agent_matricule", headerName: "Agents matr.", flex: 1 },
    { field: "nb_agent_nu", headerName: "Agents non matr.", flex: 1 },
    { field: "nb_nv_agent_matricule", headerName: "Nv matr.", flex: 1 },
    { field: "nb_nv_agent_salaireEtat", headerName: "Nv sal. État", flex: 1 },
    { field: "nb_nv_agent_primeEtat", headerName: "Nv prime État", flex: 1 },
    { field: "nb_agent_primeLocale", headerName: "Prime locale", flex: 1 },
  ];

  const csvColumns = [
    { key: "id" as const, label: "ID" },
    { key: "id_ess" as const, label: "Établissement" },
    { key: "nb_agent_matricule" as const, label: "Agents matr." },
    { key: "nb_agent_nu" as const, label: "Agents non matr." },
    { key: "nb_nv_agent_matricule" as const, label: "Nv matr." },
    { key: "nb_nv_agent_salaireEtat" as const, label: "Nv sal. État" },
    { key: "nb_nv_agent_primeEtat" as const, label: "Nv prime État" },
    { key: "nb_agent_primeLocale" as const, label: "Prime locale" },
  ];

  const csvRows = useMemo(
    () => rows.map((r) => {
      const flat = flattenRowForExport(r as Record<string, unknown>);
      flat.id_ess = resolveEtab(r as Record<string, unknown>);
      return flat;
    }),
    [rows, etabById],
  );

  const handleSubmit = async (values: Omit<Personnel, "id" | "id_ess">) => {
    if (!id_ess) { toast.error("Aucune structure liée"); return; }
    const payload: Personnel = { ...values, id_ess };
    if (editing?.id) {
      const r = await dispatch(personnelThunks.updateOne({ id: editing.id, data: { ...payload, id: editing.id } }));
      if (personnelThunks.updateOne.fulfilled.match(r)) toast.success("Mis à jour");
      else toast.error("Erreur de mise à jour");
    } else {
      const r = await dispatch(personnelThunks.createOne(payload));
      if (personnelThunks.createOne.fulfilled.match(r)) toast.success("Enregistré");
      else toast.error("Erreur d'enregistrement");
    }
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(personnelThunks.removeOne(toDelete.id));
    if (personnelThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    else toast.error("Erreur de suppression");
    setToDelete(null);
  };

  if (error) return (
    <GestionnaireLayout title="Personnels">
      <ErrorState message={error} onRetry={() => dispatch(personnelThunks.fetchAll())} />
    </GestionnaireLayout>
  );

  return (
    <GestionnaireLayout title="Personnels">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouveau rapport
          </Button>
          <ExportCsvButton filename="personnels" rows={csvRows} columns={csvColumns} />
          <ExportExcelButton filename="personnels" rows={csvRows} columns={csvColumns} />
        </Stack>
        {loading ? <LoadingSpinner /> : (
          <DynamicTable rows={rows} columns={columns} loading={loading}
            onEdit={(r) => { setEditing(r); setOpen(true); }}
            onDelete={(r) => setToDelete(r)} />
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouveau"} rapport personnel</DialogTitle>
        <DialogContent>
          <StepperForm
            steps={steps}
            schema={schema as never}
            defaultValues={editing ? { ...emptyValues, ...editing } : emptyValues}
            onSubmit={(v) => handleSubmit(v as never)}
            onCancel={() => setOpen(false)}
            loading={loading}
            summaryLabels={summaryLabels}
          />
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} message="Supprimer ce rapport personnel ?"
        onConfirm={confirmDelete} onCancel={() => setToDelete(null)} loading={loading} />
    </GestionnaireLayout>
  );
}