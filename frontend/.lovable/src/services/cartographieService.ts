import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Cartographie {
  id?: number;
  id_ess?: number;
  distance_bdom?: string;
  population_cible?: string;
  id_se?: number;
  presence_blocop?: boolean;
  capacite_transfusion?: boolean;
  electricite?: string;
  eau?: string;
  reabilitation?: string;
  forage?: string;
  incinerateur?: string;
  equipement_biom?: string;
  etablissement?: { nom?: string } | null;
  sourceEnergie?: { libelle?: string } | null;
}

export const cartographieService = {
  list: () => api.get<Cartographie[]>(API.CARTOGRAPHIES).then((r) => r.data),
  create: (data: Cartographie) =>
    api.post<Cartographie>(API.CARTOGRAPHIES, data).then((r) => r.data),
  update: (id: number, data: Cartographie) =>
    api.patch<Cartographie>(`${API.CARTOGRAPHIES}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.CARTOGRAPHIES}/${id}`).then((r) => r.data),
};