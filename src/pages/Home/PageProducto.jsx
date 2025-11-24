import React, { useEffect, useState } from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import ProductGrid from '../../componentes/Producto/ProductGrid.jsx'
import { listProducts, listCategories, listDesigners } from '../../api/xano'

export default function PageProducto() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [categories, setCategories] = useState([])
	const [designers, setDesigners] = useState([])

	// filters
	const [q, setQ] = useState('')
	const [filterCat, setFilterCat] = useState('')
	const [filterDesigner, setFilterDesigner] = useState('')

	useEffect(() => {
		let mounted = true
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const res = await listProducts()
				const cats = await listCategories()
				const ds = await listDesigners({})
				if (!mounted) return
				// build a map of designer id -> name for resolving designer ids in products
				const designerMap = (ds || []).reduce((acc, d) => { acc[String(d.id)] = d.nombre_disenador || (d.raw && d.raw.nombre_disenador) || d.name || ''; return acc }, {})
				// normalize products to include disenador_nombre when only id is present
				const normalizedProducts = (res || []).map(p => {
					const prod = { ...p }
					const d = p.disenador
					if (!prod.disenador_nombre) {
						if (typeof d === 'object' && d) prod.disenador_nombre = d.nombre_disenador || d.name || ''
						else if (d != null) prod.disenador_nombre = designerMap[String(d)] || ''
					}
					return prod
				})
				setProducts(normalizedProducts)
				setCategories(cats || [])
				setDesigners(ds || [])
			} catch (e) {
				if (!mounted) return
				setError(e?.message || 'Error al cargar productos')
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => { mounted = false }
	}, [])

	// client-side filtering
	const displayed = products.filter(p => {
		if (q && !(p.nombre_producto || '').toLowerCase().includes(q.toLowerCase())) return false
		if (filterCat) {
			const cat = p.categoria
			if (typeof cat === 'object') {
				if (String(cat.id) !== String(filterCat)) return false
			} else {
				if (String(cat) !== String(filterCat)) return false
			}
		}
		if (filterDesigner) {
			// p.disenador can be object or id or name
			const d = p.disenador
			if (typeof d === 'object') {
				if (String(d.id) !== String(filterDesigner) && String(d.nombre_disenador || d.name || '') !== String(filterDesigner)) return false
			} else {
				if (String(d) !== String(filterDesigner)) return false
			}
		}
		return true
	})

	// pagination
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(12)
	const totalItems = displayed.length
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

	useEffect(() => { setCurrentPage(1) }, [q, filterCat, filterDesigner, products, pageSize])

	const paged = displayed.slice((currentPage - 1) * pageSize, currentPage * pageSize)

	return (
		<>
			<Header />
			<main className="pt-5">
				<div className="container py-5">
					<h1 className="michroma-regular text-light mb-4">Productos</h1>

					<div className="mb-4">
						<div className="row g-2">
							<div className="col-md-4">
								<input className="form-control" placeholder="Buscar por nombre" value={q} onChange={e => setQ(e.target.value)} />
							</div>
							<div className="col-md-3">
								<select className="form-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
									<option value="">Todas las categorías</option>
									{categories.map(c => <option key={c.id} value={c.id}>{c.tipo_producto}</option>)}
								</select>
							</div>
							<div className="col-md-3">
								<select className="form-select" value={filterDesigner} onChange={e => setFilterDesigner(e.target.value)}>
									<option value="">Todos los diseñadores</option>
									{designers.map(d => <option key={d.id} value={d.id}>{d.nombre_disenador || d.raw?.nombre_disenador || d.name}</option>)}
								</select>
							</div>
							<div className="col-md-2 d-flex">
								<button className="btn btn-secondary me-2" onClick={() => { setQ(''); setFilterCat(''); setFilterDesigner('') }}>Limpiar</button>
							</div>
						</div>
					</div>

					{loading && <div className="text-center text-muted">Cargando productos...</div>}
					{error && <div className="alert alert-danger">{error}</div>}

					{!loading && !error && (
						<>
							<ProductGrid products={paged} />
							<div className="d-flex justify-content-between align-items-center mt-3">
								<div className="text-muted">Mostrando {Math.min((currentPage-1)*pageSize+1, totalItems)} - {Math.min(currentPage*pageSize, totalItems)} de {totalItems}</div>
								<div>
									<select className="form-select form-select-sm d-inline-block me-2" style={{width:120}} value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
										<option value={6}>6 / página</option>
										<option value={12}>12 / página</option>
										<option value={24}>24 / página</option>
										<option value={48}>48 / página</option>
									</select>
									<button className="btn btn-sm btn-outline-secondary me-2" disabled={currentPage<=1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Anterior</button>
									<button className="btn btn-sm btn-outline-secondary" disabled={currentPage>=totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Siguiente</button>
								</div>
							</div>
						</>
					)}
				</div>
			</main>
			<Footer />
		</>
	)
}
