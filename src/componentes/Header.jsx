import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.jsx'
import { authLogout } from '../api/xano'
import logoImg from '../assets/img/Logo Edicion Limitada.png'

// src/componentes/Header.jsx
export const Header = () => {
  const { items } = useContext(CartContext) || { items: [] }
  const totalCount = (items || []).reduce((s, it) => s + (it.quantity || 0), 0)
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
  })

  useEffect(() => {
    const handleAuthChange = () => {
      try { setUser(JSON.parse(localStorage.getItem('auth_user'))) } catch { setUser(null) }
    }
    // Listen for custom event when login/logout happens
    window.addEventListener('auth_changed', handleAuthChange)
    // Also listen to storage events (other tabs)
    window.addEventListener('storage', handleAuthChange)
    return () => {
      window.removeEventListener('auth_changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    try { authLogout() } catch {
      // ignore error
    }
    localStorage.removeItem('auth_user')
    window.dispatchEvent(new Event('auth_changed'))
    // show flash message
    window.dispatchEvent(new CustomEvent('flash', { detail: { text: 'Has cerrado sesión correctamente', type: 'success' } }))
    navigate('/')
  }

  return (
    <header className="fixed-top">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          {/* Logo Container */}
          <Link to="/" className="text-decoration-none">
            <div className="logo-container d-flex align-items-center">
              <img src={logoImg} alt="Logo Edición Limitada" className="navbar-logo me-2" />
              <span className="michroma-regular text-white">EDICION LIMITADA</span>
            </div>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Botones navegación */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">Productos</NavLink>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="nosotrosDropdown" data-bs-toggle="dropdown">
                  Nosotros
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/edicionlimitada">Edición Limitada</Link></li>
                  <li><NavLink className="dropdown-item" to="/disenadores">Diseñadores</NavLink></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="blogsDropdown" data-bs-toggle="dropdown">
                  Blogs
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/eventos">Eventos</Link></li>
                  <li><Link className="dropdown-item" to="/editorial">Editorial</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
              </li>
            </ul>

            {/* Botones Gestión de Sesión */}
            <div className="d-flex align-items-center">
              {user ? (
                <>
                  <span className="text-light me-3">Hola, <strong>{user.name || user.email}</strong></span>
                  <button className="btn btn-outline-light me-3" onClick={handleLogout}>Cerrar Sesión</button>
                </>
              ) : (
                <>
                  <Link to="/sesion/inicioSesion" className="btn btn-outline-light me-2">Iniciar Sesión</Link>
                  <Link to="/sesion/RegistroSesion" className="btn btn-light me-3">Regístrate</Link>
                </>
              )}
              <button className="btn btn-link text-light position-relative" id="cartButton" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" aria-controls="cartOffcanvas">
                <i className="fas fa-shopping-cart"></i>
                {totalCount > 0 && (
                  <span className="badge bg-light text-dark rounded-pill position-absolute" style={{ top: -6, right: -6, fontSize: 12 }}>{totalCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
