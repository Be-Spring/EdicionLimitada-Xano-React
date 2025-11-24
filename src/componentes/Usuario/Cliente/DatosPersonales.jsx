import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { updateUser } from '../../../api/xano.js'
import './DatosPersonales.css'

export default function DatosPersonales(){
	const navigate = useNavigate()
	const { user, token, logout, refreshUser } = useAuth()
	const [form, setForm] = useState({
		nombre: '',
		email: '',
		telefono: '',
		comuna: '',
		direccion_envio: ''
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	useEffect(() => {
		if (!user) return
		setForm({
			nombre: user.nombre || user.name || '',
			email: user.email || '',
			telefono: user.telefono || user.phone || '',
			comuna: user.comuna || '',
			direccion_envio: user.direccion_envio || user.address || ''
		})
	}, [user])

	function handleChange(e){
		const { name, value } = e.target
		setForm(f => ({ ...f, [name]: value }))
	}

	function validate(){
		setError(null)
		if (!form.nombre.trim()) return setError('Por favor ingresa tu nombre')
		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRe.test(form.email)) return setError('Email inválido')
		return true
	}

	async function handleSubmit(e){
		e.preventDefault()
		setError(null)
		setSuccess(null)
		if (!validate()) return
		if (!user?.id) return setError('Usuario no identificado')
		setLoading(true)
		try{
			const payload = {
				nombre: form.nombre,
				email: form.email, // some backends require email on update
				telefono: form.telefono,
				comuna: form.comuna,
				direccion_envio: form.direccion_envio,
			}
			// updateUser expects token, userId, payload
			const updated = await updateUser(token, user.id, payload)
			// Refresh auth context from server so UI reflects changes without reload
			try { await refreshUser() } catch (e) { /* ignore */ }
			setSuccess('Datos guardados.')
		}catch(err){
			setError(err?.message || 'Error guardando datos')
		}finally{
			setLoading(false)
		}
	}

	function handleCancel(){
		if (user) {
			setForm({
				nombre: user.nombre || user.name || '',
				email: user.email || '',
				telefono: user.telefono || user.phone || '',
				comuna: user.comuna || '',
				direccion_envio: user.direccion_envio || user.address || ''
			})
			setError(null)
			setSuccess(null)
		} else {
			navigate('/')
		}
	}

	return (
		<section className="datos-section py-5 mt-5 bg-black text-light">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="card bg-dark text-white p-4 rounded-4">
							<h2 className="text-center mb-4 michroma-regular">Tus Datos</h2>

							{error && <div className="alert alert-danger" role="alert">{error}</div>}
							{success && <div className="alert alert-success" role="alert">{success}</div>}

							<form id="datosForm" className="needs-validation" onSubmit={handleSubmit} noValidate>
								<div className="mb-3">
									<label htmlFor="nombre" className="form-label michroma-regular">Nombre</label>
									<input type="text" className="form-control rounded-3" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
								</div>

								<div className="mb-3">
									<label htmlFor="email" className="form-label michroma-regular">Correo electrónico</label>
									<input type="email" className="form-control rounded-3" id="email" name="email" value={form.email} disabled />
								</div>

								<div className="mb-3">
									<label htmlFor="telefono" className="form-label michroma-regular">Teléfono</label>
									<input type="tel" className="form-control rounded-3" id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
								</div>

								<div className="mb-3">
									<label htmlFor="comuna" className="form-label michroma-regular">Comuna</label>
									<input type="text" className="form-control rounded-3" id="comuna" name="comuna" value={form.comuna} onChange={handleChange} />
								</div>

								<div className="mb-4">
									<label htmlFor="direccion_envio" className="form-label michroma-regular">Dirección de envío</label>
									<input type="text" className="form-control rounded-3" id="direccion_envio" name="direccion_envio" value={form.direccion_envio} onChange={handleChange} />
								</div>

								<div className="text-center">
									<button type="submit" className="btn btn-light w-100 michroma-regular" disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
								</div>

								<div className="text-center mt-3">
									<button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
								</div>
							</form>

						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

