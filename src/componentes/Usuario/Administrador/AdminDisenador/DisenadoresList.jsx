import React, { useEffect, useState } from 'react'
import './DisenadoresList.css'
import DisenadorCard from './DisenadorCard.jsx'
import { useAuth } from '../../../../context/AuthContext.jsx'
import { listDesigners, deleteDesigner } from '../../../../api/xano.js'

export default function DisenadoresList({ onEdit = () => {}, onDelete = () => {}, refreshFlag = 0 }){
  const { token } = useAuth()
  const [designers, setDesigners] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const ds = await listDesigners({ token })
        if (!mounted) return
        setDesigners(ds || [])
      } catch (e) {
        console.error('listDesigners failed', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [token, refreshFlag])

  if (loading) return <div>Cargando diseñadores...</div>

  const total = designers.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paged = designers.slice((currentPage-1)*pageSize, currentPage*pageSize)

  return (
    <div className="disenadores-list">
      <div className="cards-grid">
        {paged.map(d => {
          const raw = d.raw || d
          const imgs = Array.isArray(d.images) ? d.images : (Array.isArray(raw.images) ? raw.images : (raw.images && typeof raw.images === 'object' ? [raw.images] : []))
          const first = imgs[0]
          const avatar = (typeof first === 'string' ? first : (first?.url || first?.path)) || '/src/assets/img/img_placeholder.png'
          const designerObj = { ...raw, avatar }
          return (
            <DisenadorCard key={d.id} designer={designerObj} onEdit={() => onEdit(raw)} onDelete={() => { if (!confirm('Eliminar diseñador?')) return; deleteDesigner(token, raw.id).then(()=>onDelete(raw)).catch(e=>{console.error(e); alert(e.message||'Error')}) }} />
          )
        })}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">Mostrando {Math.min((currentPage-1)*pageSize+1, total)} - {Math.min(currentPage*pageSize, total)} de {total}</div>
        <div>
          <select className="form-select form-select-sm d-inline-block me-2" style={{width:120}} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}>
            <option value={6}>6 / página</option>
            <option value={12}>12 / página</option>
            <option value={24}>24 / página</option>
          </select>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={currentPage<=1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Anterior</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage>=totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}
