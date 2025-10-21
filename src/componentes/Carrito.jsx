import React, { useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx'

export default function Carrito() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useContext(CartContext)

  return (
    <div className="offcanvas offcanvas-end bg-dark text-white" id="cartOffcanvas" tabIndex={-1} aria-labelledby="cartOffcanvasLabel">
      <div className="offcanvas-header border-bottom border-secondary">
        <h5 className="offcanvas-title michroma-regular" id="cartOffcanvasLabel">
          <i className="fas fa-shopping-cart me-2"></i> Tu carrito
        </h5>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div className="offcanvas-body">
        {items.length === 0 ? (
          <div className="text-muted">Tu carrito está vacío</div>
        ) : (
          <ul className="list-group list-group-flush">
            {items.map((it) => (
              <li key={it.product.id} className="list-group-item bg-dark border-0 d-flex align-items-center justify-content-between">
                <div className="d-flex gap-3 align-items-center">
                  <img src={it.product.image} alt={it.product.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                  <div>
                    <div className="fw-bold">{it.product.name}</div>
                    <div className="text-muted small">{it.product.designer}</div>
                    <div className="text-light small">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(it.product.price)}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input type="number" min={1} value={it.quantity} onChange={(e) => updateQuantity(it.product.id, Number(e.target.value) || 1)} style={{ width: 64 }} className="form-control form-control-sm" />
                  <button className="btn btn-sm btn-outline-light" onClick={() => removeFromCart(it.product.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-3 pb-3">
        <div className="d-flex justify-content-between align-items-center border-top border-secondary pt-3">
          <span className="text-muted">Total</span>
          <strong id="cartTotal">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}</strong>
        </div>
        <button className="btn btn-light w-100 mt-3" disabled={items.length === 0} onClick={() => alert('Checkout demo')}>Comprar (demo)</button>
        <button className="btn btn-outline-light w-100 mt-2" onClick={clearCart} disabled={items.length === 0}>Vaciar carrito</button>
      </div>
    </div>
  )
}
