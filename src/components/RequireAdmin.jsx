import useAuth from "@/hooks/useAuth";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const { auth } = useAuth();
  const isAdmin = auth.role === "SALON";
  const location = useLocation();
  return !isAdmin ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
