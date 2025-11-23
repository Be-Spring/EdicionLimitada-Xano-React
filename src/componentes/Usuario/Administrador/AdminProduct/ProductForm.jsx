import React, { useState, useEffect } from 'react'
import './ProductForm.css'

// ProductForm: UI-only component matching product table fields
// Fields (based on your DB): images, nombre_producto, disenador, valor_producto, stock, categoria, descripcion
export default function ProductForm({ initial = null, onSave = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({
    nombre_producto: initial?.nombre_producto || '',
    descripcion: initial?.descripcion || '',
    valor_producto: initial?.valor_producto || 0,
    stock: initial?.stock || 0,
    categoria: initial?.categoria || '',
    disenador: initial?.disenador || '',
  })
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        nombre_producto: initial.nombre_producto || '',
        descripcion: initial.descripcion || '',
        valor_producto: initial.valor_producto || 0,
        stock: initial.stock || 0,
        categoria: initial.categoria || '',
        disenador: initial.disenador || '',
      })
    }
  }, [initial])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'valor_producto' || name === 'stock' ? Number(value) : value }))
  }

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles(list)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Enviando al servidor...')
    // Pass payload (including File[] as images) to parent which will call API
    const payload = { ...form, images: files }
    try {
      await onSave(payload)
      setStatus('Guardado correctamente')
    } catch (err) {
      console.error('ProductForm save error', err)
      setStatus(err?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-product-form card p-3">
      <h3>{initial ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      <form onSubmit={handleSave}>
        <label className="form-group">
          <span>Nombre</span>
          <input name="nombre_producto" value={form.nombre_producto} onChange={onChange} required />
        </label>

        <label className="form-group">
          <span>Descripción</span>
          <textarea name="descripcion" value={form.descripcion} onChange={onChange} rows={4} />
        </label>

        <div className="row two-cols">
          <label className="form-group">
            <span>Precio</span>
            <input type="number" name="valor_producto" value={form.valor_producto} onChange={onChange} />
          </label>
          <label className="form-group">
            <span>Stock</span>
            <input type="number" name="stock" value={form.stock} onChange={onChange} />
          </label>
        </div>

        <label className="form-group">
          <span>Categoría</span>
          <input name="categoria" value={form.categoria} onChange={onChange} />
        </label>

        <label className="form-group">
          <span>Diseñador (ID)</span>
          <input name="disenador" value={form.disenador} onChange={onChange} />
        </label>

        <label className="form-group file-group">
          <span>Imágenes (múltiples)</span>
          <input type="file" multiple accept="image/*" onChange={onFilesChange} />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        </div>
      </form>

      <div className="form-status">
        <small>{status}</small>
      </div>
    </div>
  )
}