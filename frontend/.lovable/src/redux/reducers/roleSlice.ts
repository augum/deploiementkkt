import { createCrudSlice } from "./createCrudSlice";
import { roleService, type Role } from "@/services/roleService";

const slice = createCrudSlice<Role>("roles", roleService);
export const roleThunks = slice.thunks;
export default slice.reducer;