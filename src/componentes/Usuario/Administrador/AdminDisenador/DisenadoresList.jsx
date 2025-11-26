import React, { useEffect, useState } from 'react'
import './DisenadoresList.css'
import DisenadorCard from './DisenadorCard.jsx'
import { useAuth } from '../../../../context/AuthContext.jsx'
import { listDesigners, deleteDesigner } from '../../../../api/xano.js'

export default function DisenadoresList({ onEdit = () => {}, onDelete = () => {}, refreshFlag = 0 }){
  const { token } = useAuth()
  const [designers, setDesigners] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmDesigner, setConfirmDesigner] = useState(null)
  const [deleting, setDeleting] = useState(false)
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
            <DisenadorCard key={d.id} designer={designerObj} onEdit={() => onEdit(raw)} onDelete={() => setConfirmDesigner(raw)} />
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

      {/* Confirmation modal for deleting a designer */}
      {confirmDesigner && (
        <div className="modal-backdrop" onClick={() => { if (!deleting) setConfirmDesigner(null) }} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1050}}>
          <div className="card p-3" onClick={e => e.stopPropagation()} style={{width:420,backgroundColor:'#222',color:'#f7f7f7',borderRadius:8,boxShadow:'0 6px 18px rgba(0,0,0,0.4)'}}>
              <h5 className="mb-2">Confirmar eliminación</h5>
              <p style={{color:'#e9e9ea'}}>¿Desea eliminar al diseñador <strong style={{color:'#fff'}}>{confirmDesigner.nombre_disenador || confirmDesigner.name || ''}</strong>?</p>
              <div className="d-flex justify-content-end" style={{gap:8}}>
                <button className="btn btn-light" onClick={() => setConfirmDesigner(null)} disabled={deleting}>Cancelar</button>
                <button className="btn btn-danger" onClick={async () => {
                if (!confirmDesigner?.id) return setConfirmDesigner(null)
                setDeleting(true)
                try {
                  await deleteDesigner(token, confirmDesigner.id)
                  setConfirmDesigner(null)
                  onDelete(confirmDesigner)
                } catch (err) {
                  console.error('deleteDesigner failed', err)
                  alert(err?.message || 'Error eliminando diseñador')
                } finally {
                  setDeleting(false)
                }
                }} disabled={deleting}>{deleting ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
