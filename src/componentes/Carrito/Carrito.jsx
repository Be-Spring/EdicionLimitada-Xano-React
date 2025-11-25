// src/componentes/Carrito/Carrito.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { createOrden } from '../../api/xano.js'
import './Carrito.css'

export default function Carrito() {
  const { items, total, removeFromCart, updateQuantity, clearCart, isOpen, closeCart } = useContext(CartContext)
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirmPayment() {
    setError(null)

    // 1) Si NO hay sesión → cerrar carrito y llevar a login
    if (!user || !token) {
      closeCart()
      navigate('/sesion')
      return
    }

    // 2) Si el carrito está vacío, no hacemos nada
    if (!items.length || total <= 0) {
      setError('Tu carrito está vacío.')
      return
    }

    setLoading(true)
    try {
      // 3) Crear orden en Xano
      const orden = await createOrden({
        token,
        userId: user.id,
        total,
        estado: 'pendiente', // como definiste en la tabla
      })

      // 4) Vaciar carrito y mostrar mensaje
      clearCart()
      alert(`Pago aceptado (simulado). Orden creada #${orden?.id ?? ''}`)
      closeCart()
    } catch (e) {
      console.error('Error creando orden', e)
      setError(e?.message || 'No se pudo registrar el pago.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer bg-dark text-white ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-header border-bottom border-secondary px-3 py-3 d-flex justify-content-between align-items-center">
          <h5 className="michroma-regular mb-0">
            <i className="fas fa-shopping-cart me-2" /> Tu carrito
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Cerrar"
            onClick={closeCart}
          ></button>
        </div>

        <div className="cart-body px-3 py-3">
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-muted">Tu carrito está vacío</div>
          ) : (
            <ul className="list-group list-group-flush">
              {items.map((it) => (
                <li
                  key={it.product.id}
                  className="list-group-item bg-dark border-0 d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: 'cover',
                        borderRadius: 6,
                      }}
                    />
                    <div>
                      <div className="fw-bold">{it.product.name}</div>
                      <div className="text-muted small">{it.product.designer}</div>
                      <div className="text-light small">
                        {new Intl.NumberFormat('es-CL', {
                          style: 'currency',
                          currency: 'CLP',
                        }).format(it.product.price)}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        updateQuantity(it.product.id, Number(e.target.value) || 1)
                      }
                      style={{ width: 64 }}
                      className="form-control form-control-sm"
                    />
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => removeFromCart(it.product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-footer px-3 pb-3">
          <div className="d-flex justify-content-between align-items-center border-top border-secondary pt-3">
            <span className="text-muted">Total</span>
            <strong id="cartTotal">
              {new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
              }).format(total)}
            </strong>
          </div>

          <button
            className="btn btn-light w-100 mt-3"
            disabled={items.length === 0 || loading}
            onClick={handleConfirmPayment}
          >
            {loading ? 'Procesando...' : 'Confirmar pago (simulado)'}
          </button>

          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={clearCart}
            disabled={items.length === 0 || loading}
          >
            Vaciar carrito
          </button>
        </div>
      </aside>
    </>
  )
}

// CardBase lo dejo igual que lo tenías
export const CardBase = ({ image, title, subtitle, onClick, children }) => {
  return (
    <div className="product-card-zoom">
      <div className="product-image-container">
        <img
          src={image}
          alt={title}
          className="product-image w-100"
          onClick={onClick}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        />
      </div>
      <div className="p-3">
        <h5 className="mb-2">{title}</h5>
        {subtitle && <p className="text-muted mb-2">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}