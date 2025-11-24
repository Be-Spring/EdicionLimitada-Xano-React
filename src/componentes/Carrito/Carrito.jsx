import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { createOrden, updateUser } from '../../api/xano.js'
import './Carrito.css'

export default function Carrito() {
  const navigate = useNavigate()
  const { items, total, removeFromCart, updateQuantity, clearCart, isOpen, closeCart } = useContext(CartContext)
  const { user, token } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [needsAddress, setNeedsAddress] = useState(false)
  const [direccion, setDireccion] = useState('')

  // Paso 1: click en "Pagar carrito"
  async function handleStartCheckout() {
    setError(null)

    // Sin sesión → mandamos a login de cliente
    if (!user || !token) {
      closeCart()
      navigate('/sesion')
      return
    }

    // Si no tiene dirección guardada, pedimos que la ingrese
    if (!user.direccion_envio && !needsAddress) {
      setNeedsAddress(true)
      return
    }

    // Si ya tiene dirección → enviar orden directamente
    await handleConfirmCheckout()
  }

  // Paso 2: confirmar (y opcionalmente guardar dirección) + crear orden
  async function handleConfirmCheckout() {
    setError(null)

    if (!user || !token) {
      closeCart()
      navigate('/sesion')
      return
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    try {
      setLoading(true)

      // Si estamos pidiendo dirección y el usuario escribió algo, actualizamos en la BD
      if (needsAddress && direccion.trim()) {
        await updateUser({
          token,
          userId: user.id,
          patch: { direccion_envio: direccion.trim() },
        })
        // Nota: el AuthContext no expone setUser, así que el cambio se verá
        // al recargar o cuando en el futuro llamemos de nuevo a authMe().
      }

      // Creamos la orden PENDIENTE
      await createOrden({
        token,
        userId: user.id,
        total,
        estado: 'pendiente',
      })

      clearCart()
      setNeedsAddress(false)
      setDireccion('')
      closeCart()
      alert('Tu pedido fue registrado. Estado: pendiente de aprobación.')
    } catch (e) {
      setError(e?.message || 'Error al procesar el pago.')
    } finally {
      setLoading(false)
    }
  }

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(total)

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
                      style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }}
                    />
                    <div>
                      <div className="fw-bold">{it.product.name}</div>
                      <div className="text-muted small">{it.product.designer}</div>
                      <div className="text-light small">
                        {new Intl.NumberFormat('es-CL', {
                          style: 'currency',
                          currency: 'CLP'
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
            <strong id="cartTotal">{formattedTotal}</strong>
          </div>

          {/* Si falta dirección, mostramos campo para capturarla */}
          {needsAddress && (
            <div className="mt-3">
              <label className="form-label">Dirección de envío</label>
              <textarea
                className="form-control form-control-sm"
                rows={2}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ingresa tu dirección de envío"
              />
              <small className="text-muted">
                Guardaremos esta dirección en tu perfil.
              </small>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3 py-2">
              {error}
            </div>
          )}

          <button
            className="btn btn-light w-100 mt-3"
            disabled={items.length === 0 || loading}
            onClick={needsAddress ? handleConfirmCheckout : handleStartCheckout}
          >
            {loading
              ? 'Procesando...'
              : needsAddress
              ? 'Confirmar pago'
              : 'Pagar carrito'}
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

// CardBase se mantiene igual
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
