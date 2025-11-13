import React from 'react'
import OrderRow from './OrderRow.jsx'
import './OrdersTable.css'

export default function OrdersTable({ orders = [], onView = () => {}, onUpdateStatus = () => {} }){
  return (
    <div className="orders-table card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <OrderRow key={o.id} order={o} onView={onView} onUpdateStatus={onUpdateStatus} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
