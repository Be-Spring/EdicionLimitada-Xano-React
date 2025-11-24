import React, { useEffect, useState } from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import '../../../componentes/Usuario/Administrador/AdminUsers.css'
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
		setEditing(user)
		setForm({
			nombre: user.nombre || '',
			email: user.email || '',
			rol: user.rol || '',
			estado: user.estado || '',
			telefono: user.telefono || '',
			comuna: user.comuna || '',
			direccion_envio: user.direccion_envio || '',
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
							<div className="mb-3">
								<div className="row g-2">
									<div className="col-md-3">
										<select className="form-select" value={filterRole} onChange={e => { setFilterRole(e.target.value); setCurrentPage(1) }}>
											<option value="">Todos los roles</option>
											<option value="cliente">cliente</option>
											<option value="administrador">administrador</option>
										</select>
									</div>
									<div className="col-md-3">
										<select className="form-select" value={filterEstado} onChange={e => { setFilterEstado(e.target.value); setCurrentPage(1) }}>
											<option value="">Todos los estados</option>
											<option value="activo">activo</option>
											<option value="bloqueado">bloqueado</option>
										</select>
									</div>
									<div className="col-md-6 d-flex justify-content-end">
										<button className="btn btn-secondary" onClick={() => { setFilterRole(''); setFilterEstado(''); setCurrentPage(1) }}>Limpiar filtros</button>
									</div>
								</div>
							</div>
							<table className="table table-sm">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Email</th>
										<th>Rol</th>
										<th>Estado</th>
										<th>Teléfono</th>
										<th>Comuna</th>
										<th>Dirección envío</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{users.length === 0 && (
										<tr><td colSpan={8}>No hay usuarios.</td></tr>
									)}
									{pagedUsers.map(u => (
										<tr key={u.id}>
											<td>{u.nombre}</td>
											<td>{u.email}</td>
											<td>{u.rol}</td>
											<td>{u.estado}</td>
											<td>{u.telefono}</td>
											<td>{u.comuna}</td>
											<td style={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis'}}>{u.direccion_envio}</td>
											<td>
												<button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(u)}>Editar</button>
												{String((u.rol || u.role || '')).toLowerCase() !== 'administrador' && (
													<button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u)}>Eliminar</button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
								<div className="d-flex justify-content-between align-items-center mt-3">
									<div className="text-muted">Mostrando {Math.min((currentPage-1)*pageSize+1, total)} - {Math.min(currentPage*pageSize, total)} de {total}</div>
									<div>
										<select className="form-select form-select-sm d-inline-block me-2" style={{width:120}} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}>
											<option value={6}>6 / página</option>
											<option value={12}>12 / página</option>
											<option value={24}>24 / página</option>
										</select>
										<button className="btn btn-sm btn-outline-secondary me-2" disabled={currentPage<=1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Anterior</button>
										<button className="btn btn-sm btn-outline-secondary" disabled={currentPage>=totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Siguiente</button>
									</div>
								</div>
						</div>
					)}
				</div>

				<div style={{width: 420}}>
					<div style={{padding: 12, border: '1px solid #eee', borderRadius: 6}}>
						<h5>{editing ? 'Editar usuario' : 'Crear usuario'}</h5>
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
								<button className="btn btn-sm btn-primary" type="submit">{editing ? 'Guardar' : 'Crear'}</button>
								<button type="button" className="btn btn-sm btn-secondary" onClick={handleCancel}>Limpiar</button>
							</div>
						</form>
					</div>

					{/* Confirmation modal for deleting user */}
					{confirmUser && (
						<div className="modal-backdrop" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1050}}>
							<div className="card p-3" style={{width:420}}>
								<h5 className="mb-2">Confirmar eliminación</h5>
								<p>¿Desea eliminar al usuario <strong>{confirmUser.nombre || confirmUser.name || ''}</strong> con email <strong>{confirmUser.email}</strong>?</p>
								<div className="d-flex justify-content-end" style={{gap:8}}>
									<button className="btn btn-secondary" onClick={() => setConfirmUser(null)}>Cancelar</button>
									<button className="btn btn-danger" onClick={() => handleDeleteConfirmed()}>Eliminar</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	)
}
