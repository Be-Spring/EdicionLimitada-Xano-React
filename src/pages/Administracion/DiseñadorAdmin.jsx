import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './admin.css'

function readDesigners() {
  try { const raw = localStorage.getItem('admin_designers'); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

export default function DiseñadorAdmin() {
  const [designers, setDesigners] = useState(() => readDesigners())

  useEffect(() => { try { localStorage.setItem('admin_designers', JSON.stringify(designers)) } catch {} }, [designers])

  const handleDelete = (id) => {
    if (!confirm('Eliminar diseñador?')) return
    setDesigners(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="admin-layout bg-black text-light">
      <main className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="michroma-regular">Diseñadores</h2>
          <Link to="add" className="btn btn-outline-light">Agregar diseñador</Link>
        </div>

        <div className="card bg-dark p-3">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IMAGEN</th>
                  <th>NOMBRE / MARCA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {designers.length === 0 && <tr><td colSpan={4} className="text-muted">No hay diseñadores</td></tr>}
                {designers.map(d => (
                  <tr key={d.id}>
                    <td style={{ width: 80 }}>{d.id}</td>
                    <td style={{ width: 96 }}>{d.image ? <img src={d.image} alt={d.name} style={{ width: 64, height: 64, objectFit: 'cover' }} /> : <div className="text-muted">-</div>}</td>
                    <td>
                      <div className="fw-bold">{d.name}</div>
                      <div className="small text-muted">{d.description?.slice(0, 80)}</div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`edit/${d.id}`} className="btn btn-sm btn-warning">Editar</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
