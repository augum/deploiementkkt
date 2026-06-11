import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Medicament {
  id?: number;
  id_ess?: number;
  periode?: string;
  capital_depart?: number;
  capital_fin_moi?: number;
  croissance?: string;
  benefice?: string;
  etablissement?: { id?: number; nom?: string; zone?: string; id_cat?: number } | null;
}

export const medicamentService = {
  list: () => api.get<Medicament[]>(API.MEDICAMENTS).then((r) => r.data),
  create: (data: Medicament) =>
    api.post<Medicament>(API.MEDICAMENTS, data).then((r) => r.data),
  update: (id: number, data: Medicament) =>
    api.patch<Medicament>(`${API.MEDICAMENTS}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.MEDICAMENTS}/${id}`).then((r) => r.data),
};