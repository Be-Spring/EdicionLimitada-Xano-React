import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Simple AdminRoute: allow access only to a user with the admin email.
// This is intentionally lightweight (UI-only auth check). Replace with role-based
// logic or server-side checks when you wire the backend.
export default function AdminRoute({ children }){
  const { user } = useAuth()

  if (!user) return <Navigate to="/sesion" replace />

  // Prefer role-based check (matches your Xano `user.rol` enum).
  const role = (user.rol || user.role || '').toString().toLowerCase()
  const estado = (user.estado || user.status || '').toString().toLowerCase() || 'activo'
  const isAdmin = role === 'administrador' || role === 'admin'

  // If account is not active, send to login so they know it's blocked.
  if (estado !== 'activo') return <Navigate to="/sesion" replace />

  // If user is authenticated but not admin, redirect to normal home (not to login)
  if (!isAdmin) return <Navigate to="/" replace />

  return children
}
