import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './admin.css'

function readDesigners() {
  try { const raw = localStorage.getItem('admin_designers'); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

export default function AddDiseñadorAdmin() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [designers, setDesigners] = useState(() => readDesigners())
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ig, setIg] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    if (!id) return
    const found = designers.find(d => String(d.id) === String(id))
    if (found) {
      setName(found.name || '')
      setDescription(found.description || '')
      setIg(found.ig || '')
      setImagePreview(found.image || null)
    }
  }, [id])

  const save = (e) => {
    e.preventDefault()
    const payload = { id: id ? id : Date.now(), name: name.trim(), description: description.trim(), ig: ig.trim(), image: imagePreview || null }
    let next
    if (id) next = designers.map(d => d.id === payload.id ? payload : d)
    else next = [payload, ...designers]
    setDesigners(next)
    try { 
      localStorage.setItem('admin_designers', JSON.stringify(next)) 
    } catch {
      // ignore localStorage error
    }
    navigate('/administrador/disenadores')
  }

  return (
    <div className="admin-layout bg-black text-light">
      <main className="admin-content">
        <h2 className="michroma-regular mb-4">{id ? 'Editar' : 'Agregar'} Diseñador</h2>

        <div className="card bg-dark p-4">
          <form onSubmit={save} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre / Marca</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Instagram (url)</label>
              <input className="form-control" value={ig} onChange={e => setIg(e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Imagen referencial</label>
              <input type="file" accept="image/*" className="form-control" onChange={e => setImageFile(e.target.files && e.target.files[0])} />
            </div>

            {imagePreview && (
              <div className="col-12">
                <div className="mb-2">Vista previa:</div>
                <img src={imagePreview} alt="preview" style={{ maxWidth: 180 }} />
              </div>
            )}

            <div className="col-12">
              <button className="btn btn-light">Guardar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
