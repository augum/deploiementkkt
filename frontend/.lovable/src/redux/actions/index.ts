// Centralisation des thunks (actions asynchrones) Redux Toolkit.
export { loginThunk, logout, hydrateFromStorage } from "@/redux/reducers/authSlice";
export { etablissementThunks } from "@/redux/reducers/etablissementSlice";
export { categorieThunks } from "@/redux/reducers/categorieSlice";
export { sourceThunks } from "@/redux/reducers/sourceSlice";
export { utilisateurThunks } from "@/redux/reducers/utilisateurSlice";
export { personnelThunks } from "@/redux/reducers/personnelSlice";
export { medicamentThunks } from "@/redux/reducers/medicamentSlice";
export { indicateurThunks } from "@/redux/reducers/indicateurSlice";
export { cartographieThunks } from "@/redux/reducers/cartographieSlice";
export { roleThunks } from "@/redux/reducers/roleSlice";