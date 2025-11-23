import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import './ProductList.css'
import { listProducts } from '../../../../api/xano.js'
import { useAuth } from '../../../../context/AuthContext.jsx'

export default function ProductList({ onEdit = () => {}, onDelete = () => {}, refreshFlag = 0 }){
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await listProducts({ token, limit: 200, offset: 0 })
        if (!mounted) return
        setProducts(res || [])
      } catch (e) {
        console.error('listProducts failed', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [token, refreshFlag])

  if (loading) return <div>Cargando productos...</div>

  return (
    <div className="admin-product-list">
      <div className="product-grid">
        {products.map(p => {
          const raw = p.raw || p
          const card = {
            id: p.id || raw.id,
            nombre_producto: raw.nombre_producto || p.name || raw.name || raw.title || 'Producto',
            valor_producto: raw.valor_producto || p.price || raw.price || 0,
            imagen: p.image || raw.imagen_producto || raw.imagen || (raw.images && raw.images[0]) || '/src/assets/img/img_placeholder.png',
            raw: raw,
          }
          return <ProductCard key={card.id} product={card} onEdit={() => onEdit(card)} onDelete={() => onDelete(card)} />
        })}
      </div>
    </div>
  )
}
