import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store, useAppDispatch, useAppSelector } from "@/redux/store";
import { hydrateFromStorage } from "@/redux/reducers/authSlice";
import { ROLE_ADMIN } from "@/global/constants";

import {
  PublicRoutes,
  AdminRoutes,
  GestionnaireRoutes,
} from "@/route-guards";

import LoginPage from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUtilisateurs from "@/pages/admin/Utilisateurs";
import AdminEtablissements from "@/pages/admin/Etablissements";
import AdminCategories from "@/pages/admin/Categories";
import AdminSources from "@/pages/admin/Sources";
import AdminRoles from "@/pages/admin/Roles";
import AdminConsultation from "@/pages/admin/Consultation";
import GestionnaireDashboard from "@/pages/gestionnaire/Dashboard";
import GestionnairePersonnels from "@/pages/gestionnaire/Personnels";
import GestionnaireMedicaments from "@/pages/gestionnaire/Medicaments";
import GestionnaireIndicateurs from "@/pages/gestionnaire/Indicateurs";
import GestionnaireCartographies from "@/pages/gestionnaire/Cartographies";

const theme = createTheme({
  palette: {
    primary: { main: "#0d7a5f", dark: "#064e3b" },
    secondary: { main: "#1f6feb" },
  },
  shape: { borderRadius: 8 },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' },
});

function AuthHydrator() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);
  return null;
}

function RootRedirect() {
  const { token, role } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={role === ROLE_ADMIN ? "/admin/dashboard" : "/gestionnaire/dashboard"}
      replace
    />
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
        <p>Page introuvable</p>
        <a href="/">Retour à l'accueil</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthHydrator />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/login"
              element={
                <PublicRoutes>
                  <LoginPage />
                </PublicRoutes>
              }
            />

            <Route path="/admin/dashboard" element={<AdminRoutes><AdminDashboard /></AdminRoutes>} />
            <Route path="/admin/utilisateurs" element={<AdminRoutes><AdminUtilisateurs /></AdminRoutes>} />
            <Route path="/admin/etablissements" element={<AdminRoutes><AdminEtablissements /></AdminRoutes>} />
            <Route path="/admin/categories" element={<AdminRoutes><AdminCategories /></AdminRoutes>} />
            <Route path="/admin/sources" element={<AdminRoutes><AdminSources /></AdminRoutes>} />
            <Route path="/admin/roles" element={<AdminRoutes><AdminRoles /></AdminRoutes>} />
            <Route path="/admin/consultation" element={<AdminRoutes><AdminConsultation /></AdminRoutes>} />

            <Route path="/gestionnaire/dashboard" element={<GestionnaireRoutes><GestionnaireDashboard /></GestionnaireRoutes>} />
            <Route path="/gestionnaire/personnels" element={<GestionnaireRoutes><GestionnairePersonnels /></GestionnaireRoutes>} />
            <Route path="/gestionnaire/medicaments" element={<GestionnaireRoutes><GestionnaireMedicaments /></GestionnaireRoutes>} />
            <Route path="/gestionnaire/indicateurs" element={<GestionnaireRoutes><GestionnaireIndicateurs /></GestionnaireRoutes>} />
            <Route path="/gestionnaire/cartographies" element={<GestionnaireRoutes><GestionnaireCartographies /></GestionnaireRoutes>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3500} newestOnTop />
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
}