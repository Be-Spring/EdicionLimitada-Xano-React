import React from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'

const MOCK_USERS = [
	{ id: 1, nombre: 'María', email: 'maria@example.com', rol: 'cliente' },
	{ id: 2, nombre: 'Admin Demo', email: 'admin@example.com', rol: 'administrador' }
]

export default function AdminUsers(){
	return (
		<AdminLayout>
			<div style={{padding: 12}}>
				<h2>Usuarios</h2>
				<p>Listado (UI-only, sin lógica):</p>
				<div style={{marginTop: 12}}>
					{MOCK_USERS.map(u => (
						<div key={u.id} style={{padding:8, borderBottom: '1px solid #eee'}}>
							<strong>{u.nombre}</strong> — {u.email} <small>({u.rol})</small>
						</div>
					))}
				</div>
			</div>
		</AdminLayout>
	)
}
