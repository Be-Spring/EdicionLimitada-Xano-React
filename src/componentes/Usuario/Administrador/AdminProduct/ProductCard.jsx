import React from 'react'
import './ProductCard.css'

export default function ProductCard({ product = {}, onEdit = () => {}, onDelete = () => {} }){
  return (
    <div className="product-card card">
      <div className="product-media">
        <img src={product.imagen || '/src/assets/img/img_placeholder.png'} alt={product.nombre_producto} />
      </div>
      <div className="product-body">
        <h4 className="product-name">{product.nombre_producto}</h4>
        <div className="product-price">{product.valor_producto ? `$${product.valor_producto.toLocaleString()}` : '-'}</div>
        <div className="product-actions">
          <button className="btn-edit" onClick={onEdit}>Editar</button>
          <button className="btn-delete" onClick={onDelete}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
