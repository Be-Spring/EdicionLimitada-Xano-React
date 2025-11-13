import React, { useState, useEffect } from 'react'
import './DisenadorForm.css'

export default function DisenadorForm({ initial = null, onSave = () => {}, onCancel = () => {} }){
  const [nombre, setNombre] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (initial) {
      setNombre(initial.nombre_disenador || '')
      setAvatar(initial.avatar || '')
    } else {
      setNombre('')
      setAvatar('')
    }
  }, [initial])

  function submit(e){
    e.preventDefault()
    const payload = { id: initial?.id || null, nombre_disenador: nombre, avatar }
    onSave(payload)
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
          <label className="form-label">URL Imagen (temporal)</label>
          <input className="form-control" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
