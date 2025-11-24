import React, { useEffect, useState } from 'react'
import './ProductList.css'
import { listProducts } from '../../../../api/xano.js'
import { useAuth } from '../../../../context/AuthContext.jsx'

export default function ProductList({ onEdit = () => {}, onDelete = () => {}, refreshFlag = 0 }){
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [designerMap, setDesignerMap] = useState({})
  const [categoryMap, setCategoryMap] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDesigner, setFilterDesigner] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await listProducts({ token, limit: 200, offset: 0 })
        if (!mounted) return
        setProducts(res || [])
      } catch (e) {
        console.error('listProducts failed', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    // fetch designers and categories to map ids -> names
    ;(async () => {
      try {
        const h = token ? { Authorization: `Bearer ${token}` } : {}
        const r1 = await fetch(`${import.meta.env.VITE_XANO_STORE_BASE}/disenador`, { headers: h })
        if (r1.ok) {
          const d = await r1.json().catch(() => null)
          const arr = Array.isArray(d) ? d : d?.items ?? d?.data ?? []
          const map = {}
          arr.forEach(it => { if (it) map[it.id] = it.nombre_disenador || it.name || it.nombre || it.id })
          if (mounted) setDesignerMap(map)
        }
      } catch (e) { }

      try {
        const h = token ? { Authorization: `Bearer ${token}` } : {}
        const r2 = await fetch(`${import.meta.env.VITE_XANO_STORE_BASE}/categoria`, { headers: h })
        if (r2.ok) {
          const d2 = await r2.json().catch(() => null)
          const arr2 = Array.isArray(d2) ? d2 : d2?.items ?? d2?.data ?? []
          const map2 = {}
          arr2.forEach(it => { if (it) map2[it.id] = it.tipo_producto || it.nombre || it.name || it.id })
          if (mounted) setCategoryMap(map2)
        }
      } catch (e) { }
    })()
    return () => { mounted = false }
  }, [token, refreshFlag])

  if (loading) return <div>Cargando productos...</div>

  // apply filters
  const filtered = products.filter(p => {
    const raw = p.raw || p
    if (filterCategory) {
      const cat = raw.categoria ?? p.categoria
      if (typeof cat === 'object') {
        if (String(cat.id) !== String(filterCategory)) return false
      } else {
        if (String(cat) !== String(filterCategory)) return false
      }
    }
    if (filterDesigner) {
      const d = raw.disenador ?? p.disenador
      if (typeof d === 'object') {
        if (String(d.id) !== String(filterDesigner) && String(d.nombre_disenador || d.name || '') !== String(filterDesigner)) return false
      } else {
        if (String(d) !== String(filterDesigner)) return false
      }
    }
    return true
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paged = filtered.slice((currentPage-1)*pageSize, currentPage*pageSize)

  return (
    <div className="admin-product-list">
      <div className="mb-3">
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1) }}>
              <option value="">Todas las categorías</option>
              {Object.keys(categoryMap).map(k => <option key={k} value={k}>{categoryMap[k]}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterDesigner} onChange={e => { setFilterDesigner(e.target.value); setCurrentPage(1) }}>
              <option value="">Todos los diseñadores</option>
              {Object.keys(designerMap).map(k => <option key={k} value={k}>{designerMap[k]}</option>)}
            </select>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <button className="btn btn-secondary" onClick={() => { setFilterCategory(''); setFilterDesigner(''); setCurrentPage(1) }}>Limpiar filtros</button>
          </div>
        </div>
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Diseñador</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paged.map(p => {
            const raw = p.raw || p
            // normalize images like client ProductCard does
            const sourceImages = Array.isArray(p.images) && p.images.length ? p.images : (Array.isArray(raw.images) ? raw.images : [])
            const normalized = sourceImages.map(it => (typeof it === 'string' ? it : (it?.url || it?.path))).filter(Boolean)
            const thumb = normalized[0] || raw.imagen || raw.imagen_producto || '/src/assets/img/img_placeholder.png'
            const name = raw.nombre_producto || p.name || raw.name || raw.title || 'Producto'
            // designer and category may be ids; prefer mapped names
            let designer = ''
            if (raw.disenador) {
              if (typeof raw.disenador === 'object') designer = raw.disenador.nombre_disenador || raw.disenador.name || ''
              else designer = designerMap[raw.disenador] || raw.disenador_nombre || raw.disenador || ''
            }
            const price = raw.valor_producto || p.price || raw.price || ''
            const stock = raw.stock || ''
            let category = ''
            if (raw.categoria) {
              if (typeof raw.categoria === 'object') category = raw.categoria.nombre || raw.categoria.name || ''
              else category = categoryMap[raw.categoria] || raw.categoria || ''
            }

            return (
              <tr key={p.id || raw.id}>
                <td style={{width:100}}><img src={thumb} alt="thumb" style={{width:80,height:80,objectFit:'cover',borderRadius:6}} /></td>
                <td>{name}</td>
                <td>{designer}</td>
                <td>{price}</td>
                <td>{stock}</td>
                <td>{category}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(raw)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(raw)}>Eliminar</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
