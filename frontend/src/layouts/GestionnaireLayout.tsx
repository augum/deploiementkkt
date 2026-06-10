import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BadgeIcon from "@mui/icons-material/Badge";
import MedicationIcon from "@mui/icons-material/Medication";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MapIcon from "@mui/icons-material/Map";

const items = [
  { to: "/gestionnaire/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { to: "/gestionnaire/personnels", label: "Personnels", icon: <BadgeIcon fontSize="small" /> },
  { to: "/gestionnaire/medicaments", label: "Médicaments", icon: <MedicationIcon fontSize="small" /> },
  { to: "/gestionnaire/indicateurs", label: "Indicateurs", icon: <AnalyticsIcon fontSize="small" /> },
  { to: "/gestionnaire/cartographies", label: "Cartographies", icon: <MapIcon fontSize="small" /> },
];

export function GestionnaireLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar brand="Ma Structure" items={items} />
      <div className="app-shell__main">
        <Topbar title={title} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}