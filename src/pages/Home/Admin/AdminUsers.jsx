import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import '../../../componentes/Usuario/Administrador/AdminUsers.css'
import AdminList from '../../../componentes/Usuario/Administrador/AdminList.jsx'
import { listUsers, createUser, updateUser, deleteUser } from '../../../api/xano.js'

export default function AdminUsers(){
	const { token } = useAuth()
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [refreshFlag, setRefreshFlag] = useState(0)

	const [editing, setEditing] = useState(null)
	const [form, setForm] = useState({ nombre: '', email: '', rol: 'cliente', estado: 'activo', telefono: '', comuna: '', direccion_envio: '' })
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(12)
	const [filterRole, setFilterRole] = useState('')
	const [filterEstado, setFilterEstado] = useState('')
	const [confirmUser, setConfirmUser] = useState(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			setLoading(true)
			try {
				const list = await listUsers({ token })
				if (mounted) setUsers(list)
			} catch (err) {
				console.error('listUsers failed', err)
				if (mounted) setUsers([])
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [token, refreshFlag])

	// close modals with Escape
	useEffect(() => {
		function onKey(e){
			if (e.key === 'Escape'){
				if (confirmUser) setConfirmUser(null)
				if (editing !== null) handleCancel()
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [confirmUser, editing])

	// apply filters
	const filteredUsers = users.filter(u => {
		if (filterRole) {
			if ((u.rol || u.role || '') !== filterRole) return false
		}
		if (filterEstado) {
			if ((u.estado || u.status || '') !== filterEstado) return false
		}
		return true
	})

	const total = filteredUsers.length
	const totalPages = Math.max(1, Math.ceil(total / pageSize))
	const pagedUsers = filteredUsers.slice((currentPage-1)*pageSize, currentPage*pageSize)

	function handleChange(e){
		const { name, value } = e.target
		setForm(f => ({ ...f, [name]: value }))
	}

	function handleEdit(user){
		setEditing(user || {})
		setForm({
			nombre: user?.nombre || '',
			email: user?.email || '',
			rol: user?.rol || 'cliente',
			estado: user?.estado || 'activo',
			telefono: user?.telefono || '',
			comuna: user?.comuna || '',
			direccion_envio: user?.direccion_envio || '',
		})
	}

	function handleCancel(){
		setEditing(null)
		setForm({ nombre: '', email: '', rol: 'cliente', estado: 'activo', telefono: '', comuna: '', direccion_envio: '' })
	}

	async function handleSave(e){
		e.preventDefault()
		try {
			if (editing && editing.id) {
				await updateUser(token, editing.id, form)
			} else {
				await createUser(token, form)
			}
			setRefreshFlag(f => f + 1)
			handleCancel()
		} catch (err) {
			console.error('save user failed', err)
			alert(err?.message || 'Error al guardar usuario')
		}
	}

	async function handleDelete(user){
		// trigger confirmation modal
		if (!user?.id) return
		setConfirmUser(user)
	}

	async function handleDeleteConfirmed(){
		const user = confirmUser
		if (!user?.id) return
		try {
			await deleteUser(token, user.id)
			setRefreshFlag(f => f + 1)
			setConfirmUser(null)
		} catch (err) {
			console.error('delete user failed', err)
			alert(err?.message || 'Error eliminando usuario')
			setConfirmUser(null)
		}
	}

	return (
		<AdminLayout>
			<div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
				<div style={{flex: 1}}>
					<h2 style={{marginTop: 4}}>Usuarios</h2>
					{loading ? (
						<div>Cargando usuarios...</div>
					) : (
						<div style={{marginTop: 12}}>
							<AdminList
								title="Usuarios"
								data={users}
								columns={[
									{ key: 'nombre', label: 'Nombre' },
									{ key: 'email', label: 'Email' },
									{ key: 'rol', label: 'Rol' },
									{ key: 'estado', label: 'Estado' },
									{ key: 'telefono', label: 'Teléfono' },
									{ key: 'comuna', label: 'Comuna' },
									{ key: 'direccion_envio', label: 'Dirección envío', render: (it) => <span style={{maxWidth:200,display:'inline-block',overflow:'hidden',textOverflow:'ellipsis'}}>{it.direccion_envio}</span> },
								]}
								onEdit={handleEdit}
								onDelete={handleDelete}
								pageSizeOptions={[6,12,24]}
								initialPageSize={pageSize}
								showCreate={true}
								onCreate={() => handleEdit(null)}
								filterOptions={[
									{ key: 'rol', label: 'Rol', options: [ { value: '', label: 'Todos' }, { value: 'cliente', label: 'cliente' }, { value: 'administrador', label: 'administrador' } ]},
									{ key: 'estado', label: 'Estado', options: [ { value: '', label: 'Todos' }, { value: 'activo', label: 'activo' }, { value: 'bloqueado', label: 'bloqueado' } ]},
								]}
							/>
						</div>
					)}
				</div>
					{/* Confirmation modal for deleting user */}
					{confirmUser && (
						<div className="modal-backdrop" onClick={() => setConfirmUser(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1050}}>
							<div className="card p-3" onClick={e => e.stopPropagation()} style={{width:420}}>
								<h5 className="mb-2">Confirmar eliminación</h5>
								<p>¿Desea eliminar al usuario <strong>{confirmUser.nombre || confirmUser.name || ''}</strong> con email <strong>{confirmUser.email}</strong>?</p>
								<div className="d-flex justify-content-end" style={{gap:8}}>
									<button className="btn btn-secondary" onClick={() => setConfirmUser(null)}>Cancelar</button>
									<button className="btn btn-danger" onClick={() => handleDeleteConfirmed()}>Eliminar</button>
								</div>
							</div>
						</div>
					)}

					{/* Create / Edit modal */}
					{(editing !== null) && (
						<div className="modal-backdrop" onClick={() => handleCancel()} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1050}}>
							<div className="card p-3" onClick={e => e.stopPropagation()} style={{width:420}}>
								<h5 className="mb-2">{editing && editing.id ? 'Editar usuario' : 'Crear usuario'}</h5>
								<form onSubmit={handleSave}>
									<div className="mb-2">
										<label className="form-label">Nombre</label>
										<input name="nombre" value={form.nombre} onChange={handleChange} className="form-control form-control-sm" />
									</div>
									<div className="mb-2">
										<label className="form-label">Email</label>
										<input name="email" value={form.email} onChange={handleChange} className="form-control form-control-sm" />
									</div>
									<div className="mb-2">
										<label className="form-label">Rol</label>
										<select name="rol" value={form.rol} onChange={handleChange} className="form-select form-select-sm">
											<option value="cliente">cliente</option>
											<option value="administrador">administrador</option>
										</select>
									</div>
									<div className="mb-2">
										<label className="form-label">Estado</label>
										<select name="estado" value={form.estado} onChange={handleChange} className="form-select form-select-sm">
											<option value="activo">activo</option>
											<option value="bloqueado">bloqueado</option>
										</select>
									</div>
									<div className="mb-2">
										<label className="form-label">Teléfono</label>
										<input name="telefono" value={form.telefono} onChange={handleChange} className="form-control form-control-sm" />
									</div>
									<div className="mb-2">
										<label className="form-label">Comuna</label>
										<input name="comuna" value={form.comuna} onChange={handleChange} className="form-control form-control-sm" />
									</div>
									<div className="mb-2">
										<label className="form-label">Dirección envío</label>
										<input name="direccion_envio" value={form.direccion_envio} onChange={handleChange} className="form-control form-control-sm" />
									</div>

									<div style={{display: 'flex', gap: 8, marginTop: 8}}>
										<button className="btn btn-sm btn-primary" type="submit">{editing && editing.id ? 'Guardar' : 'Crear'}</button>
										<button type="button" className="btn btn-sm btn-secondary" onClick={handleCancel}>Cancelar</button>
									</div>
								</form>
							</div>
						</div>
					)}
			</div>
		</AdminLayout>
	)
}
