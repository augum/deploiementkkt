import { createCrudSlice } from "./createCrudSlice";
import { categorieService, type Categorie } from "@/services/categorieService";

const slice = createCrudSlice<Categorie>("categories", {
  list: categorieService.list,
  create: categorieService.create,
  update: categorieService.update,
});
export const categorieThunks = slice.thunks;
export default slice.reducer;