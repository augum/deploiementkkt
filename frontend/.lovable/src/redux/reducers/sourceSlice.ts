import { createCrudSlice } from "./createCrudSlice";
import { sourceService, type SourceEnergie } from "@/services/sourceService";

const slice = createCrudSlice<SourceEnergie>("sources", sourceService);
export const sourceThunks = slice.thunks;
export default slice.reducer;