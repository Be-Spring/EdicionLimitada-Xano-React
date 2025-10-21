import React from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/img/Logo Edicion Limitada.png'
import './admin.css'

export default function MenuAdmin({ onLogout }) {
  return (
    <aside className="admin-menu bg-black text-light p-4">
      <div className="admin-logo text-center mb-4">
        <img src={logoImg} alt="Edición Limitada" className="img-fluid" style={{ maxWidth: 120 }} />
      </div>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-3"><Link to="/administrador" className="text-light text-decoration-none">Dashboard</Link></li>
          <li className="mb-3"><Link to="/administrador/productos" className="text-light text-decoration-none">Productos</Link></li>
          <li className="mb-3"><Link to="/administrador/inventario" className="text-light text-decoration-none">Inventario</Link></li>
          <li className="mb-3"><Link to="/administrador/clientes" className="text-light text-decoration-none">Clientes</Link></li>
          <li className="mb-3"><Link to="/administrador/disenadores" className="text-light text-decoration-none">Diseñadores</Link></li>
          <li className="mt-4"><button className="btn btn-outline-light w-100" onClick={onLogout}>Cerrar Sesión</button></li>
        </ul>
      </nav>
    </aside>
  )
}
