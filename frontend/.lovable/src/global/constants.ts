export const ROLE_ADMIN = "ADMIN";
export const ROLE_GESTIONNAIRE = "GESTIONNAIRE";

// id_role par défaut basé sur la convention backend (Swagger ne fournit pas le mapping).
// L'admin est considéré comme tout utilisateur dont id_ess est null/0.
export const isAdminUser = (u: { id_ess?: number | null }) =>
  u.id_ess === null || u.id_ess === undefined || u.id_ess === 0;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];