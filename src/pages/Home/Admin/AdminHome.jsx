import React from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'

export default function AdminHome(){
	return (
		<AdminLayout>
			<div style={{padding: 10}}>
				<h2>Panel de administración</h2>
				<p>Resumen rápido (UI-only):</p>

				<section style={{marginTop: 18}}>
					<h3>Atajos</h3>
					<ul>
						<li><Link to="/administrador/productos" className="text-decoration-none">Abrir Productos</Link></li>
						<li><Link to="/administrador/ordenes" className="text-decoration-none">Revisar Órdenes</Link></li>
						<li><Link to="/administrador/disenadores" className="text-decoration-none">Gestionar Diseñadores</Link></li>
					</ul>
				</section>
			</div>
		</AdminLayout>
	)
}
