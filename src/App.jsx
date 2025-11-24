import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import PageHome from './pages/Home/PageHome.jsx'
import PageProducto from './pages/Home/PageProducto.jsx'
import PageContacto from './pages/Home/PageContacto.jsx'
import PageInicioSesion from './pages/Home/PageInicioSesion.jsx'
import LoginAdmin from './componentes/Formularios/LoginAdmin.jsx'
import Registro from './componentes/Formularios/Registro.jsx'
import PageBlogEditorial from './pages/Home/PageBlogEditorial.jsx'
import PageBlogEventos from './pages/Home/PageBlogEventos.jsx'
import PageNosotrosED from './pages/Home/PageNosotrosED.jsx'
import PageNosotrosDisenadores from './pages/Home/PageNosotrosDisenadores.jsx'
import Carrito from './componentes/Carrito/Carrito.jsx'
// Admin pages
import AdminHome from './pages/Home/Admin/AdminHome.jsx'
import AdminProducts from './pages/Home/Admin/AdminProducts.jsx'
import AdminUsers from './pages/Home/Admin/AdminUsers.jsx'
import AdminOrden from './pages/Home/Admin/AdminOrden.jsx'
import AdminDisenador from './pages/Home/Admin/AdminDisenador.jsx'
import AdminRoute from './routes/AdminRoute.jsx'
import PageInicioSesionAdmin from './pages/Home/Admin/PageInicioSesionAdmin.jsx'

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<PageHome />} />
				<Route path="/productos" element={<PageProducto />} />
				<Route path="/contacto" element={<PageContacto />} />
				<Route path="/sesion" element={<PageInicioSesion />} />
				<Route path="/sesion-admin" element={<PageInicioSesionAdmin />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/blog/editorial" element={<PageBlogEditorial />} />
				<Route path="/blog/eventos" element={<PageBlogEventos />} />
				<Route path="/nosotros/edicion-limitada" element={<PageNosotrosED />} />
				<Route path="/nosotros/disenadores" element={<PageNosotrosDisenadores />} />
		
				{/* Admin area (UI-only pages) */}
				<Route path="/administrador" element={<AdminRoute><AdminHome /></AdminRoute>} />
				<Route path="/administrador/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
				<Route path="/administrador/usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
				<Route path="/administrador/ordenes" element={<AdminRoute><AdminOrden /></AdminRoute>} />
				<Route path="/administrador/disenadores" element={<AdminRoute><AdminDisenador /></AdminRoute>} />
				{/* fallback to home */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Carrito />
		</>
	)
}
