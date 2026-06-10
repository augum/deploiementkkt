import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Personnel {
  id?: number;
  id_ess?: number;
  nb_agent_matricule?: number;
  nb_agent_nu?: number;
  nb_nv_agent_matricule?: number;
  nb_nv_agent_salaireEtat?: number;
  nb_nv_agent_primeEtat?: number;
  nb_agent_primeLocale?: number;
  etablissement?: { id?: number; nom?: string; zone?: string; id_cat?: number } | null;
}

export const personnelService = {
  list: () => api.get<Personnel[]>(API.PERSONNELS).then((r) => r.data),
  create: (data: Personnel) =>
    api.post<Personnel>(API.PERSONNELS, data).then((r) => r.data),
  update: (id: number, data: Personnel) =>
    api.patch<Personnel>(`${API.PERSONNELS}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.PERSONNELS}/${id}`).then((r) => r.data),
};