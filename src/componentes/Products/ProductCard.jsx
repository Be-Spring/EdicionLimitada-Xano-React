import React, { useContext, useState } from 'react'
import ProductImagesSlider from './ProductImagesSlider'
import { CartContext } from '../../context/CartContext.jsx'

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useContext(CartContext)
  const [qty, setQty] = useState(1)

  if (!product) return null

  const images = product.images || product.imagen_producto || (product.raw && product.raw.imagen_producto) || []
  const title = product.nombre_producto || product.name || product.title || 'Producto'
  const designer = product.disenador_nombre || product.designer || (product.raw && (product.raw.nombre_disenador || product.raw.diseñador)) || '-'
  const price = Number(product.valor_producto ?? product.price ?? (product.raw && product.raw.valor_producto) ?? 0)

  function handleAdd() {
    const quantity = Math.max(1, Math.min(99, Number(qty) || 1))
    // Pass a lightweight product representation to the cart
    const p = {
      id: product.id,
      name: title,
      price,
      image: Array.isArray(images) && images[0] ? (typeof images[0] === 'string' ? images[0] : images[0].url || images[0].path) : null,
      raw: product.raw || product,
    }
    addToCart(p, quantity)
  }

  return (
    <div className={`card bg-dark text-light product-card ${compact ? 'p-2' : ''}`}>
      <div className="d-flex align-items-start gap-3 p-2">
        <div style={{ width: 140, minWidth: 140 }}>
          {/* Slider handles multiple images; falls back to placeholder */}
          <ProductImagesSlider images={images} alt={title} aspect={'4/3'} />
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          <div>
            <h6 className="mb-1">{title}</h6>
            <p className="mb-1 text-muted small">Diseñador: {designer}</p>
            <p className="mb-0">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price)}</p>
          </div>

          <div className="mt-auto d-flex align-items-center gap-2 pt-2">
            <label className="form-label mb-0 small">Cant.</label>
            <input type="number" className="form-control form-control-sm" min={1} max={99} value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: 80 }} />

            <div className="ms-auto d-flex gap-2">
              <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setQty((q) => Math.max(1, (Number(q) || 1) - 1))}>-</button>
              <button type="button" className="btn btn-light btn-sm" onClick={handleAdd}>Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
