import React, { useState, useEffect } from 'react'
import OrdersTable from './OrdersTable.jsx'
import OrderDetail from './OrderDetail.jsx'
import './OrdersList.css'

// IMPORTA el contexto y las funciones nuevas de Xano
import { useAuth } from '../../../../context/AuthContext.jsx'
import { listOrdenes, updateOrdenEstado } from '../../../../api/xano.js'

export default function OrdersList() {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 1) Cargar órdenes desde Xano al entrar a la página
  useEffect(() => {
    if (!token) return  // por seguridad, aunque AdminRoute ya filtra

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listOrdenes({ token })
        setOrders(data)
      } catch (e) {
        console.error(e)
        setError(e.message || 'Error al cargar órdenes')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  // paginación
  const total = orders.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paged = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleView(order) {
    setSelected(order)
  }

  function handleCloseDetail() {
    setSelected(null)
  }

  // 2) Actualizar estado en Xano + estado local
  async function handleUpdateStatus(orderId, estado) {
    try {
      await updateOrdenEstado({ token, ordenId: orderId, estado })
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, estado } : o)),
      )
      // si estás viendo el detalle de esta misma orden, actualízalo también
      setSelected(prev => (prev?.id === orderId ? { ...prev, estado } : prev))
    } catch (e) {
      console.error(e)
      setError(e.message || 'Error al actualizar estado de la orden')
    }
  }

  return (
    <div className="admin-orders">
      <h3 className="mb-3">Órdenes</h3>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <p>Cargando órdenes…</p>
      ) : (
        <>
          <OrdersTable
            orders={paged}
            onView={handleView}
            onUpdateStatus={handleUpdateStatus}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Mostrando{' '}
              {total === 0
                ? 0
                : Math.min((currentPage - 1) * pageSize + 1, total)}{' '}
              - {Math.min(currentPage * pageSize, total)} de {total}
            </div>
            <div>
              <select
                className="form-select form-select-sm d-inline-block me-2"
                style={{ width: 120 }}
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={5}>5 / página</option>
                <option value={10}>10 / página</option>
                <option value={20}>20 / página</option>
              </select>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      {selected && (
        <OrderDetail
          order={selected}
          onClose={handleCloseDetail}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  )
}
