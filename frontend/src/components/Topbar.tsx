import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout } from "@/redux/reducers/authSlice";

export function Topbar({ title }: { title: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__user">
        <span>{user?.login ?? "Utilisateur"}</span>
        <Button size="small" variant="text" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
    </header>
  );
}