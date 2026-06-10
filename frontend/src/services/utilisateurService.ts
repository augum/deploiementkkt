import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Utilisateur {
  id?: number;
  nom?: string;
  postnom?: string;
  prenom?: string;
  login?: string;
  email?: string;
  password?: string;
  id_role?: number;
  id_ess?: number | null;
}

export const utilisateurService = {
  list: () => api.get<Utilisateur[]>(API.UTILISATEURS).then((r) => r.data),
  getOne: (id: number) =>
    api.get<Utilisateur>(`${API.UTILISATEURS}/${id}`).then((r) => r.data),
  create: (data: Utilisateur) =>
    api.post<Utilisateur>(API.UTILISATEURS, data).then((r) => r.data),
  update: (id: number, data: Utilisateur) =>
    api.patch<Utilisateur>(`${API.UTILISATEURS}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.UTILISATEURS}/${id}`).then((r) => r.data),
};