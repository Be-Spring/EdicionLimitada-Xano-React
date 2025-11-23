import React, { useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import ProductList from '../../../componentes/Usuario/Administrador/AdminProduct/ProductList.jsx'
import ProductForm from '../../../componentes/Usuario/Administrador/AdminProduct/ProductForm.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { createProduct, uploadImages, attachImagesToProduct } from '../../../api/xano.js'

export default function AdminProducts(){
	const [editing, setEditing] = useState(null)
	const { token } = useAuth()
	const [refreshFlag, setRefreshFlag] = useState(0)

	function handleEdit(product){
		setEditing(product)
	}

	function handleCancel(){
		setEditing(null)
	}

	function handleSave(payload){
		// Real save: create or update product in the backend and attach images
		return (async () => {
			try {
				const files = payload.images || []
				const body = { ...payload }
				delete body.images

				if (editing && editing.id) {
					// update existing (PATCH)
					const url = `${import.meta.env.VITE_XANO_STORE_BASE}/producto/${editing.id}`
					await fetch(url, { method: 'PATCH', headers: { ...{ 'Content-Type': 'application/json' }, ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
					if (files.length) {
						const uploaded = await uploadImages(token, files)
						await attachImagesToProduct(token, editing.id, uploaded)
					}
				} else {
					// create new
					const created = await createProduct(token, body)
					const productId = created?.id || created?.producto_id || created?.data?.id
					if (!productId) throw new Error('No se pudo crear producto')
					if (files.length) {
						const uploaded = await uploadImages(token, files)
						await attachImagesToProduct(token, productId, uploaded)
					}
				}

				// refresh product list in child
				setRefreshFlag(f => f + 1)
				setEditing(null)
			} catch (err) {
				console.error('Error saving product', err)
				alert(err?.message || 'Error al guardar producto')
			}
		})()
	}

	function handleDelete(product){
		(async () => {
			if (!product?.id) return
			try {
				const url = `${import.meta.env.VITE_XANO_STORE_BASE}/producto/${product.id}`
				await fetch(url, { method: 'DELETE', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
				setRefreshFlag(f => f + 1)
			} catch (err) {
				console.error('delete failed', err)
				alert('No se pudo eliminar producto')
			}
		})()
	}

	return (
		<AdminLayout>
			<div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
				<div style={{flex: 1}}>
					<ProductList onEdit={handleEdit} onDelete={handleDelete} refreshFlag={refreshFlag} />
				</div>

				<div style={{width: 420}}>
					<ProductForm initial={editing} onSave={handleSave} onCancel={handleCancel} />
				</div>
			</div>
		</AdminLayout>
	)
}
