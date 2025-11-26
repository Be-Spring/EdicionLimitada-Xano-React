import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { listOrdenes, listDesigners, listUsers } from '../../../api/xano.js'

export default function AdminHome(){
	const { token } = useAuth()
	const [loading, setLoading] = useState(true)
	const [counts, setCounts] = useState({ ordenes: 0, disenadores: 0, usuarios: 0 })
	const [error, setError] = useState(null)

	useEffect(() => {
		let mounted = true
		;(async () => {
			setLoading(true)
			try {
				const [ordenes, disenadores, usuarios] = await Promise.all([
					listOrdenes({ token }),
					listDesigners({ token }),
					listUsers({ token }),
				])
				if (!mounted) return
				setCounts({ ordenes: (ordenes || []).length, disenadores: (disenadores || []).length, usuarios: (usuarios || []).length })
			} catch (err) {
				console.error('AdminHome load failed', err)
				if (mounted) setError('No se pudo cargar el resumen')
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [token])

	return (
		<AdminLayout>
			<div style={{padding: 10}}>
				<h2>Panel de administración</h2>
				<p>Resumen rápido:</p>

				{error && <div className="alert alert-danger">{error}</div>}

				<div className="row g-3" style={{marginTop:12}}>
					<div className="col-md-4">
						<div className="card p-3 text-center">
							<h6 className="text-muted">Órdenes</h6>
							<div style={{fontSize:28,fontWeight:700}}>{loading ? '—' : counts.ordenes}</div>
							<small className="text-muted">Total de órdenes creadas</small>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card p-3 text-center">
							<h6 className="text-muted">Diseñadores</h6>
							<div style={{fontSize:28,fontWeight:700}}>{loading ? '—' : counts.disenadores}</div>
							<small className="text-muted">Total de diseñadores</small>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card p-3 text-center">
							<h6 className="text-muted">Usuarios</h6>
							<div style={{fontSize:28,fontWeight:700}}>{loading ? '—' : counts.usuarios}</div>
							<small className="text-muted">Total de usuarios</small>
						</div>
					</div>
				</div>

				<section style={{marginTop: 18}}>
					<h3 className="mt-4">Atajos</h3>
					<ul>
						<li><Link to="/administrador/productos" className="text-decoration-none">Abrir Productos</Link></li>
						<li><Link to="/administrador/ordenes" className="text-decoration-none">Revisar Órdenes</Link></li>
						<li><Link to="/administrador/disenadores" className="text-decoration-none">Gestionar Diseñadores</Link></li>
						<li><Link to="/administrador/usuarios" className="text-decoration-none">Gestionar Usuarios</Link></li>
					</ul>
				</section>
			</div>
		</AdminLayout>
	)
}
