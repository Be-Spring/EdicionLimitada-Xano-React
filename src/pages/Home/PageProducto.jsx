import React, { useEffect, useState } from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import ProductGrid from '../../componentes/Producto/ProductGrid.jsx'
import { listProducts } from '../../api/xano'

export default function PageProducto() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let mounted = true
		async function load() {
			setLoading(true)
			setError(null)
			try {
				const res = await listProducts()
				if (!mounted) return
				setProducts(res || [])
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

	return (
		<>
			<Header />
			<main className="pt-5">
				<div className="container py-5">
					<h1 className="michroma-regular text-light mb-4">Productos</h1>

					{loading && <div className="text-center text-muted">Cargando productos...</div>}
					{error && <div className="alert alert-danger">{error}</div>}

					{!loading && !error && (
						<ProductGrid products={products} />
					)}
				</div>
			</main>
			<Footer />
		</>
	)
}
