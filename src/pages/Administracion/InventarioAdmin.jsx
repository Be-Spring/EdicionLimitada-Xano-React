import React, { useEffect, useState } from 'react'
import './admin.css'

function readProducts() {
  try {
    const raw = localStorage.getItem('admin_products')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function formatPrice(v) {
  if (v == null || v === '') return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  return '$' + n.toLocaleString('es-CL')
}

export default function InventarioAdmin() {
  const [products, setProducts] = useState(() => readProducts())
  const [editing, setEditing] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    try { localStorage.setItem('admin_products', JSON.stringify(products)) } catch {}
  }, [products])

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const handleDelete = (id) => {
    if (!confirm('Eliminar producto? Esta acción no se puede deshacer.')) return
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const startEdit = (p) => {
    setEditing({ ...p })
    setImageFile(null)
    setImagePreview(p.image || null)
  }

  const cancelEdit = () => {
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const saveEdit = (e) => {
    e.preventDefault()
    if (!editing) return
    const updated = { ...editing }
    if (imagePreview) updated.image = imagePreview
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
    cancelEdit()
  }

  const onEditChange = (field, value) => setEditing(prev => ({ ...prev, [field]: value }))

  return (
    <div className="admin-layout bg-black text-light">
      <main className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="michroma-regular">Inventario</h2>
        </div>

        {editing && (
          <div className="card bg-dark p-3 mb-4">
            <h5 className="mb-3">Editar producto</h5>
            <form onSubmit={saveEdit} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" value={editing.name || ''} onChange={e => onEditChange('name', e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Diseñador</label>
                <input className="form-control" value={editing.designer || ''} onChange={e => onEditChange('designer', e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Precio</label>
                <input className="form-control" value={editing.price || ''} onChange={e => onEditChange('price', e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Stock</label>
                <input type="number" min="0" className="form-control" value={editing.quantity || 0} onChange={e => onEditChange('quantity', e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Imagen</label>
                <input type="file" accept="image/*" className="form-control" onChange={e => setImageFile(e.target.files && e.target.files[0])} />
              </div>

              {imagePreview && (
                <div className="col-12">
                  <div className="mb-2">Vista previa:</div>
                  <img src={imagePreview} alt="preview" style={{ maxWidth: 140 }} />
                </div>
              )}

              <div className="col-12 d-flex gap-2">
                <button className="btn btn-success">Guardar cambios</button>
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
                  <th>IMAGEN</th>
                  <th>NOMBRE</th>
                  <th>DISEÑADOR</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={7} className="text-muted">No hay productos registrados</td></tr>
                )}
                {products.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td style={{ width: 70 }}>{p.id}</td>
                    <td style={{ width: 90 }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width: 56, height: 56, objectFit: 'cover' }} /> : <div className="text-muted">-</div>}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.designer || p.author || '-'}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.quantity ?? 0}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-warning" onClick={() => startEdit(p)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
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
