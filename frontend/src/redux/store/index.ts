import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from "@/redux/reducers/authSlice";
import etablissementReducer from "@/redux/reducers/etablissementSlice";
import categorieReducer from "@/redux/reducers/categorieSlice";
import sourceReducer from "@/redux/reducers/sourceSlice";
import utilisateurReducer from "@/redux/reducers/utilisateurSlice";
import personnelReducer from "@/redux/reducers/personnelSlice";
import medicamentReducer from "@/redux/reducers/medicamentSlice";
import indicateurReducer from "@/redux/reducers/indicateurSlice";
import cartographieReducer from "@/redux/reducers/cartographieSlice";
import roleReducer from "@/redux/reducers/roleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    etablissements: etablissementReducer,
    categories: categorieReducer,
    sources: sourceReducer,
    utilisateurs: utilisateurReducer,
    personnels: personnelReducer,
    medicaments: medicamentReducer,
    indicateurs: indicateurReducer,
    cartographies: cartographieReducer,
    roles: roleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;