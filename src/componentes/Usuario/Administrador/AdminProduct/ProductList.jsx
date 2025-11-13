import React from 'react'
import ProductCard from './ProductCard.jsx'
import './ProductList.css'

// Mock list: in future this will come from API
const MOCK = [
  { id: 1, nombre_producto: 'Mono Lycra', valor_producto: 20000, imagen: '/src/assets/img/img_placeholder.png' },
  { id: 2, nombre_producto: 'Vestido Malla', valor_producto: 34990, imagen: '/src/assets/img/img_placeholder.png' },
  { id: 3, nombre_producto: 'Poleron Heavenly', valor_producto: 44990, imagen: '/src/assets/img/img_placeholder.png' }
]

export default function ProductList({ onEdit = () => {}, onDelete = () => {} }){
  return (
    <div className="admin-product-list">
      <div className="product-grid">
        {MOCK.map(p => (
          <ProductCard key={p.id} product={p} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
        ))}
      </div>
    </div>
  )
}
