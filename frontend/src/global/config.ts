// Configuration globale de l'application
// Toutes les requêtes API doivent utiliser BASE_URL.
export const BASE_URL = "https://api.bdomkikwit.tech";

export const API = {
  ETABLISSEMENTS: "/api/etablissements",
  CATEGORIES: "/api/categories",
  SOURCES: "/api/sources",
  ROLES: "/api/roles",
  UTILISATEURS: "/api/utilisateurs",
  PERSONNELS: "/api/personnels",
  MEDICAMENTS: "/api/medicaments",
  INDICATEURS: "/api/indicateurs",
  CARTOGRAPHIES: "/api/cartographies",
} as const;

export const REQUEST_TIMEOUT = 60000;
export const STORAGE_AUTH_KEY = "sante_auth_state";