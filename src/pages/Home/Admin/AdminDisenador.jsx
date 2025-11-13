import React, { useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import DisenadoresList from '../../../componentes/Usuario/Administrador/AdminDisenador/DisenadoresList.jsx'
import DisenadorForm from '../../../componentes/Usuario/Administrador/AdminDisenador/DisenadorForm.jsx'

export default function AdminDisenador(){
	const [editing, setEditing] = useState(null)

	function handleEdit(d){
		setEditing(d)
	}

	function handleSave(payload){
		// UI-only: simulate save
		// eslint-disable-next-line no-console
		console.log('Designer saved (simulated):', payload)
		setEditing(null)
	}

	return (
		<AdminLayout>
			<div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
				<div style={{flex: 1}}>
					<DisenadoresList onEdit={handleEdit} />
				</div>

				<div style={{width: 360}}>
					<DisenadorForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
				</div>
			</div>
		</AdminLayout>
	)
}
