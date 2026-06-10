import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Etablissement {
  id?: number;
  nom?: string;
  zone?: string;
  id_cat?: number;
}

export const etablissementService = {
  list: () => api.get<Etablissement[]>(API.ETABLISSEMENTS).then((r) => r.data),
  getOne: (id: number) =>
    api.get<Etablissement>(`${API.ETABLISSEMENTS}/${id}`).then((r) => r.data),
  create: (data: Etablissement) =>
    api.post<Etablissement>(API.ETABLISSEMENTS, data).then((r) => r.data),
  update: (id: number, data: Etablissement) =>
    api.patch<Etablissement>(`${API.ETABLISSEMENTS}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.ETABLISSEMENTS}/${id}`).then((r) => r.data),
};