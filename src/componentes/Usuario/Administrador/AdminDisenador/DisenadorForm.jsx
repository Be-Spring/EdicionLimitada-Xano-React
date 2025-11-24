import React, { useState, useEffect } from 'react'
import './DisenadorForm.css'

// Similar pattern to ProductForm: support existing images (keep/remove) and new file uploads
export default function DisenadorForm({ initial = null, onSave = () => {}, onCancel = () => {} }){
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const MAX_WORDS = 250
  const [files, setFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [removedImages, setRemovedImages] = useState(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre_disenador || '')
      setDescripcion(initial.descripcion || initial.description || '')
      const imgs = Array.isArray(initial.images) ? initial.images : (initial.raw && Array.isArray(initial.raw.images) ? initial.raw.images : (initial.images && typeof initial.images === 'object' ? [initial.images] : []))
      const normalized = (imgs || []).map(it => {
        if (!it) return null
        if (typeof it === 'string') return { path: it }
        if (it.path) return it
        if (it.url) return { path: it.url }
        return it
      }).filter(Boolean)
      setExistingImages(normalized)
    } else {
      setNombre('')
      setExistingImages([])
    }
    setRemovedImages(new Set())
    setFiles([])
  }, [initial])

  const onFilesChange = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...list])
  }

  function toggleRemoveImage(idx){
    setRemovedImages(prev => {
      const copy = new Set(Array.from(prev))
      if (copy.has(idx)) copy.delete(idx)
      else copy.add(idx)
      return copy
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const kept = existingImages
      .filter((_, i) => !removedImages.has(i))
      .map(im => {
        const path = im.path || im.url || ''
        if (!path) return null
        const meta = im.meta && typeof im.meta === 'object' ? im.meta : { width: im.width || 0, height: im.height || 0 }
        return { path, type: im.type || 'image', meta }
      })
      .filter(Boolean)
    try {
      // Ensure description respects max words
      const words = (descripcion || '').trim().split(/\s+/).filter(Boolean)
      const descSafe = words.length > MAX_WORDS ? words.slice(0, MAX_WORDS).join(' ') : descripcion
      const payload = { id: initial?.id || null, nombre_disenador: nombre, images: files, keepImages: kept }
      // include descripcion only when editing (initial exists) or when provided
      if (initial || (descSafe && descSafe.trim())) payload.descripcion = descSafe
      await onSave(payload)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="disenador-form card p-3">
      <h4>{initial ? 'Editar Diseñador' : 'Nuevo Diseñador'}</h4>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

          <div className="mb-3">
            <label className="form-label">Descripción (máx. 250 palabras)</label>
            <textarea className="form-control" rows={4} value={descripcion} onChange={(e) => {
              // limit to MAX_WORDS words
              const v = e.target.value || ''
              const parts = v.trim().split(/\s+/).filter(Boolean)
              if (parts.length <= MAX_WORDS) setDescripcion(v)
              else setDescripcion(parts.slice(0, MAX_WORDS).join(' '))
            }} />
            <div style={{fontSize:12, color:'#666', marginTop:6}}>{(descripcion || '').trim().split(/\s+/).filter(Boolean).length} / {MAX_WORDS} palabras</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Imágenes (múltiples)</label>
            <input className="form-control" type="file" multiple accept="image/*" onChange={onFilesChange} />
          </div>

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

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
