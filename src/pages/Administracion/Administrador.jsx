import React from 'react'
import { Outlet } from 'react-router-dom'
import MenuAdmin from './MenuAdmin'
import './admin.css'

export default function Administrador() {
  return (
    <div className="admin-layout container-fluid py-4">
      <div className="row">
        <div className="col-md-3">
          <MenuAdmin />
        </div>
        <div className="col-md-9">
          {/* Outlet will render nested admin pages like dashboard, productos, etc. */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
            