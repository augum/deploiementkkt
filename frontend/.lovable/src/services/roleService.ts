import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Role {
  id?: number;
  libelle?: string;
}

export const roleService = {
  list: () => api.get<Role[]>(API.ROLES).then((r) => r.data),
  getOne: (id: number) => api.get<Role>(`${API.ROLES}/${id}`).then((r) => r.data),
  create: (data: Role) => api.post<Role>(API.ROLES, data).then((r) => r.data),
  update: (id: number, data: Role) =>
    api.patch<Role>(`${API.ROLES}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.ROLES}/${id}`).then((r) => r.data),
};