import api from "@/utils/axiosInstance";
import { API } from "@/global/config";

export interface Indicateur {
  id?: number;
  periode?: string;
  id_ess?: number;
  nv_casCuratif?: number;
  cpn1?: number;
  cpn1_16?: number;
  cpn4?: number;
  apa?: number;
  nv_acc_pf?: number;
  diabeteNotification?: number;
  transfusion?: number;
  transfusionTeste4Marquer?: number;
  dc_neonat?: number;
  dc_maternel?: number;
  chirurgieMajeure?: number;
  cesarienne?: number;
  hospitalise?: number;
  dc_av48h?: number;
  dc_ap48h?: number;
  infePostOp?: number;
  diarheSimple?: number;
  etablissement?: { id?: number; nom?: string; zone?: string; id_cat?: number } | null;
}

export const indicateurService = {
  list: () => api.get<Indicateur[]>(API.INDICATEURS).then((r) => r.data),
  create: (data: Indicateur) =>
    api.post<Indicateur>(API.INDICATEURS, data).then((r) => r.data),
  update: (id: number, data: Indicateur) =>
    api.patch<Indicateur>(`${API.INDICATEURS}/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete<string>(`${API.INDICATEURS}/${id}`).then((r) => r.data),
};