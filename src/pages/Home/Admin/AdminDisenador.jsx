import React, { useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import DisenadoresList from '../../../componentes/Usuario/Administrador/AdminDisenador/DisenadoresList.jsx'
import DisenadorForm from '../../../componentes/Usuario/Administrador/AdminDisenador/DisenadorForm.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { createDesigner, updateDesigner } from '../../../api/xano.js'

export default function AdminDisenador(){
	const [editing, setEditing] = useState(null)
	const [refreshFlag, setRefreshFlag] = useState(0)
	const { token } = useAuth()

	function handleEdit(d){
		setEditing(d)
	}

	async function handleSave(payload){
		try {
			if (payload.id) {
				await updateDesigner(token, payload.id, payload)
			} else {
				await createDesigner(token, payload)
			}
			setEditing(null)
			setRefreshFlag(f => f + 1)
		} catch (e) {
			console.error('save designer failed', e)
			alert(e.message || 'Error guardando diseñador')
		}
	}

	return (
		<AdminLayout>
			<div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
				<div style={{flex: 1}}>
					<DisenadoresList onEdit={handleEdit} onDelete={() => setRefreshFlag(f => f + 1)} refreshFlag={refreshFlag} />
				</div>

				<div style={{width: 360}}>
					<DisenadorForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
				</div>
			</div>
		</AdminLayout>
	)
}
