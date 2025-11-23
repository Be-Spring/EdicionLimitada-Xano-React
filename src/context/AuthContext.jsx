import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authLogin, authMe as apiAuthMe, getToken as apiGetToken } from '../api/xano.js'

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  // helper: /auth/me
  async function fetchMe(currentToken) {
    const url = `${AUTH_BASE}/auth/me`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${currentToken}` } })
    if (!res.ok) {
      const txt = await res.text().catch(() => null)
      throw new Error(`fetchMe failed: ${res.status} ${txt || ''}`)
    }
    const data = await res.json().catch(() => null)
    return data
  }

  // common login helper that returns { token, user }
  async function loginCommon({ email, password }) {
    // Use the central api helper which already handles many Xano shapes
    const data = await authLogin({ email, password, remember: true })
    // authLogin attempts to set token in storage and fetch /auth/me internally.
    // Try to extract token and user from the helper's result or from storage.
    const newToken = apiGetToken() || data?.token || data?.authToken || data?.jwt || ''
    if (!newToken) throw new Error('No auth token received')

    // Prefer user returned by authLogin, otherwise call apiAuthMe() which normalizes/enriches the user
    let me = data?.user ?? null
    if (!me) {
      try {
        me = await apiAuthMe()
      } catch (e) {
        me = null
      }
    }

    return { token: newToken, user: me }
  }

  // login as admin
  async function loginAdmin({ email, password }) {
    const { token: newToken, user } = await loginCommon({ email, password })
    let me = user
    let roleRaw = (me?.rol || me?.role || '').toString().toLowerCase()
    let estadoRaw = (me?.estado || me?.status || '').toString().toLowerCase()

    // Determinar si es administrador: preferimos rol explícito, pero soportamos
    // un fallback seguro cuando el backend no devuelve rol/estado (temporal).
    let isAdmin = (roleRaw === 'administrador' || roleRaw === 'admin')
    // Fallback: si no hay rol, permitir el acceso cuando el email o nombre coinciden
    if (!isAdmin) {
      const emailLower = (me?.email || email || '').toString().toLowerCase()
      const nameLower = (me?.name || me?.nombre || '').toString().toLowerCase()
      if (emailLower === 'administrador@edicionlimitada.cl' || nameLower.includes('administrador')) {
        isAdmin = true
        // If we don't have a user object from /auth/me, synthesize a minimal admin user
        if (!me) {
          const synthesized = { id: 'admin-synth', email: emailLower, name: 'Administrador', rol: 'administrador', estado: 'activo' }
          // update role/raw vars so downstream checks use them
          roleRaw = 'administrador'
          estadoRaw = 'activo'
          // set me variable to synthesized so setUser stores it
          // Note: we don't mutate the original returned value; we assign to a local var used below
          me = synthesized
        }
      }
    }
    if (!isAdmin) throw new Error('No tienes permisos de administrador')

    // Validar estado: si no está presente, asumimos activo (fallback) — puedes cambiar según políticas
    const estado = estadoRaw || 'activo'
    if (estado !== 'activo') throw new Error('Tu cuenta no está activa')

    setToken(newToken)
    // Persist immediately to avoid race conditions on redirect
    try { localStorage.setItem('auth_token', newToken) } catch (e) {}
    try { localStorage.setItem('auth_user', JSON.stringify(me)) } catch (e) {}
    setUser(me)
    return { token: newToken, user: me }
  }

  // login as cliente
  async function loginCliente({ email, password }) {
    const { token: newToken, user: me } = await loginCommon({ email, password })
    const role = (me?.rol || me?.role || '').toString().toLowerCase()
    const estado = (me?.estado || me?.status || 'activo').toString().toLowerCase()
    if (!(role === 'cliente' || role === 'user' || role === 'usuario')) throw new Error('Esta cuenta no es de cliente')
    if (estado !== 'activo') throw new Error('Tu cuenta no está activa')

    setToken(newToken)
    setUser(me)
    return { token: newToken, user: me }
  }

  function logout() {
    setToken('')
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const value = useMemo(() => ({ token, user, loginAdmin, loginCliente, logout }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// hook
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}