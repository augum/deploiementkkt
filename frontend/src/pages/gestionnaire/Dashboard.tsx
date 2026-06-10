import { useEffect, useMemo } from "react";
import { GestionnaireLayout } from "@/layouts/GestionnaireLayout";
import { StatCard } from "@/components/StatCard";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { personnelThunks } from "@/redux/reducers/personnelSlice";
import { medicamentThunks } from "@/redux/reducers/medicamentSlice";
import { indicateurThunks } from "@/redux/reducers/indicateurSlice";
import { cartographieThunks } from "@/redux/reducers/cartographieSlice";

export default function GestionnaireDashboard() {
  const dispatch = useAppDispatch();
  const id_ess = useAppSelector((s) => s.auth.id_ess);
  const personnels = useAppSelector((s) => s.personnels.items);
  const medicaments = useAppSelector((s) => s.medicaments.items);
  const indicateurs = useAppSelector((s) => s.indicateurs.items);
  const cartographies = useAppSelector((s) => s.cartographies.items);

  useEffect(() => {
    dispatch(personnelThunks.fetchAll());
    dispatch(medicamentThunks.fetchAll());
    dispatch(indicateurThunks.fetchAll());
    dispatch(cartographieThunks.fetchAll());
  }, [dispatch]);

  const stats = useMemo(() => ({
    personnels: personnels.filter((p) => p.id_ess === id_ess).length,
    medicaments: medicaments.filter((m) => m.id_ess === id_ess).length,
    indicateurs: indicateurs.filter((i) => i.id_ess === id_ess).length,
    cartographies: cartographies.filter((c) => c.id_ess === id_ess).length,
  }), [personnels, medicaments, indicateurs, cartographies, id_ess]);

  return (
    <GestionnaireLayout title="Tableau de bord">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Bienvenue dans votre espace</h1>
        </div>
        <div className="dashboard__grid">
          <StatCard label="Rapports personnel" value={stats.personnels} hint="dans votre structure" />
          <StatCard label="Rapports médicaments" value={stats.medicaments} />
          <StatCard label="Indicateurs techniques" value={stats.indicateurs} />
          <StatCard label="Cartographies" value={stats.cartographies} />
        </div>
      </div>
    </GestionnaireLayout>
  );
}