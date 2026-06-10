import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAppSelector } from "@/redux/store";
import { ROLE_ADMIN, ROLE_GESTIONNAIRE } from "@/global/constants";

/**
 * Composants de garde réutilisables (API "react-router-dom-like").
 * Le câblage principal est fait via `beforeLoad` dans les fichiers de routes,
 * mais ces composants restent disponibles pour des protections au niveau UI.
 */

export function PublicRoutes({ children }: { children: ReactNode }) {
  const { token, role } = useAppSelector((s) => s.auth);
  if (token) {
    return <Navigate to={role === ROLE_ADMIN ? "/admin/dashboard" : "/gestionnaire/dashboard"} />;
  }
  return <>{children}</>;
}

export function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { token } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

export function AdminRoutes({ children }: { children: ReactNode }) {
  const { token, role } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" />;
  if (role !== ROLE_ADMIN) return <Navigate to="/gestionnaire/dashboard" />;
  return <>{children}</>;
}

export function GestionnaireRoutes({ children }: { children: ReactNode }) {
  const { token, role } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" />;
  if (role !== ROLE_GESTIONNAIRE) return <Navigate to="/admin/dashboard" />;
  return <>{children}</>;
}