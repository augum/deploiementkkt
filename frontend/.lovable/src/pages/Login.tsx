import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, Stack, Alert } from "@mui/material";
import { LoadingButton } from "@/components/LoadingButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { loginThunk } from "@/redux/reducers/authSlice";
import { ROLE_ADMIN } from "@/global/constants";

const schema = yup.object({
  login: yup.string().required("Le login est obligatoire"),
  password: yup.string().required("Le mot de passe est obligatoire"),
});

type FormValues = { login: string; password: string };

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user, role } = useAppSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { login: "", password: "" },
  });

  useEffect(() => {
    if (user && role) {
      navigate(role === ROLE_ADMIN ? "/admin/dashboard" : "/gestionnaire/dashboard");
    }
  }, [user, role, navigate]);

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(loginThunk(values));
    if (loginThunk.fulfilled.match(result)) {
      toast.success("Connexion réussie");
    } else {
      toast.error("Échec de la connexion");
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-page__brand">Sclinik</h1>
      <div className="auth-page__subtitle">Connectez-vous à votre espace</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Login" fullWidth required autoFocus
            {...register("login")}
            error={!!errors.login} helperText={errors.login?.message}
          />
          <TextField
            label="Mot de passe" type="password" fullWidth required
            {...register("password")}
            error={!!errors.password} helperText={errors.password?.message}
          />
          <LoadingButton type="submit" variant="contained" size="large" loading={loading} loadingLabel="Connexion...">
            Se connecter
          </LoadingButton>
        </Stack>
      </form>
    </AuthLayout>
  );
}