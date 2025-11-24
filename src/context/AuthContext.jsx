// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authLoginAdmin, authLoginCliente, authMe, getToken } from '../api/xano.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken() || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });

  // Si hay token pero no user (por ejemplo al recargar la página) → pedir /auth/me
  useEffect(() => {
    if (!token || user) return;
    (async () => {
      const me = await authMe();
      if (me) {
        setUser(me);
        try { localStorage.setItem('auth_user', JSON.stringify(me)); } catch {}
      }
    })();
  }, [token, user]);

  // ---------- LOGIN ADMIN ----------
  async function loginAdmin({ email, password }) {
    // 1) Login: solo me importa el token
    const { token: t } = await authLoginAdmin({
      email,
      password,
      remember: true,
    });
    if (!t) throw new Error('Sin token de autenticación');

    // 2) Guardar token en estado
    setToken(t);

    // 3) Pedir SIEMPRE /auth/me para obtener usuario completo
    const me = await authMe();
    if (!me) throw new Error('No se pudo obtener datos de usuario');

    // 4) Validar rol/estado si quieres (opcional ahora mismo)
    const rol = (me.rol || '').toLowerCase();
    const estado = (me.estado || '').toLowerCase();

    if (rol !== 'administrador') {
      throw new Error('No tienes permisos de administrador');
    }
    if (estado !== 'activo') {
      throw new Error('Tu cuenta no está activa');
  }

    // 5) Guardar usuario en estado y en localStorage
    setUser(me);
    try { localStorage.setItem('auth_user', JSON.stringify(me)); } catch {}


    return { token: t, user: me };
  }

  // ---------- LOGIN CLIENTE ----------
  async function loginCliente({ email, password }) {
    // 1) Login cliente
    const { token: t } = await authLoginCliente({
      email,
      password,
      remember: true,
    });
    if (!t) throw new Error('Sin token de autenticación');

    // 2) Guardar token
    setToken(t);

    // 3) Pedir SIEMPRE /auth/me
    const me = await authMe();
    if (!me) throw new Error('No se pudo obtener datos de usuario');


    // 4) Validar rol/estado si quieres después
    const rol = (me.rol || '').toLowerCase();
    const estado = (me.estado || '').toLowerCase();

    if (rol !== 'cliente') {
      throw new Error('Esta cuenta no es de cliente');
    }
    if (estado !== 'activo') {
      throw new Error('Tu cuenta no está activa');
    }

    // 5) Guardar usuario
    setUser(me);
    try { localStorage.setItem('auth_user', JSON.stringify(me)); } catch {}

    
    return { token: t, user: me };
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
  }

  // ---------- REFRESH USER ----------
  async function refreshUser() {
    const me = await authMe();
    if (!me) return null;
    setUser(me);
    try { localStorage.setItem('auth_user', JSON.stringify(me)); } catch {}
    return me;
  }

  const value = useMemo(
    () => ({ token, user, loginAdmin, loginCliente, logout, refreshUser }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}