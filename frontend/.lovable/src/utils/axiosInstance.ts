import axios, { type AxiosError } from "axios";
import { BASE_URL, REQUEST_TIMEOUT, STORAGE_AUTH_KEY } from "@/global/config";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Interceptor requête : ajoute le token si présent
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      /* ignore */
    }
  }
  return config;
});

// Interceptor réponse : gestion globale des erreurs HTTP
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_AUTH_KEY);
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;