import React, { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import './AdminLayout.css'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className="admin-main">
        <Topbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
