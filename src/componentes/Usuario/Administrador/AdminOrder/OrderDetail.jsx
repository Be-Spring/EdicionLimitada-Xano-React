import React from 'react'
import './OrderDetail.css'

export default function OrderDetail({ order, onClose = () => {}, onUpdateStatus = () => {} }) {
  const estado = (order.estado || '').toLowerCase()

  return (
    <div className="order-detail-overlay">
      <div className="order-detail-card card">
        <div className="detail-header d-flex justify-content-between align-items-center">
          <h4>Orden #{order.id}</h4>
          <div>
            <button className="btn-close" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>

        <div className="detail-body">
          <p>
            <strong>Fecha:</strong> {order.fecha_orden || order.created_at}
          </p>
          <p>
            <strong>Total:</strong>{' '}
            {order.total ? `$${Number(order.total).toLocaleString()}` : '-'}
          </p>
          <p>
            <strong>Estado:</strong> {estado}
          </p>
          <p>
            <strong>Usuario ID:</strong> {order.user_id}
          </p>
          <hr />
          <p>
            <em>Items y detalles — placeholder (se conectará a API luego).</em>
          </p>
        </div>

        <div className="detail-actions">
          {estado !== 'enviado' && (
            <button
              className="btn btn-accept"
              onClick={() => onUpdateStatus(order.id, 'enviado')}
            >
              Aceptar y marcar enviado
            </button>
          )}
          {estado !== 'rechazado' && (
            <button
              className="btn btn-reject"
              onClick={() => onUpdateStatus(order.id, 'rechazado')}
            >
              Rechazar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}