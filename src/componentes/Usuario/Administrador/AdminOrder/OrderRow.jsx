import React from 'react'

export default function OrderRow({ order, onView = () => {}, onUpdateStatus = () => {} }) {
  const estado = (order.estado || '').toLowerCase()

  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.fecha_orden || order.created_at}</td>
      <td>{order.total ? `$${Number(order.total).toLocaleString()}` : '-'}</td>
      <td>{estado}</td>
      <td>{order.user_id}</td>
      <td>
        <div className="actions">
          <button className="btn btn-view" onClick={() => onView(order)}>
            Ver
          </button>

          {/* Aceptar → enviado */}
          {estado !== 'enviado' && (
            <button
              className="btn btn-accept"
              onClick={() => onUpdateStatus(order.id, 'enviado')}
            >
              Aceptar
            </button>
          )}

          {/* Rechazar */}
          {estado !== 'rechazado' && (
            <button
              className="btn btn-reject"
              onClick={() => onUpdateStatus(order.id, 'rechazado')}
            >
              Rechazar
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}