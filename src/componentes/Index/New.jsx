import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './New.css';
import { listProducts } from '../../api/xano'
import ProductCard from '../Producto/ProductCard.jsx'

const New = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true)
            try {
                const res = await listProducts()
                if (!mounted) return
                const arr = Array.isArray(res) ? res : []
                // try to sort by creation date if present, otherwise by id desc
                const sorted = arr.slice().sort((a,b) => {
                    const da = a?.raw?.created_at || a?.created_at || a?.raw?.fecha_creacion || a?.fecha_creacion || null
                    const db = b?.raw?.created_at || b?.created_at || b?.raw?.fecha_creacion || b?.fecha_creacion || null
                    if (da && db) return new Date(db) - new Date(da)
                    // fallback: sort by id desc if numeric
                    const ia = Number(a?.id || a?.raw?.id || 0)
                    const ib = Number(b?.id || b?.raw?.id || 0)
                    return ib - ia
                })
                setItems(sorted.slice(0,4))
            } catch (e) {
                console.error('load featured failed', e)
                setItems([])
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

    return (
        <section className="products-section py-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-light">Nuevos ingresos</h2>
                    <Link to="/productos" className="btn btn-outline-light">Ver todos los productos</Link>
                </div>

                <div className="row g-4">
                    {loading ? (
                        <div className="col-12 text-center text-muted">Cargando...</div>
                    ) : (
                        items.length === 0 ? (
                            <div className="col-12 text-center text-muted">No hay productos recientes.</div>
                        ) : (
                            items.map(p => <ProductCard key={p.id || p.nombre_producto || p.raw?.id} product={p} />)
                        )
                    )}
                </div>
            </div>
        </section>
    )
}

export default New;