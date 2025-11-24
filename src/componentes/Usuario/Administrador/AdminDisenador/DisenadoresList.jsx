import React, { useEffect, useState } from 'react'
import './DisenadoresList.css'
import DisenadorCard from './DisenadorCard.jsx'
import { useAuth } from '../../../../context/AuthContext.jsx'
import { listDesigners, deleteDesigner } from '../../../../api/xano.js'

export default function DisenadoresList({ onEdit = () => {}, onDelete = () => {}, refreshFlag = 0 }){
  const { token } = useAuth()
  const [designers, setDesigners] = useState([])
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="disenadores-list">
      <div className="cards-grid">
        {designers.map(d => {
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
    </div>
  )
}
