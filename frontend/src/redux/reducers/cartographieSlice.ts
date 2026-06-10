import { createCrudSlice } from "./createCrudSlice";
import { cartographieService, type Cartographie } from "@/services/cartographieService";

const slice = createCrudSlice<Cartographie>("cartographies", cartographieService);
export const cartographieThunks = slice.thunks;
export default slice.reducer;