import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CrudService<T> {
  list: () => Promise<T[]>;
  create?: (data: T) => Promise<T>;
  update?: (id: number, data: T) => Promise<T>;
  remove?: (id: number) => Promise<unknown>;
}

export interface CrudState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

type InternalCrudState<T> = CrudState<T> & {
  pendingRequests: Record<string, true>;
};

// Note: on utilise `any` localement pour le state interne afin d'éviter les
// conflits de Draft<T> avec les contraintes génériques d'Immer.
export function createCrudSlice<T extends { id?: number }>(
  name: string,
  service: CrudService<T>,
) {
  const fetchAll = createAsyncThunk<T[], void, { rejectValue: string }>(
    `${name}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        return await service.list();
      } catch (e) {
        return rejectWithValue(e instanceof Error ? e.message : "Erreur de chargement");
      }
    },
  );

  const createOne = createAsyncThunk<T, T, { rejectValue: string }>(
    `${name}/create`,
    async (data, { rejectWithValue }) => {
      try {
        if (!service.create) throw new Error("Création non autorisée");
        return await service.create(data);
      } catch (e) {
        return rejectWithValue(e instanceof Error ? e.message : "Erreur de création");
      }
    },
  );

  const updateOne = createAsyncThunk<
    T,
    { id: number; data: T },
    { rejectValue: string }
  >(`${name}/update`, async ({ id, data }, { rejectWithValue }) => {
    try {
      if (!service.update) throw new Error("Modification non autorisée");
      return await service.update(id, data);
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : "Erreur de modification");
    }
  });

  const removeOne = createAsyncThunk<number, number, { rejectValue: string }>(
    `${name}/remove`,
    async (id, { rejectWithValue }) => {
      try {
        if (!service.remove) throw new Error("Suppression non autorisée");
        await service.remove(id);
        return id;
      } catch (e) {
        return rejectWithValue(e instanceof Error ? e.message : "Erreur de suppression");
      }
    },
  );

  const initialState: InternalCrudState<T> = {
    items: [] as T[],
    loading: false,
    error: null,
    pendingRequests: {},
  };

  const startLoading = (state: any, requestId: string) => {
    state.pendingRequests[requestId] = true;
    state.loading = true;
    state.error = null;
  };

  const stopLoading = (state: any, requestId: string) => {
    delete state.pendingRequests[requestId];
    state.loading = Object.keys(state.pendingRequests).length > 0;
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      reset(state) {
        state.items = [] as never;
        state.loading = false;
        state.error = null;
        state.pendingRequests = {};
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.pending, (s, a) => {
          startLoading(s, a.meta.requestId);
        })
        .addCase(fetchAll.fulfilled, (s, a) => {
          stopLoading(s, a.meta.requestId);
          s.items = a.payload as never;
        })
        .addCase(fetchAll.rejected, (s, a) => {
          stopLoading(s, a.meta.requestId);
          s.error = a.payload ?? "Erreur";
        })
        .addCase(createOne.pending, (s, a) => { startLoading(s, a.meta.requestId); })
        .addCase(createOne.fulfilled, (s, a) => {
          stopLoading(s, a.meta.requestId);
          (s.items as T[]).push(a.payload);
        })
        .addCase(createOne.rejected, (s, a) => { stopLoading(s, a.meta.requestId); s.error = a.payload ?? "Erreur"; })
        .addCase(updateOne.pending, (s, a) => { startLoading(s, a.meta.requestId); })
        .addCase(updateOne.fulfilled, (s, a) => {
          stopLoading(s, a.meta.requestId);
          const arr = s.items as T[];
          const i = arr.findIndex((x) => x.id === a.payload.id);
          if (i >= 0) arr[i] = a.payload as never;
        })
        .addCase(updateOne.rejected, (s, a) => { stopLoading(s, a.meta.requestId); s.error = a.payload ?? "Erreur"; })
        .addCase(removeOne.pending, (s, a) => { startLoading(s, a.meta.requestId); })
        .addCase(removeOne.fulfilled, (s, a) => {
          stopLoading(s, a.meta.requestId);
          s.items = (s.items as T[]).filter((x) => x.id !== a.payload) as never;
        })
        .addCase(removeOne.rejected, (s, a) => { stopLoading(s, a.meta.requestId); s.error = a.payload ?? "Erreur"; });
    },
  });

  return {
    reducer: slice.reducer as unknown as import("@reduxjs/toolkit").Reducer<CrudState<T>>,
    actions: slice.actions,
    thunks: { fetchAll, createOne, updateOne, removeOne },
  };
}