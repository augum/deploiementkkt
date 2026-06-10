import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface SourceEnergie {
  id?: number;
  libelle?: string;
  typeEnergie?: string;
}

export const sourceService = {
  list: () => api.get<SourceEnergie[]>(API.SOURCES).then((r) => r.data),
  create: (data: SourceEnergie) =>
    api.post<SourceEnergie>(API.SOURCES, data).then((r) => r.data),
  update: (id: number, data: SourceEnergie) =>
    api.patch<SourceEnergie>(`${API.SOURCES}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.SOURCES}/${id}`).then((r) => r.data),
};