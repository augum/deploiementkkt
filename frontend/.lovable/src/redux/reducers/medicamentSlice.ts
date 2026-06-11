import { createCrudSlice } from "./createCrudSlice";
import { medicamentService, type Medicament } from "@/services/medicamentService";

const slice = createCrudSlice<Medicament>("medicaments", medicamentService);
export const medicamentThunks = slice.thunks;
export default slice.reducer;