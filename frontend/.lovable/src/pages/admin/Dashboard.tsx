import { useEffect, useMemo, useState } from "react";
import { TextField, Stack } from "@mui/material";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StatCard } from "@/components/StatCard";
import { DynamicTable } from "@/components/DynamicTable";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { etablissementThunks } from "@/redux/reducers/etablissementSlice";
import { personnelThunks } from "@/redux/reducers/personnelSlice";
import { medicamentThunks } from "@/redux/reducers/medicamentSlice";
import { indicateurThunks } from "@/redux/reducers/indicateurSlice";
import { utilisateurThunks } from "@/redux/reducers/utilisateurSlice";
import { aggregateByKey, filterByDateRange } from "@/utils/aggregate";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const etablissements = useAppSelector((s) => s.etablissements.items);
  const utilisateurs = useAppSelector((s) => s.utilisateurs.items);
  const personnels = useAppSelector((s) => s.personnels.items);
  const medicaments = useAppSelector((s) => s.medicaments.items);
  const indicateurs = useAppSelector((s) => s.indicateurs.items);

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  useEffect(() => {
    dispatch(etablissementThunks.fetchAll());
    dispatch(utilisateurThunks.fetchAll());
    dispatch(personnelThunks.fetchAll());
    dispatch(medicamentThunks.fetchAll());
    dispatch(indicateurThunks.fetchAll());
  }, [dispatch]);

  const filteredIndic = useMemo(
    () =>
      filterByDateRange(
        indicateurs as unknown as Record<string, unknown>[],
        "periode",
        from || null,
        to || null,
      ),
    [indicateurs, from, to],
  );
  const aggregatedIndic = useMemo(
    () => aggregateByKey(filteredIndic, "id_ess"),
    [filteredIndic],
  );

  const columns = [
    { field: "id_ess", headerName: "Structure (ID)", width: 140 },
    { field: "nv_casCuratif", headerName: "Cas curatifs", flex: 1 },
    { field: "hospitalise", headerName: "Hospit.", flex: 1 },
    { field: "cesarienne", headerName: "Césariennes", flex: 1 },
    { field: "dc_maternel", headerName: "DC maternels", flex: 1 },
    { field: "transfusion", headerName: "Transfusions", flex: 1 },
  ];

  return (
    <AdminLayout title="Dashboard administrateur">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Vue d'ensemble</h1>

        </div>

        <div className="dashboard__grid">
          <StatCard label="Établissements" value={etablissements.length} />
          <StatCard label="Utilisateurs" value={utilisateurs.length} />
          <StatCard label="Rapports personnel" value={personnels.length} />
          <StatCard label="Rapports médicaments" value={medicaments.length} />
          <StatCard label="Rapports indicateurs (filtrés)" value={filteredIndic.length} />
        </div>

      </div>
    </AdminLayout>
  );
}