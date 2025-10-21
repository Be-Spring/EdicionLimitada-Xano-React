import React, { useEffect, useState } from 'react'
import './admin.css'

function readClients() {
  try {
    const raw = localStorage.getItem('admin_clients')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export default function ClientesAdmin() {
  const [clients, setClients] = useState(() => readClients())
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    try { localStorage.setItem('admin_clients', JSON.stringify(clients)) } catch {}
  }, [clients])

  const handleDelete = (id) => {
    if (!confirm('Eliminar cliente?')) return
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const startEdit = (c) => setEditing({ ...c })
  const cancelEdit = () => setEditing(null)

  const saveEdit = (e) => {
    e.preventDefault()
    if (!editing) return
    setClients(prev => prev.map(c => c.id === editing.id ? editing : c))
    cancelEdit()
  }

  const onChange = (field, value) => setEditing(prev => ({ ...prev, [field]: value }))

  return (
    <div className="admin-layout bg-black text-light">
      <main className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="michroma-regular">Clientes</h2>
        </div>

        {editing && (
          <div className="card bg-dark p-3 mb-4">
            <h5 className="mb-3">Editar cliente</h5>
            <form onSubmit={saveEdit} className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={editing.name || ''} onChange={e => onChange('name', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input className="form-control" value={editing.email || ''} onChange={e => onChange('email', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Teléfono</label>
                <input className="form-control" value={editing.phone || ''} onChange={e => onChange('phone', e.target.value)} />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-success">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <div className="card bg-dark p-3">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOMBRE</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 && <tr><td colSpan={5} className="text-muted">No hay clientes registrados</td></tr>}
                {clients.map(c => (
                  <tr key={c.id}>
                    <td style={{ width: 80 }}>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-warning" onClick={() => startEdit(c)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
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
