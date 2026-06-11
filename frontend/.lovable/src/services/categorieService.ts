import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Categorie {
  id?: number;
  libelle?: string;
}

export const categorieService = {
  list: () => api.get<Categorie[]>(API.CATEGORIES).then((r) => r.data),
  getOne: (id: number) =>
    api.get<Categorie>(`${API.CATEGORIES}/${id}`).then((r) => r.data),
  create: (data: Categorie) =>
    api.post<Categorie>(API.CATEGORIES, data).then((r) => r.data),
  update: (id: number, data: Categorie) =>
    api.put<Categorie>(`${API.CATEGORIES}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.CATEGORIES}/${id}`).then((r) => r.data),
};