import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DynamicTable } from "@/components/DynamicTable";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import { ExportExcelButton } from "@/components/ExportExcelButton";
import {
  Tabs, Tab, Box, Stack, TextField, MenuItem, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grow,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { personnelThunks } from "@/redux/reducers/personnelSlice";
import { medicamentThunks } from "@/redux/reducers/medicamentSlice";
import { indicateurThunks } from "@/redux/reducers/indicateurSlice";
import { cartographieThunks } from "@/redux/reducers/cartographieSlice";
import { etablissementThunks } from "@/redux/reducers/etablissementSlice";
import { rowFk, resolveNestedLabel, flattenRowForExport } from "@/utils/normalizeRow";
import { maxTodayInputProps, isFutureIso, NO_FUTURE_DATE_MESSAGE } from "@/utils/dateConstraints";
import { toast } from "react-toastify";

function handleDateFilterChange(setter: (v: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (isFutureIso(v)) {
      toast.error(NO_FUTURE_DATE_MESSAGE);
      return;
    }
    setter(v);
  };
}

export default function AdminConsultation() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);

  const personnels = useAppSelector((s) => s.personnels.items);
  const medicaments = useAppSelector((s) => s.medicaments.items);
  const indicateurs = useAppSelector((s) => s.indicateurs.items);
  const cartographies = useAppSelector((s) => s.cartographies.items);
  const etablissements = useAppSelector((s) => s.etablissements.items);

  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const [persEss, setPersEss] = useState<string>("");
  const [persFrom, setPersFrom] = useState<string>("");
  const [persTo, setPersTo] = useState<string>("");
  const [medEss, setMedEss] = useState<string>("");
  const [medFrom, setMedFrom] = useState<string>("");
  const [medTo, setMedTo] = useState<string>("");
  const [indEss, setIndEss] = useState<string>("");
  const [indFrom, setIndFrom] = useState<string>("");
  const [indTo, setIndTo] = useState<string>("");
  const [cartEss, setCartEss] = useState<string>("");
  const [cartFrom, setCartFrom] = useState<string>("");
  const [cartTo, setCartTo] = useState<string>("");

  useEffect(() => {
    dispatch(personnelThunks.fetchAll());
    dispatch(medicamentThunks.fetchAll());
    dispatch(indicateurThunks.fetchAll());
    dispatch(cartographieThunks.fetchAll());
    dispatch(etablissementThunks.fetchAll());
  }, [dispatch]);

  const filteredPersonnels = useMemo(() => {
    return personnels.filter((p) => {
      const r = p as unknown as Record<string, unknown>;
      if (persEss) {
        const ess = rowFk("id_ess", r);
        if (String(ess ?? "") !== String(persEss)) return false;
      }
      const periode = String(r.periode ?? "");
      if (persFrom && periode && periode < persFrom) return false;
      if (persTo && periode && periode > persTo) return false;
      if ((persFrom || persTo) && !periode) return false;
      return true;
    });
  }, [personnels, persEss, persFrom, persTo]);

  const filteredMedicaments = useMemo(() => {
    return medicaments.filter((m) => {
      const r = m as unknown as Record<string, unknown>;
      if (medEss) {
        const ess = rowFk("id_ess", r);
        if (String(ess ?? "") !== String(medEss)) return false;
      }
      const periode = String(r.periode ?? "");
      if (medFrom && periode && periode < medFrom) return false;
      if (medTo && periode && periode > medTo) return false;
      if ((medFrom || medTo) && !periode) return false;
      return true;
    });
  }, [medicaments, medEss, medFrom, medTo]);

  const filteredIndicateurs = useMemo(() => {
    return indicateurs.filter((i) => {
      const r = i as unknown as Record<string, unknown>;
      if (indEss) {
        const ess = rowFk("id_ess", r);
        if (String(ess ?? "") !== String(indEss)) return false;
      }
      const periode = String(r.periode ?? "");
      if (indFrom && periode && periode < indFrom) return false;
      if (indTo && periode && periode > indTo) return false;
      if ((indFrom || indTo) && !periode) return false;
      return true;
    });
  }, [indicateurs, indEss, indFrom, indTo]);

  const aggregatedIndicateurs = useMemo(() => {
    const hasFilter = Boolean(indEss || indFrom || indTo);
    if (!hasFilter) return filteredIndicateurs as unknown as Record<string, unknown>[];
    const map = new Map<string, Record<string, unknown>>();
    for (const item of filteredIndicateurs) {
      const r = item as unknown as Record<string, unknown>;
      const key = String(rowFk("id_ess", r) ?? r.id ?? Math.random());
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { ...r });
        continue;
      }
      const merged: Record<string, unknown> = { ...existing };
      for (const [k, v] of Object.entries(r)) {
        const a = existing[k];
        if (typeof v === "number" && typeof a === "number") {
          merged[k] = a + v;
        } else if (typeof v === "number" && a == null) {
          merged[k] = v;
        } else if (k === "periode") {
          const av = a ? String(a) : "";
          const bv = v ? String(v) : "";
          merged[k] = bv > av ? bv : av;
        } else if (a == null) {
          merged[k] = v;
        }
      }
      map.set(key, merged);
    }
    return Array.from(map.values());
  }, [filteredIndicateurs, indEss, indFrom, indTo]);

  const formatDateFr = (iso: string): string => {
    if (!iso) return "";
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    return `${m[3]}-${m[2]}-${m[1]}`;
  };

  const buildPeriodeLabel = (from: string, to: string): string => {
    if (from && to) return `Du ${formatDateFr(from)} au ${formatDateFr(to)}`;
    if (from) return `À partir du ${formatDateFr(from)}`;
    if (to) return `Jusqu'au ${formatDateFr(to)}`;
    return "";
  };

  const medPeriodeLabel = useMemo(() => buildPeriodeLabel(medFrom, medTo), [medFrom, medTo]);

  const displayedMedicaments = useMemo(() => {
    if (!medPeriodeLabel) return filteredMedicaments as unknown as Record<string, unknown>[];
    return (filteredMedicaments as unknown as Record<string, unknown>[]).map((r) => ({ ...r, periode: medPeriodeLabel }));
  }, [filteredMedicaments, medPeriodeLabel]);

  const indPeriodeLabel = useMemo(() => {
    return buildPeriodeLabel(indFrom, indTo);
  }, [indFrom, indTo]);

  const displayedIndicateurs = useMemo(() => {
    if (!indPeriodeLabel) return aggregatedIndicateurs;
    return aggregatedIndicateurs.map((r) => ({ ...r, periode: indPeriodeLabel }));
  }, [aggregatedIndicateurs, indPeriodeLabel]);

  const filteredCartographies = useMemo(() => {
    return cartographies.filter((c) => {
      const r = c as unknown as Record<string, unknown>;
      if (cartEss) {
        const ess = rowFk("id_ess", r);
        if (String(ess ?? "") !== String(cartEss)) return false;
      }
      const periode = String(r.periode ?? "");
      if (cartFrom && periode && periode < cartFrom) return false;
      if (cartTo && periode && periode > cartTo) return false;
      if ((cartFrom || cartTo) && !periode) return false;
      return true;
    });
  }, [cartographies, cartEss, cartFrom, cartTo]);

  const cartPeriodeLabel = useMemo(() => buildPeriodeLabel(cartFrom, cartTo), [cartFrom, cartTo]);

  const displayedCartographies = useMemo(() => {
    if (!cartPeriodeLabel) return filteredCartographies as unknown as Record<string, unknown>[];
    return (filteredCartographies as unknown as Record<string, unknown>[]).map((r) => ({ ...r, periode: cartPeriodeLabel }));
  }, [filteredCartographies, cartPeriodeLabel]);

  const datasets = [
    {
      label: "Personnels", rows: filteredPersonnels, columns: [
        { field: "id", headerName: "ID", width: 70 },
        {
          field: "id_ess",
          headerName: "Structure",
          flex: 1,
          valueGetter: (_v: unknown, row: Record<string, unknown>) =>
            resolveNestedLabel("id_ess", row, rowFk("id_ess", row)),
        },
        { field: "nb_agent_matricule", headerName: "Agents matr.", flex: 1 },
        { field: "nb_agent_nu", headerName: "Non matr.", flex: 1 },
      ], file: "personnels"
    },
    {
      label: "Médicaments", rows: displayedMedicaments, columns: [
        { field: "id", headerName: "ID", width: 70 },
        {
          field: "id_ess",
          headerName: "Structure",
          flex: 1,
          valueGetter: (_v: unknown, row: Record<string, unknown>) =>
            resolveNestedLabel("id_ess", row, rowFk("id_ess", row)),
        },
        { field: "periode", headerName: "Période", flex: 1 },
        { field: "benefice", headerName: "Bénéfice", flex: 1 },
      ], file: "medicaments"
    },
    {
      label: "Indicateurs", rows: displayedIndicateurs, columns: [
        {
          field: "id_ess",
          headerName: "Structure",
          flex: 1,
          valueGetter: (_v: unknown, row: Record<string, unknown>) =>
            resolveNestedLabel("id_ess", row, rowFk("id_ess", row)),
        },
        { field: "periode", headerName: "Période", flex: 1 },
        {
          field: "__actions",
          headerName: "Actions",
          sortable: false,
          filterable: false,
          width: 140,
          renderCell: (params: { row: Record<string, unknown> }) => (
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon fontSize="small" />}
              onClick={() => setDetail(params.row)}
            >
              Détails
            </Button>
          ),
        },
      ], file: "indicateurs"
    },
    {
      label: "Cartographies", rows: displayedCartographies, columns: [
        { field: "id", headerName: "ID", width: 70 },
        {
          field: "id_ess",
          headerName: "Structure",
          flex: 1,
          valueGetter: (_v: unknown, row: Record<string, unknown>) =>
            resolveNestedLabel("id_ess", row, rowFk("id_ess", row)),
        },
        { field: "periode", headerName: "Période", flex: 1 },
        { field: "distance_bdom", headerName: "Distance", flex: 1 },
        { field: "population_cible", headerName: "Population", flex: 1 },
      ], file: "cartographies"
    },
  ];
  const current = datasets[tab];
  const exportRows = (current.rows as unknown as Record<string, unknown>[])
    .map((r) => {
      const flat = flattenRowForExport(r as Record<string, unknown>);
      if (tab === 1 && medPeriodeLabel) flat.periode = medPeriodeLabel;
      if (tab === 2 && indPeriodeLabel) flat.periode = indPeriodeLabel;
      if (tab === 3 && cartPeriodeLabel) flat.periode = cartPeriodeLabel;
      return flat;
    });

  return (
    <AdminLayout title="Rapport général">
      <div className="table-card">
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          {datasets.map((d) => <Tab key={d.label} label={d.label} />)}
        </Tabs>
        <Box>
          {tab === 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Structure"
                value={persEss}
                onChange={(e) => setPersEss(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {etablissements.map((e) => (
                  <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                size="small"
                label="Du"
                InputLabelProps={{ shrink: true }}
                value={persFrom}
                onChange={handleDateFilterChange(setPersFrom)}
                inputProps={maxTodayInputProps()}
              />
              <TextField
                type="date"
                size="small"
                label="Au"
                InputLabelProps={{ shrink: true }}
                value={persTo}
                onChange={handleDateFilterChange(setPersTo)}
                inputProps={maxTodayInputProps()}
              />
              <Button
                variant="text"
                onClick={() => { setPersEss(""); setPersFrom(""); setPersTo(""); }}
              >
                Réinitialiser
              </Button>
            </Stack>
          )}
          {tab === 1 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Structure"
                value={medEss}
                onChange={(e) => setMedEss(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {etablissements.map((e) => (
                  <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                size="small"
                label="Du"
                InputLabelProps={{ shrink: true }}
                value={medFrom}
                onChange={handleDateFilterChange(setMedFrom)}
                inputProps={maxTodayInputProps()}
              />
              <TextField
                type="date"
                size="small"
                label="Au"
                InputLabelProps={{ shrink: true }}
                value={medTo}
                onChange={handleDateFilterChange(setMedTo)}
                inputProps={maxTodayInputProps()}
              />
              <Button
                variant="text"
                onClick={() => { setMedEss(""); setMedFrom(""); setMedTo(""); }}
              >
                Réinitialiser
              </Button>
            </Stack>
          )}
          {tab === 2 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Structure"
                value={indEss}
                onChange={(e) => setIndEss(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {etablissements.map((e) => (
                  <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                size="small"
                label="Du"
                InputLabelProps={{ shrink: true }}
                value={indFrom}
                onChange={handleDateFilterChange(setIndFrom)}
                inputProps={maxTodayInputProps()}
              />
              <TextField
                type="date"
                size="small"
                label="Au"
                InputLabelProps={{ shrink: true }}
                value={indTo}
                onChange={handleDateFilterChange(setIndTo)}
                inputProps={maxTodayInputProps()}
              />
              <Button
                variant="text"
                onClick={() => { setIndEss(""); setIndFrom(""); setIndTo(""); }}
              >
                Réinitialiser
              </Button>
            </Stack>
          )}
          {tab === 3 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                select
                size="small"
                label="Structure"
                value={cartEss}
                onChange={(e) => setCartEss(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">Toutes</MenuItem>
                {etablissements.map((e) => (
                  <MenuItem key={e.id} value={String(e.id)}>{e.nom}</MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                size="small"
                label="Du"
                InputLabelProps={{ shrink: true }}
                value={cartFrom}
                onChange={handleDateFilterChange(setCartFrom)}
                inputProps={maxTodayInputProps()}
              />
              <TextField
                type="date"
                size="small"
                label="Au"
                InputLabelProps={{ shrink: true }}
                value={cartTo}
                onChange={handleDateFilterChange(setCartTo)}
                inputProps={maxTodayInputProps()}
              />
              <Button
                variant="text"
                onClick={() => { setCartEss(""); setCartFrom(""); setCartTo(""); }}
              >
                Réinitialiser
              </Button>
            </Stack>
          )}
          <Stack direction="row" spacing={2} className="toolbar">
            <ExportCsvButton filename={current.file} rows={exportRows} />
            <ExportExcelButton filename={current.file} rows={exportRows} />
          </Stack>
          <DynamicTable rows={current.rows as unknown as Record<string, unknown>[]} columns={current.columns} />
        </Box>
      </div>

      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Grow}
        transitionDuration={250}
      >
        <DialogTitle>Détails de l'indicateur</DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              }}
            >
              {Object.keys(detail)
                .filter((k) => k !== "etablissement" && detail[k] !== undefined && detail[k] !== null)
                .map((k) => {
                  const raw = detail[k];
                  const value =
                    k === "id_ess"
                      ? resolveNestedLabel("id_ess", detail, rowFk("id_ess", detail))
                      : typeof raw === "object"
                        ? JSON.stringify(raw)
                        : String(raw);
                  const label =
                    k === "id"
                      ? "ID"
                      : k === "id_ess"
                        ? "Structure"
                        : k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                        {value === "" ? "—" : value}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)} variant="contained">Fermer</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}