import { createCrudSlice } from "./createCrudSlice";
import { indicateurService, type Indicateur } from "@/services/indicateurService";

const slice = createCrudSlice<Indicateur>("indicateurs", indicateurService);
export const indicateurThunks = slice.thunks;
export default slice.reducer;