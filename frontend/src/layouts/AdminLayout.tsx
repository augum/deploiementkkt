import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: <PeopleIcon fontSize="small" /> },
  { to: "/admin/roles", label: "Rôles", icon: <SecurityIcon fontSize="small" /> },
  { to: "/admin/etablissements", label: "Établissements", icon: <BusinessIcon fontSize="small" /> },
  { to: "/admin/categories", label: "Catégories", icon: <CategoryIcon fontSize="small" /> },
  { to: "/admin/sources", label: "Sources d'énergie", icon: <BoltIcon fontSize="small" /> },
  { to: "/admin/consultation", label: "Rapport général", icon: <VisibilityIcon fontSize="small" /> },
];

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar brand="Admin Sclinik" items={items} />
      <div className="app-shell__main">
        <Topbar title={title} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}