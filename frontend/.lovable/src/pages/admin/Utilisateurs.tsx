import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Button, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { AdminLayout } from "@/layouts/AdminLayout";
import { DynamicTable } from "@/components/DynamicTable";
import { DynamicForm, type FieldDef } from "@/components/DynamicForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExportCsvButton } from "@/components/ExportCsvButton";
import { ExportExcelButton } from "@/components/ExportExcelButton";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { utilisateurThunks } from "@/redux/reducers/utilisateurSlice";
import { etablissementThunks } from "@/redux/reducers/etablissementSlice";
import { roleThunks } from "@/redux/reducers/roleSlice";
import type { Utilisateur } from "@/services/utilisateurService";
import { utilisateurService } from "@/services/utilisateurService";
import { flattenRowForExport, resolveNestedLabel, rowFk } from "@/utils/normalizeRow";
import { generateStrongPassword, validatePassword } from "@/utils/password";

const emptyValues: Utilisateur = { nom: "", postnom: "", prenom: "", login: "", email: "", password: "", id_role: 0, id_ess: null };

function normalizeForLogin(s: string): string {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function buildUniqueLogin(nom: string, prenom: string, existing: string[]): string {
  const n = normalizeForLogin(nom);
  const p = normalizeForLogin(prenom);
  if (!n || !p) return "";
  const base = `${n}.${p}`;
  const set = new Set(existing.map((l) => (l || "").trim().toLowerCase()));
  if (!set.has(base)) return base;
  let i = 1;
  while (set.has(`${base}${i}`)) i++;
  return `${base}${i}`;
}

export default function AdminUtilisateurs() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.utilisateurs);
  const etablissements = useAppSelector((s) => s.etablissements.items);
  const roles = useAppSelector((s) => s.roles.items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Utilisateur | null>(null);
  const [toDelete, setToDelete] = useState<Utilisateur | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [detailLoading, setDetailLoading] = useState(false);

  const schema = useMemo(() => {
    const shape: Record<string, yup.AnySchema> = {
      nom: yup.string().required("Nom obligatoire"),
      postnom: yup.string().required("Postnom obligatoire"),
      prenom: yup.string().required("Prénom obligatoire"),
      login: yup.string().required("Login obligatoire"),
      email: yup.string().email("Adresse e-mail invalide").required("E-mail obligatoire"),
      password: yup
        .string()
        .required("Mot de passe obligatoire")
        .test("password-rules", "Mot de passe invalide", function (value) {
          const err = validatePassword(value ?? "");
          return err ? this.createError({ message: err }) : true;
        }),
      id_role: yup.number().typeError("Rôle obligatoire").required(),
      id_ess: yup.number().nullable(),
    };

    if (!editing) {
      shape.login = (shape.login as yup.StringSchema)
        .test("unique-login", "Login existant", (value) => {
          if (!value) return true;
          const normalized = value.trim().toLowerCase();
          return !items.some(
            (u) => (u.login ?? "").trim().toLowerCase() === normalized,
          );
        });
      shape.email = (shape.email as yup.StringSchema)
        .test("unique-email", "Email existant", (value) => {
          if (!value) return true;
          const normalized = value.trim().toLowerCase();
          return !items.some(
            (u) => (u.email ?? "").trim().toLowerCase() === normalized,
          );
        });
    }

    return yup.object(shape);
  }, [items, editing]);

  useEffect(() => {
    if (open && !editing) {
      setGeneratedPassword(generateStrongPassword());
    }
  }, [open, editing]);

  useEffect(() => {
    dispatch(utilisateurThunks.fetchAll());
    dispatch(etablissementThunks.fetchAll());
    dispatch(roleThunks.fetchAll());
  }, [dispatch]);

  const fields: FieldDef[] = useMemo(() => [
    { name: "nom", label: "Nom", required: true },
    { name: "postnom", label: "Postnom", required: true },
    { name: "prenom", label: "Prénom", required: true },
    {
      name: "login",
      label: "Login",
      required: true,
      readOnly: true,
      helperText: editing
        ? "Login non modifiable."
        : "Login généré automatiquement à partir du nom et du prénom.",
      compute: editing
        ? undefined
        : (vals) => {
            const nom = String(vals.nom ?? "");
            const prenom = String(vals.prenom ?? "");
            const others = items.map((u: Utilisateur) => u.login ?? "");
            return buildUniqueLogin(nom, prenom, others);
          },
    },
    { name: "email", label: "E-mail", required: true },
    {
      name: "password",
      label: "Mot de passe",
      type: "password",
      required: true,
      showCriteria: true,
      helperText: editing
        ? "Cliquez sur le bouton ci-dessous pour générer un nouveau mot de passe conforme."
        : "Mot de passe généré automatiquement (≥8 car., majuscule, minuscule, 1–2 caractères spéciaux).",
      action: {
        label: editing ? "Regénérer le mot de passe" : "Générer un nouveau mot de passe",
        onClick: () => {
          const pwd = generateStrongPassword();
          if (!editing) setGeneratedPassword(pwd);
          return pwd;
        },
      },
    },
    {
      name: "id_role", label: "Rôle", type: "select", required: true,
      options: roles.map((r) => ({ value: r.id ?? 0, label: r.libelle ?? "—" })),
    },
    {
      name: "id_ess", label: "Structure de santé", type: "select",
      options: [{ value: 0, label: "Aucune (admin)" }, ...etablissements.map((e) => ({ value: e.id ?? 0, label: e.nom ?? `#${e.id}` }))],
    },
  ], [editing, roles, etablissements, items]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "login", headerName: "Login", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    {
      field: "id_role",
      headerName: "Rôle",
      flex: 1,
      valueGetter: (_v: unknown, row: Record<string, unknown>) => {
        const fk = rowFk("id_role", row);
        return resolveNestedLabel("id_role", row, fk);
      },
    },
    {
      field: "id_ess",
      headerName: "Structure",
      flex: 1,
      valueGetter: (_v: unknown, row: Record<string, unknown>) => {
        const fk = rowFk("id_ess", row);
        if (fk == null || fk === 0) return "—";
        return resolveNestedLabel("id_ess", row, fk);
      },
    },
  ];

  const handleSubmit = async (values: Utilisateur) => {
    const payload = { ...values, id_ess: values.id_ess ? Number(values.id_ess) : null };
    const action = editing?.id
      ? await dispatch(utilisateurThunks.updateOne({ id: editing.id, data: { ...payload, id: editing.id } }))
      : await dispatch(utilisateurThunks.createOne(payload));
    const ok =
      utilisateurThunks.createOne.fulfilled.match(action) ||
      utilisateurThunks.updateOne.fulfilled.match(action);
    if (ok) {
      toast.success(editing ? "Utilisateur modifié avec succès" : "Utilisateur créé avec succès");
      setOpen(false);
      setEditing(null);
      dispatch(utilisateurThunks.fetchAll());
    } else {
      const msg = (action as { payload?: unknown }).payload;
      const msgStr = typeof msg === "string" ? msg : "";
      const isTimeout = /timeout|ECONNABORTED|Network Error/i.test(msgStr);
      // En cas de timeout/erreur réseau, vérifier si l'opération a réellement abouti
      if (isTimeout || !msgStr) {
        try {
          const fresh = await utilisateurService.list();
          const exists = editing?.id
            ? fresh.some((u) => u.id === editing.id && (u.email ?? "").toLowerCase() === (payload.email ?? "").toLowerCase())
            : fresh.some((u) => (u.login ?? "").toLowerCase() === (payload.login ?? "").toLowerCase()
                             || (u.email ?? "").toLowerCase() === (payload.email ?? "").toLowerCase());
          if (exists) {
            toast.success(editing ? "Utilisateur modifié avec succès" : "Utilisateur créé avec succès");
            setOpen(false);
            setEditing(null);
            dispatch(utilisateurThunks.fetchAll());
            return;
          }
        } catch {
          /* ignore — afficher l'erreur ci-dessous */
        }
      }
      toast.error(msgStr || "Erreur lors de l'enregistrement");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    const r = await dispatch(utilisateurThunks.removeOne(toDelete.id));
    if (utilisateurThunks.removeOne.fulfilled.match(r)) toast.success("Supprimé");
    setToDelete(null);
  };

  return (
    <AdminLayout title="Utilisateurs">
      <div className="table-card">
        <Stack direction="row" spacing={2} className="toolbar">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }}>
            Nouvel utilisateur
          </Button>
          <ExportCsvButton filename="utilisateurs" rows={(items as unknown as Record<string, unknown>[]).map(flattenRowForExport)} />
          <ExportExcelButton filename="utilisateurs" rows={(items as unknown as Record<string, unknown>[]).map(flattenRowForExport)} />
        </Stack>
        <DynamicTable rows={items} columns={columns} loading={loading}
          onEdit={async (r) => {
            setDetailLoading(true);
            try {
              const full = await utilisateurService.getOne(r.id!);
              setEditing(full);
              setOpen(true);
            } catch {
              toast.error("Impossible de charger les détails de l'utilisateur");
            } finally {
              setDetailLoading(false);
            }
          }}
          onDelete={(r) => setToDelete(r)} />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Modifier" : "Nouvel"} utilisateur</DialogTitle>
        <DialogContent>
          <DynamicForm
            fields={fields}
            schema={schema as never}
            defaultValues={editing
              ? {
                  ...emptyValues,
                  ...editing,
                  nom: editing.nom ?? "",
                  postnom: editing.postnom ?? "",
                  prenom: editing.prenom ?? "",
                  id_ess: editing.id_ess ?? 0,
                }
              : { ...emptyValues, password: generatedPassword }}
            onSubmit={(v) => handleSubmit(v as Utilisateur)}
            onCancel={() => setOpen(false)}
            loading={loading || detailLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        message="Supprimer cet utilisateur ?"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={loading}
      />
    </AdminLayout>
  );
}