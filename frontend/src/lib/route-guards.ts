import { redirect } from "@tanstack/react-router";
import { STORAGE_AUTH_KEY } from "@/global/config";
import { ROLE_ADMIN, ROLE_GESTIONNAIRE } from "@/global/constants";

type StoredAuth = {
  user?: unknown;
  role?: string | null;
  token?: string | null;
};

function readAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function requireAuth() {
  if (typeof window === "undefined") return;
  const a = readAuth();
  if (!a?.token) throw redirect({ to: "/login" });
}

export function requireAdmin() {
  if (typeof window === "undefined") return;
  const a = readAuth();
  if (!a?.token) throw redirect({ to: "/login" });
  if (a.role !== ROLE_ADMIN) throw redirect({ to: "/gestionnaire/dashboard" });
}

export function requireGestionnaire() {
  if (typeof window === "undefined") return;
  const a = readAuth();
  if (!a?.token) throw redirect({ to: "/login" });
  if (a.role !== ROLE_GESTIONNAIRE) throw redirect({ to: "/admin/dashboard" });
}

export function redirectIfAuthenticated() {
  if (typeof window === "undefined") return;
  const a = readAuth();
  if (a?.token) {
    throw redirect({ to: a.role === ROLE_ADMIN ? "/admin/dashboard" : "/gestionnaire/dashboard" });
  }
}