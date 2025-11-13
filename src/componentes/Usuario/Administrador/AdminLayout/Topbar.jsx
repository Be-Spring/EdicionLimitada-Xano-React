import React from 'react'
import './Topbar.css'

export default function Topbar(){
  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">Dashboard Administrativo</h2>
      </div>
      <div className="topbar-right">
        <button className="btn-ghost">Notificaciones</button>
        <button className="btn-ghost">Ver Sitio Web</button>
      </div>
    </header>
  )
}
