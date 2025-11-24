import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import './Sidebar.css'
import logoImg from '../../../../assets/img/Logo Edicion Limitada.png'

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    try { logout() } catch (e) {}
    navigate('/sesion')
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <Link to="/administrador" className="text-decoration-none">
            <div className="logo-container d-flex align-items-center">
              <img src={logoImg} alt="Logo Edición Limitada" className="navbar-logo me-2" />
              <span className="michroma-regular brand-title">Administrador</span>
            </div>
        </Link>
      </div>


      <nav className="admin-nav">
        <NavLink to="/administrador" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </NavLink>

        <NavLink to="/administrador/productos" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Productos</span>
        </NavLink>

        <NavLink to="/administrador/usuarios" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">👥</span>
          <span className="nav-label">Usuarios</span>
        </NavLink>

        <NavLink to="/administrador/ordenes" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📦</span>
          <span className="nav-label">Ordenes</span>
        </NavLink>

        <NavLink to="/administrador/disenadores" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🎨</span>
          <span className="nav-label">Diseñadores</span>
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-user">
          <div className="user-name">{user?.name || user?.email || 'Administrador'}</div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
