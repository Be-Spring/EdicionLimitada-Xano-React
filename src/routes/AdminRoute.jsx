// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();

  // Si no hay token → no está logueado
  if (!token) {
    return <Navigate to="/sesion-admin" replace />;
  }

  // Si hay token pero aún no tenemos user (ej. cargando /auth/me)
  if (!user) {
    return <Navigate to="/sesion-admin" replace />;
  }

  const rol = (user.rol || "").toLowerCase();
  const estado = (user.estado || "").toLowerCase();

  // Bloquear usuarios inactivos
  if (estado !== "activo") {
    return <Navigate to="/sesion-admin" replace />;
  }

  // Bloquear usuarios que no sean administradores
  if (rol !== "administrador") {
    return <Navigate to="/" replace />;
  }

  // Todo OK → mostrar la página admin
  return children;
}