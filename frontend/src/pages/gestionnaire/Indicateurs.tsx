import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Box,
  Typography,
  Grow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import { GestionnaireLayout } from "@/layouts/GestionnaireLayout";
import { DynamicTable } from "@/components/DynamicTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import { ExportExcelButton } from "@/components/ExportExcelButton";
import { StepperForm, type StepDef } from "@/components/StepperForm";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { indicateurThunks } from "@/redux/reducers/indicateurSlice";
import type { Indicateur } from "@/services/indicateurService";
import { resolveNestedLabel, NESTED_LABEL_MAP, collectDynamicKeys, rowFk } from "@/utils/normalizeRow";

const num = yup.number().typeError("Nombre").min(0).required();
const schema = yup.object({
  periode: yup
    .string()
    .required("Période obligatoire")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD"),
  nv_casCuratif: num, cpn1: num, cpn1_16: num, cpn4: num, apa: num,
  nv_acc_pf: num, diabeteNotification: num, transfusion: num,
  transfusionTeste4Marquer: num, dc_neonat: num, dc_maternel: num,
  chirurgieMajeure: num, cesarienne: num, hospitalise: num,
  dc_av48h: num, dc_ap48h: num, infePostOp: num, diarheSimple: num,
});

const steps: StepDef[] = [
  {
    label: "Période & curatif", fields: [
      { name: "periode", label: "Sélectionner une date", type: "datepicker", required: true },
      { name: "nv_casCuratif", label: "Nouveaux cas curatifs", type: "number", required: true },
      { name: "hospitalise", label: "Hospitalisés", type: "number", required: true },
      { name: "diarheSimple", label: "Diarrhée simple", type: "number", required: true },
      { name: "diabeteNotification", label: "Diabète notifié", type: "number", required: true },
    ]
  },
  {
    label: "Maternité", fields: [
      { name: "cpn1", label: "CPN1", type: "number", required: true },
      { name: "cpn1_16", label: "CPN1 < 16 sem.", type: "number", required: true },
      { name: "cpn4", label: "CPN4", type: "number", required: true },
      { name: "apa", label: "APA", type: "number", required: true },
      { name: "nv_acc_pf", label: "Nouvel acceptant planification familliale", type: "number", required: true },
      { name: "cesarienne", label: "Césariennes", type: "number", required: true },
    ]
  },
  {
    label: "Chirurgie & transfusion", fields: [
      { name: "chirurgieMajeure", label: "Chirurgies majeures", type: "number", required: true },
      { name: "transfusion", label: "Transfusions", type: "number", required: true },
      { name: "transfusionTeste4Marquer", label: "Transf. testées 4 marqueurs", type: "number", required: true },
      { name: "infePostOp", label: "Infections post-op.", type: "number", required: true },
    ]
  },
  {
    label: "Mortalité", fields: [
      { name: "dc_neonat", label: "DC néonatals", type: "number", required: true },
      { name: "dc_maternel", label: "DC maternels", type: "number", required: true },
      { name: "dc_av48h", label: "DC avant 48h", type: "number", required: true },
      { name: "dc_ap48h", label: "DC après 48h", type: "number", required: true },
    ]
  },
];

const summaryLabels: Record<string, string> = {
  periode: "Période",
  nv_casCuratif: "Cas curatifs",
  hospitalise: "Hospit.",
  diarheSimple: "Diarrhée simple",
  diabeteNotification: "Diabète notifié",
  cpn1: "CPN1",
  cpn1_16: "CPN1 < 16 sem.",
  cpn4: "CPN4",
  apa: "APA",
  nv_acc_pf: "Nouvel acceptant planification familliale",
  cesarienne: "Césariennes",
  chirurgieMajeure: "Chirurgies majeures",
  transfusion: "Transfusions",
  transfusionTeste4Marquer: "Transf. testées 4 marqueurs",
  infePostOp: "Infections post-op.",
  dc_neonat: "DC néonatals",
  dc_maternel: "DC maternels",
  dc_av48h: "DC avant 48h",
  dc_ap48h: "DC après 48h",
};

const emptyValues: Omit<Indicateur, "id" | "id_ess"> = {
  periode: "",
  nv_casCuratif: 0, cpn1: 0, cpn1_16: 0, cpn4: 0, apa: 0,
  nv_acc_pf: 0, diabeteNotification: 0, transfusion: 0,
  transfusionTeste4Marquer: 0, dc_neonat: 0, dc_maternel: 0,
  chirurgieMajeure: 0, cesarienne: 0, hospitalise: 0,
  dc_av48h: 0, dc_ap48h: 0, infePostOp: 0, diarheSimple: 0,
};

export default function GestionnaireIndicateurs() {
  const dispatch = useAppDispatch();
  const id_ess = useAppSelector((s) => s.auth.id_ess);
  const { items, loading } = useAppSelector((s) => s.indicateurs);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Indicateur | null>(null);
  const [toDelete, setToDelete] = useState<Indicateur | null>(null);
  const [detail, setDetail] = useState<Indicateur | null>(null);

  useEffect(() => { dispatch(indicateurThunks.fetchAll()); }, [dispatch]);
  const rows = useMemo(
    () => items.filter((i) => rowFk("id_ess", i as Record<string, unknown>) === id_ess),
    [items, id_ess],
  );

  const humanize = (k: string) =>
    summaryLabels[k] ??
    (k === "id"
      ? "ID"
      : k === "id_ess"
        ? "Établissement"
        : k
          .replace(/^nb_/, "")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()));

  const dynamicKeys = useMemo(() => {
    const keys = new Set(collectDynamicKeys(rows as Record<string, unknown>[]));
    const ordered = ["id", "periode"].filter((k) => keys.has(k));
    const rest = [...keys].filter((k) => !ordered.includes(k) && k !== "id_ess");
    if (keys.has("id_ess")) rest.push("id_ess");
    return [...ordered, ...rest];
  }, [rows]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "periode", headerName: "Période", flex: 1 },
      {
        field: "__detail",
        headerName: "Détail",
        sortable: false,
        filterable: false,
        width: 130,
        renderCell: (params: any) => (
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon fontSize="small" />}
            onClick={() => setDetail(params.row as Indicateur)}
          >
            Détail
          </Button>
        ),
      },
    ],
    [],
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
          out[k] = NESTED_LABEL_MAP[k] ? resolveNestedLabel(k, src, src[k]) : src[k];
        });
        return out;
      }),
    [rows, dynamicKeys],
  );

  const handleSubmit = async (values: Omit<Indicateur, "id" | "id_ess">) => {
    if (!id_ess) { toast.error("Aucune structure liée"); return; }
    const payload: Indicateur = { ...values, id_ess };
    const r = editing?.id
      ? await dispatch(indicateurThunks.updateOne({ id: editing.id, data: { ...payload, id: editing.id } }))
      : await dispatch(indicateurThunks.createOne(payload));
    if ((r as { meta: { requestStatus: string } }).meta.requestStatus === "fulfilled") toast.success("Enregistré");
    else toast.error("Erreur");
    setOpen(false); setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(indicateurThunks.removeOne(toDelete.id));
    if (indicateurThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <GestionnaireLayout title="Indicateurs techniques">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouveau rapport
          </Button>
          <ExportCsvButton filename="indicateurs" rows={csvRows} columns={csvColumns} />
          <ExportExcelButton filename="indicateurs" rows={csvRows} columns={csvColumns} />
        </Stack>
        <DynamicTable rows={rows} columns={columns} loading={loading}
          onEdit={(r) => { setEditing(r); setOpen(true); }}
          onDelete={(r) => setToDelete(r)} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouveau"} rapport d'indicateurs</DialogTitle>
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

      <ConfirmDialog
        open={!!toDelete}
        message="Supprimer définitivement ce rapport ?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={loading}
      />

      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Grow}
        transitionDuration={250}
      >
        <DialogTitle>
          Détail du rapport {detail?.periode ? `— ${detail.periode}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
              }}
            >
              {Object.keys(detail)
                .filter(
                  (k) =>
                    k !== "id" &&
                    k !== "id_ess" &&
                    (detail as Record<string, unknown>)[k] !== undefined,
                )
                .map((k) => {
                  const raw = (detail as Record<string, unknown>)[k];
                  const value = resolveNestedLabel(k, detail as Record<string, unknown>, raw);
                  return (
                    <Box
                      key={k}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.default",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {humanize(k)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                        {value === null || value === "" || value === undefined ? "—" : String(value)}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)} variant="contained">
            Fermer le résumé
          </Button>
        </DialogActions>
      </Dialog>
    </GestionnaireLayout>
  );
}