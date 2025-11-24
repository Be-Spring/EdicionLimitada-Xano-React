import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext.jsx'
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
  const [existingImages, setExistingImages] = useState([])
  const [removedImages, setRemovedImages] = useState(new Set())
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [designers, setDesigners] = useState([])
  const [categories, setCategories] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (initial) {
      setForm({
        nombre_producto: initial.nombre_producto || '',
        descripcion: initial.descripcion || '',
        valor_producto: initial.valor_producto || 0,
        stock: initial.stock || 0,
        categoria: (initial.categoria && (initial.categoria.id ?? initial.categoria)) || initial.categoria || '',
        disenador: (initial.disenador && (initial.disenador.id ?? initial.disenador)) || initial.disenador || '',
      })
      // extract existing images (try common shapes)
      const imgs = (initial.images && Array.isArray(initial.images) && initial.images.length)
        ? initial.images
        : (initial.raw && initial.raw.images && Array.isArray(initial.raw.images) ? initial.raw.images : [])
      // normalize to objects with path/url
      const normalized = (imgs || []).map((it) => {
        if (!it) return null
        if (typeof it === 'string') return { path: it }
        if (it.path) return it
        if (it.url) return { path: it.url }
        return it
      }).filter(Boolean)
      setExistingImages(normalized)
    }
  }, [initial])

  useEffect(() => {
    // try to fetch designers and categories from API, but fail silently
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_XANO_STORE_BASE}/disenador`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (res.ok) {
          const data = await res.json().catch(() => null)
          const arr = Array.isArray(data) ? data : data?.items ?? data?.data ?? []
          if (mounted) setDesigners(arr)
        }
      } catch (e) {}

      try {
        const r2 = await fetch(`${import.meta.env.VITE_XANO_STORE_BASE}/categoria`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
        if (r2.ok) {
          const d2 = await r2.json().catch(() => null)
          const arr2 = Array.isArray(d2) ? d2 : d2?.items ?? d2?.data ?? []
          if (mounted) setCategories(arr2)
        }
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [token])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'valor_producto' || name === 'stock' ? Number(value) : value }))
  }

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...list])
  }

  function toggleRemoveImage(idx){
    setRemovedImages(prev => {
      const copy = new Set(Array.from(prev))
      if (copy.has(idx)) copy.delete(idx)
      else copy.add(idx)
      return copy
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('Enviando al servidor...')
    // Pass payload: new File[] as images and keepImages (objects with path+meta) to parent
    const kept = existingImages
      .filter((_, i) => !removedImages.has(i))
      .map((im) => {
        const path = im.path || im.url || ''
        const meta = im.meta && typeof im.meta === 'object'
          ? im.meta
          : { width: im.width || im.metaWidth || 0, height: im.height || im.metaHeight || 0 }
        return { path, type: im.type || 'image', meta }
      })

    const payload = { ...form, images: files, keepImages: kept }
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
          {categories.length ? (
            <select name="categoria" value={form.categoria} onChange={onChange}>
              <option value="">-- seleccionar --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.tipo_producto || c.nombre || c.name || c.id}</option>
              ))}
            </select>
          ) : (
            <input name="categoria" value={form.categoria} onChange={onChange} />
          )}
        </label>

        <label className="form-group">
          <span>Diseñador</span>
          {designers.length ? (
            <select name="disenador" value={form.disenador} onChange={onChange}>
              <option value="">-- seleccionar --</option>
              {designers.map(d => (
                <option key={d.id} value={d.id}>{d.nombre_disenador || d.name || d.id}</option>
              ))}
            </select>
          ) : (
            <input name="disenador" value={form.disenador} onChange={onChange} />
          )}
        </label>

        <label className="form-group file-group">
          <span>Imágenes (múltiples)</span>
          <input type="file" multiple accept="image/*" onChange={onFilesChange} />
        </label>

        {existingImages.length > 0 && (
          <div style={{marginTop:8}}>
            <div style={{fontSize:12, marginBottom:6}}>Imágenes actuales (click para eliminar/recuperar)</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              {existingImages.map((img, idx) => (
                <div key={idx} style={{position:'relative'}}>
                  <img src={img.path || img.url} alt={`img-${idx}`} style={{width:100,height:80,objectFit:'cover',borderRadius:6,opacity: removedImages.has(idx) ? 0.4 : 1}} />
                  <button type="button" onClick={() => toggleRemoveImage(idx)} style={{position:'absolute',right:4,top:4,background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',borderRadius:4,padding:'2px 6px',cursor:'pointer'}}>{removedImages.has(idx) ? 'Recuperar' : 'Eliminar'}</button>
                </div>
              ))}
            </div>
          </div>
        )}

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