import React, { useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import ProductList from '../../../componentes/Usuario/Administrador/AdminProduct/ProductList.jsx'
import ProductForm from '../../../componentes/Usuario/Administrador/AdminProduct/ProductForm.jsx'

export default function AdminProducts(){
	const [editing, setEditing] = useState(null)

	function handleEdit(product){
		setEditing(product)
	}

	function handleCancel(){
		setEditing(null)
	}

	function handleSave(payload){
		// UI-only: just log the payload for now. In future we'll call the API.
		// payload.images contains File[] when images are selected.
		// eslint-disable-next-line no-console
		console.log('Product saved (simulated):', payload)
		setEditing(null)
	}

	function handleDelete(product){
		// UI-only placeholder
		// eslint-disable-next-line no-console
		console.log('Delete product (simulated):', product)
	}

	return (
		<AdminLayout>
			<div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
				<div style={{flex: 1}}>
					<ProductList onEdit={handleEdit} onDelete={handleDelete} />
				</div>

				<div style={{width: 420}}>
					<ProductForm initial={editing} onSave={handleSave} onCancel={handleCancel} />
				</div>
			</div>
		</AdminLayout>
	)
}
