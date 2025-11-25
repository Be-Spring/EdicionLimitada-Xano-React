import React from 'react'
import './Topbar.css'

export default function Topbar({ onToggleSidebar }){
  return (
    <header className="admin-topbar">
      <div className="topbar-left d-flex align-items-center">
        <button id="sidebarToggle" className="me-3" onClick={onToggleSidebar} aria-label="Toggle sidebar">☰</button>
        <span className="michroma-regular text-white">EDICION LIMITADA</span>
      </div>
    </header>
  )
}