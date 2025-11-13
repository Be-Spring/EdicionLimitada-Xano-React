import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authLogin, authSignup, authMe, authLogout as apiLogout } from '../api/xano'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const authUser = localStorage.getItem('auth_user')
      return authUser ? JSON.parse(authUser) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const authUser = localStorage.getItem('auth_user')
        setUser(authUser ? JSON.parse(authUser) : null)
      } catch (e) {
        setUser(null)
      }
    }

    window.addEventListener('auth_changed', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('auth_changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  // register a new user and update context
  const register = useCallback(async ({ name, email, password, remember = true } = {}) => {
    const data = await authSignup({ name, email, password, remember })
    // try to get user info
    try {
      const me = await authMe()
      if (me) {
        localStorage.setItem('auth_user', JSON.stringify(me))
        setUser(me)
      }
    } catch (e) {
      // ignore
    }
    // notify other listeners
    window.dispatchEvent(new Event('auth_changed'))
    return data
  }, [])

  // login existing user and update context
  const login = useCallback(async ({ email, password, remember = true } = {}) => {
    const data = await authLogin({ email, password, remember })
    // Prefer user returned by authLogin (some backends include it), else call authMe
    const returnedUser = data?.user ?? null
    if (returnedUser) {
      try {
        localStorage.setItem('auth_user', JSON.stringify(returnedUser))
      } catch (e) {}
      setUser(returnedUser)
      window.dispatchEvent(new Event('auth_changed'))
      return returnedUser
    }

    try {
      const me = await authMe()
      if (me) {
        try {
          localStorage.setItem('auth_user', JSON.stringify(me))
        } catch (e) {}
        setUser(me)
        window.dispatchEvent(new Event('auth_changed'))
        return me
      }
    } catch (e) {
      // ignore
    }

    window.dispatchEvent(new Event('auth_changed'))
    return data
  }, [])

  const logout = useCallback(() => {
    try {
      apiLogout()
    } catch (e) {}
    localStorage.removeItem('auth_user')
    setUser(null)
    window.dispatchEvent(new Event('auth_changed'))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export default AuthContext
