import React from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AdminLayout.css'

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
