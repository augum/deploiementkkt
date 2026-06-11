## Migration : TanStack Start → Vite SPA + React Router DOM

### Objectif
Transformer le projet en SPA Vite classique avec `react-router-dom`, en gardant intacts : Redux, MUI, axios, services, pages, layouts, styles SCSS, Tailwind.

### Fichiers supprimés
- `src/routes/` (tout le dossier — file-based routing TanStack)
- `src/routeTree.gen.ts`
- `src/router.tsx`
- `src/start.ts`
- `src/server.ts`
- `src/lib/error-page.ts`, `src/lib/error-capture.ts` (spécifiques SSR/Worker)
- `wrangler.jsonc`
- `src/lib/route-guards.ts` (remplacé par les composants de `src/route-guards/index.tsx`)

### Fichiers créés
- `index.html` à la racine (entrée Vite SPA standard)
- `src/main.tsx` : monte `<App />` dans `#root`, charge `styles.css` + `main.scss`
- `src/App.tsx` : `BrowserRouter`, providers (Redux, MUI Theme, ToastContainer), `AuthHydrator`, table de routes via `<Routes>`/`<Route>` pointant vers les pages existantes dans `src/pages/`
- `src/components/RouteGuards.tsx` (réutilise les composants déjà présents dans `src/route-guards/index.tsx`) pour wrapper les routes admin / gestionnaire / publiques

### Fichiers modifiés
- `vite.config.ts` : remplacé par config Vite minimale avec `@vitejs/plugin-react`, alias `@` → `src`, port sandbox conservé
- `package.json` :
  - retirer : `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-*`, `@lovable.dev/vite-tanstack-config`, `wrangler`, `@cloudflare/*`
  - ajouter : `react-router-dom`, `@vitejs/plugin-react`
  - scripts : `dev`, `build`, `preview` standards Vite
- `src/components/Sidebar.tsx` : `Link`/`useLocation` → `react-router-dom` (prop `to` reste identique)
- `src/components/Topbar.tsx` : `useNavigate` → `react-router-dom` (signature `navigate("/login")`)
- `src/pages/Login.tsx` : `useNavigate` → `react-router-dom`
- Toutes les pages (`src/pages/**`) qui importent depuis `@tanstack/react-router` : remplacer par `react-router-dom` et adapter les appels (`navigate({to:"/x"})` → `navigate("/x")`)
- `tsconfig.json` : retirer la référence à `routeTree.gen.ts` si présente
- `src/styles.css` / `src/assets/styles/main.scss` : inchangés, importés depuis `main.tsx`

### Garanti inchangé
- Tous les services axios (`src/services/*`)
- Tous les slices Redux et le store
- Tous les composants UI (DynamicForm, DynamicTable, LoadingButton, StepperForm, etc.)
- Toutes les pages métier (admin/*, gestionnaire/*)
- Le thème MUI et la palette
- Le flux d'authentification (localStorage + hydrate)

### Mapping des routes
```
/                       → redirect selon auth
/login                  → PublicRoutes > Login
/admin/dashboard        → AdminRoutes > Dashboard
/admin/utilisateurs     → AdminRoutes > Utilisateurs
/admin/etablissements   → AdminRoutes > Etablissements
/admin/categories       → AdminRoutes > Categories
/admin/sources          → AdminRoutes > Sources
/admin/roles            → AdminRoutes > Roles
/admin/consultation     → AdminRoutes > Consultation
/gestionnaire/dashboard       → GestionnaireRoutes > Dashboard
/gestionnaire/personnels      → GestionnaireRoutes > Personnels
/gestionnaire/medicaments     → GestionnaireRoutes > Medicaments
/gestionnaire/indicateurs     → GestionnaireRoutes > Indicateurs
/gestionnaire/cartographies   → GestionnaireRoutes > Cartographies
*                       → NotFound
```

### Risques / Points d'attention
- Toute page utilisant `createFileRoute`, `useRouter`, `Route.useParams`, `useLoaderData` doit être adaptée. Comme la logique métier vit déjà dans `src/pages/`, les fichiers `src/routes/*.tsx` sont essentiellement des wrappers — la suppression est sûre.
- Les imports `@tanstack/react-router` dans les pages seront recherchés via `rg` et remplacés un par un.
- Le sandbox Lovable s'attend à TanStack Start ; un Vite SPA classique fonctionne en preview mais certaines fonctionnalités spécifiques Lovable (server functions, SSR) ne seront plus disponibles — c'est le choix assumé.

### Validation
- `tsc --noEmit` clean
- Navigation manuelle login → dashboard admin / gestionnaire
- Refresh sur une route profonde (ex. `/admin/utilisateurs`) : géré par le dev server Vite avec `historyApiFallback` (par défaut sur `vite dev`)