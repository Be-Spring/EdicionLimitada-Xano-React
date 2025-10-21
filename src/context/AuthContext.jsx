import React, { createContext, useContext, useState, useEffect } from 'react'

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

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
