// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authLogin, authLoginCliente, authMe, getToken } from '../api/xano.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken() || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });

  // si tenemos token pero no user (ej. recarga de página), pedir /auth/me
  useEffect(() => {
    if (!token || user) return;
    (async () => {
      const me = await authMe();
      if (me) setUser(me);
    })();
  }, [token, user]);

  // LOGIN ADMIN (usa /auth/login)
  async function loginAdmin({ email, password }) {
    const { token: t, user: u } = await authLogin({ email, password, remember: true });
    if (!t) throw new Error('Sin token');
    setToken(t);
    setUser(u || (await authMe()));
    return { token: t, user: u };
  }

  // LOGIN CLIENTE (usa /auth/login_cliente)
  async function loginCliente({ email, password }) {
    const { token: t, user: u } = await authLoginCliente({
      email,
      password,
      remember: true,
    });
    if (!t) throw new Error('Sin token');
    setToken(t);
    setUser(u || (await authMe()));
    return { token: t, user: u };
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
  }

  const value = useMemo(
    () => ({ token, user, loginAdmin, loginCliente, logout }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}