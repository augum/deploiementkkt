import { createCrudSlice } from "./createCrudSlice";
import { utilisateurService, type Utilisateur } from "@/services/utilisateurService";

const slice = createCrudSlice<Utilisateur>("utilisateurs", utilisateurService);
export const utilisateurThunks = slice.thunks;
export default slice.reducer;