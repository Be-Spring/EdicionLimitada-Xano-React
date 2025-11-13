import React from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'

export default function AdminHome(){
	return (
		<AdminLayout>
			<div style={{padding: 10}}>
				<h2>Panel de administración</h2>
				<p>Resumen rápido (UI-only):</p>

				<div style={{display: 'flex', gap: 12, marginTop: 12}}>
					<div style={{flex:1, padding: 12, background: '#fff', borderRadius: 8}}>Ventas (hoy)<br/><strong>$0</strong></div>
					<div style={{flex:1, padding: 12, background: '#fff', borderRadius: 8}}>Órdenes pendientes<br/><strong>0</strong></div>
					<div style={{flex:1, padding: 12, background: '#fff', borderRadius: 8}}>Productos<br/><strong>--</strong></div>
				</div>

				<section style={{marginTop: 18}}>
					<h3>Atajos</h3>
					<ul>
						<li>Abrir Productos</li>
						<li>Revisar Órdenes</li>
						<li>Gestionar Diseñadores</li>
					</ul>
				</section>
			</div>
		</AdminLayout>
	)
}
