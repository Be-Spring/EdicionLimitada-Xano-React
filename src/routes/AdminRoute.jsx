// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();

  // no hay token → no está logueado
  if (!token) {
    return <Navigate to="/sesion-admin" replace />;
  }

  // si falta user → no se cargó bien /auth/me (no debería pasar)
  if (!user) {
    return <Navigate to="/sesion-admin" replace />;
  }

  const rol = (user.rol || '').toLowerCase();
  const estado = (user.estado || '').toLowerCase();

  // bloqueo por estado
  if (estado !== "activo") {
    return <Navigate to="/sesion-admin" replace />;
  }

  // bloqueo por rol incorrecto
  if (rol !== "administrador") {
    return <Navigate to="/" replace />;
  }

  // todo OK → mostrar contenido admin
  return children;
}