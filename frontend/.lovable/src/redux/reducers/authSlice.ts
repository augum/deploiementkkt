import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { type Utilisateur } from "@/services/utilisateurService";
import { STORAGE_AUTH_KEY } from "@/global/config";
import { isAdminUser, ROLE_ADMIN, ROLE_GESTIONNAIRE } from "@/global/constants";

export interface AuthState {
  user: Utilisateur | null;
  id_ess: number | null;
  role: typeof ROLE_ADMIN | typeof ROLE_GESTIONNAIRE | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  id_ess: null,
  role: null,
  token: null,
  loading: false,
  error: null,
  hydrated: false,
};

export const loginThunk = createAsyncThunk<
  Utilisateur,
  { login: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ login, password }, { rejectWithValue }) => {
  try {
    const user = await authService.login(login, password);
    return user;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur de connexion";
    return rejectWithValue(msg);
  }
});

const persist = (state: AuthState) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_AUTH_KEY,
      JSON.stringify({
        user: state.user,
        id_ess: state.id_ess,
        role: state.role,
        token: state.token,
      }),
    );
  } catch {
    /* ignore */
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.id_ess = null;
      state.role = null;
      state.token = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    },
    hydrateFromStorage(state) {
      state.hydrated = true;
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem(STORAGE_AUTH_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<AuthState>;
        state.user = parsed.user ?? null;
        state.id_ess = parsed.id_ess ?? null;
        state.role = parsed.role ?? null;
        state.token = parsed.token ?? null;
      } catch {
        /* ignore */
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        const u = action.payload;
        state.user = u;
        state.id_ess = u.id_ess ?? null;
        state.role = isAdminUser(u) ? ROLE_ADMIN : ROLE_GESTIONNAIRE;
        // Pas de token côté backend Swagger : on stocke un placeholder pour persister la session.
        state.token = `local-${u.id ?? "anon"}`;
        persist(state);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Erreur de connexion";
      });
  },
});

export const { logout, hydrateFromStorage, setError } = authSlice.actions;
export default authSlice.reducer;