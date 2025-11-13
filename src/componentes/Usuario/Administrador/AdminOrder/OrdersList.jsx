import React, { useState } from 'react'
import OrdersTable from './OrdersTable.jsx'
import OrderDetail from './OrderDetail.jsx'
import './OrdersList.css'

const MOCK_ORDERS = [
  { id: 101, created_at: '2025-11-01', total: 45000, estado: 'pending', fecha_orden: '2025-11-01', user_id: 12, carrito_id: 201 },
  { id: 102, created_at: '2025-11-02', total: 12000, estado: 'accepted', fecha_orden: '2025-11-02', user_id: 34, carrito_id: 202 },
  { id: 103, created_at: '2025-11-03', total: 7800, estado: 'rejected', fecha_orden: '2025-11-03', user_id: 7, carrito_id: 203 }
]

export default function OrdersList(){
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [selected, setSelected] = useState(null)

  function handleView(order){
    setSelected(order)
  }

  function handleCloseDetail(){
    setSelected(null)
  }

  function handleUpdateStatus(orderId, status){
    setOrders((prev) => prev.map(o => o.id === orderId ? { ...o, estado: status } : o))
  }

  return (
    <div className="admin-orders">
      <h3 className="mb-3">Órdenes</h3>
      <OrdersTable orders={orders} onView={handleView} onUpdateStatus={handleUpdateStatus} />
      {selected && <OrderDetail order={selected} onClose={handleCloseDetail} onUpdateStatus={handleUpdateStatus} />}
    </div>
  )
}
