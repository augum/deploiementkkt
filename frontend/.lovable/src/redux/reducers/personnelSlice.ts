import { createCrudSlice } from "./createCrudSlice";
import { personnelService, type Personnel } from "@/services/personnelService";

const slice = createCrudSlice<Personnel>("personnels", personnelService);
export const personnelThunks = slice.thunks;
export default slice.reducer;