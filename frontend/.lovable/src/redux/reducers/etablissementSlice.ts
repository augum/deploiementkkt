import { createCrudSlice } from "./createCrudSlice";
import { etablissementService, type Etablissement } from "@/services/etablissementService";

const slice = createCrudSlice<Etablissement>("etablissements", etablissementService);
export const etablissementThunks = slice.thunks;
export default slice.reducer;