import React from 'react'
import './admin.css'

export default function AdminDashboard() {
  return (
    <>
      <h2 className="michroma-regular mb-4">Panel de Administrador</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-dark text-center p-4">
            <i className="fas fa-shopping-cart fa-2x text-white"></i>
            <h3 className="mt-3">127</h3>
            <small className="text-muted">PEDIDOS TOTALES</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-center p-4">
            <i className="fas fa-box fa-2x text-white"></i>
            <h3 className="mt-3">20</h3>
            <small className="text-muted">PRODUCTOS ACTIVOS</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-center p-4">
            <i className="fas fa-users fa-2x text-white"></i>
            <h3 className="mt-3">298</h3>
            <small className="text-muted">CLIENTES REGISTRADOS</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-center p-4">
            <i className="fas fa-palette fa-2x text-white"></i>
            <h3 className="mt-3">28</h3>
            <small className="text-muted">DISEÑADORES ACTIVOS</small>
          </div>
        </div>
      </div>

      <div className="quick-actions d-flex gap-3 flex-wrap">
        <a href="/administrador/productos" className="btn btn-outline-light">Agregar producto</a>
        <a href="/administrador/disenadores/add" className="btn btn-outline-light">Agregar diseñador</a>
        <a href="/administrador/inventario" className="btn btn-outline-light">Ver Stock</a>
        <button className="btn btn-outline-light">Generar reporte</button>
      </div>
    </>
  )
}
