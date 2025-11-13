import React from 'react'

export default function OrderRow({ order, onView = () => {}, onUpdateStatus = () => {} }){
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.fecha_orden || order.created_at}</td>
      <td>{order.total ? `$${Number(order.total).toLocaleString()}` : '-'}</td>
      <td>{order.estado}</td>
      <td>{order.user_id}</td>
      <td>
        <div className="actions">
          <button className="btn btn-view" onClick={() => onView(order)}>Ver</button>
          {order.estado !== 'accepted' && <button className="btn btn-accept" onClick={() => onUpdateStatus(order.id, 'accepted')}>Aceptar</button>}
          {order.estado !== 'rejected' && <button className="btn btn-reject" onClick={() => onUpdateStatus(order.id, 'rejected')}>Rechazar</button>}
        </div>
      </td>
    </tr>
  )
}
