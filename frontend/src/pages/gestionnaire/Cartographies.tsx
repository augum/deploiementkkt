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
import { cartographieThunks } from "@/redux/reducers/cartographieSlice";
import { sourceThunks } from "@/redux/reducers/sourceSlice";
import type { Cartographie } from "@/services/cartographieService";
import { resolveNestedLabel, NESTED_LABEL_MAP, collectDynamicKeys, rowFk } from "@/utils/normalizeRow";

const schema = yup.object({
  distance_bdom: yup.string().required("Obligatoire"),
  population_cible: yup.string().required("Obligatoire"),
  id_se: yup.number().typeError("Nombre").required(),
  presence_blocop: yup.boolean(),
  capacite_transfusion: yup.boolean(),
  electricite: yup.string(),
  eau: yup.string(),
  reabilitation: yup.string(),
  forage: yup.string(),
  incinerateur: yup.string(),
  equipement_biom: yup.string(),
});

const emptyValues: Omit<Cartographie, "id" | "id_ess"> = {
  distance_bdom: "", population_cible: "", id_se: 0,
  presence_blocop: false, capacite_transfusion: false, electricite: "",
  eau: "", reabilitation: "", forage: "", incinerateur: "", equipement_biom: "",
};

export default function GestionnaireCartographies() {
  const dispatch = useAppDispatch();
  const id_ess = useAppSelector((s) => s.auth.id_ess);
  const { items, loading } = useAppSelector((s) => s.cartographies);
  const sources = useAppSelector((s) => s.sources.items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cartographie | null>(null);
  const [toDelete, setToDelete] = useState<Cartographie | null>(null);

  useEffect(() => {
    dispatch(cartographieThunks.fetchAll());
    dispatch(sourceThunks.fetchAll());
  }, [dispatch]);

  const rows = useMemo(
    () => items.filter((c) => rowFk("id_ess", c as Record<string, unknown>) === id_ess),
    [items, id_ess],
  );

  const humanize = (k: string) => {
    if (k === "id_ess") return "Établissement";
    if (k === "id_se") return "Source d'énergie";
    return k
      .replace(/_/g, " ")
      .replace(/\bid\b/gi, "ID")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const dynamicKeys = useMemo(() => {
    const all = collectDynamicKeys(rows as Record<string, unknown>[]);
    const ordered = ["id", ...all.filter((k) => k !== "id")];
    return ordered;
  }, [rows]);

  const fields: FieldDef[] = [
    { name: "distance_bdom", label: "Distance BDOM (ex: 10km)", type: "text", required: true },
    { name: "population_cible", label: "Population cible", type: "number", required: true },
    {
      name: "id_se", label: "Source d'énergie", type: "select", required: true,
      options: sources.map((s) => ({ value: s.id ?? 0, label: s.libelle ?? "—" })),
    },
    { name: "presence_blocop", label: "Présence bloc opératoire", type: "boolean" },
    { name: "capacite_transfusion", label: "Capacité transfusion", type: "boolean" },
    { name: "electricite", label: "Électricité (ex: Snel)", type: "text" },
    { name: "eau", label: "Eau (ex: Forage)", type: "text" },
    { name: "reabilitation", label: "Réhabilitation (oui/non)", type: "text" },
    { name: "forage", label: "Forage (oui/non)", type: "text" },
    { name: "incinerateur", label: "Incinérateur (oui/non)", type: "text" },
    { name: "equipement_biom", label: "Équipement biomédical", type: "text" },
  ];

  const columns = useMemo(
    () =>
      dynamicKeys.map((k) => {
        const base: any =
          k === "id"
            ? { field: "id", headerName: "ID", width: 70 }
            : { field: k, headerName: humanize(k), flex: 1 };
        return {
          ...base,
          renderCell: (params: any) => {
            const v = params.value;
            if (typeof v === "boolean") return v ? "Oui" : "Non";
            if (NESTED_LABEL_MAP[k]) return resolveNestedLabel(k, params.row, v);
            return v ?? "";
          },
        };
      }),
    [dynamicKeys],
  );

  const csvColumns = useMemo(
    () => dynamicKeys.map((k) => ({ key: k, label: humanize(k) })),
    [dynamicKeys],
  );

  const csvRows = useMemo(
    () =>
      rows.map((r) => {
        const src = r as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        dynamicKeys.forEach((k) => {
          let val: unknown = NESTED_LABEL_MAP[k]
            ? resolveNestedLabel(k, src, src[k])
            : src[k];
          if (typeof val === "boolean") val = val ? "Oui" : "Non";
          out[k] = val;
        });
        return out;
      }),
    [rows, dynamicKeys],
  );

  const handleSubmit = async (values: Omit<Cartographie, "id" | "id_ess">) => {
    if (!id_ess) { toast.error("Aucune structure liée"); return; }
    const payload: Cartographie = { ...values, id_ess };
    const r = editing?.id
      ? await dispatch(cartographieThunks.updateOne({ id: editing.id, data: { ...payload, id: editing.id } }))
      : await dispatch(cartographieThunks.createOne(payload));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(cartographieThunks.removeOne(toDelete.id));
    if (cartographieThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <GestionnaireLayout title="Cartographies">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouvelle cartographie
          </Button>
          <ExportCsvButton filename="cartographies" rows={csvRows} columns={csvColumns} />
          <ExportExcelButton filename="cartographies" rows={csvRows} columns={csvColumns} />
        </Stack>
        <DynamicTable rows={rows} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouvelle"} cartographie</DialogTitle>
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
        message="Supprimer cette cartographie ?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={loading}
      />
    </GestionnaireLayout>
  );
}