import React, { useMemo, useState } from 'react'
import './AdminList.css'

export default function AdminList({
  data = [],
  columns = [],
  onEdit = () => {},
  onDelete = () => {},
  onCreate = () => {},
  pageSizeOptions = [6,12,24],
  initialPageSize = 12,
  showSearch = true,
  filterOptions = [], // [{ key, label, options: [{value,label}] }]
  showCreate = false,
  title = '',
}){
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState(() => ({}))

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim()
    return data.filter(item => {
      // apply filters
      for (const fkey of Object.keys(filters)){
        const fval = filters[fkey]
        if (fval && String((item[fkey] ?? '')).toLowerCase() !== String(fval).toLowerCase()) return false
      }
      if (!q) return true
      return columns.some(col => {
        const val = col.key ? (item[col.key] ?? '') : ''
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(q)
        }
        return false
      })
    })
  }, [data, query, columns, filters])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paged = filtered.slice((currentPage-1)*pageSize, currentPage*pageSize)

  function handlePageSize(e){
    const v = Number(e.target.value)
    setPageSize(v)
    setCurrentPage(1)
  }

  return (
    <div className="admin-list">
      {title && <div className="admin-list-header d-flex justify-content-between align-items-center mb-2">
        <h4 style={{margin:0}}>{title}</h4>
        <div className="d-flex align-items-center gap-2">
          {filterOptions.map(f => (
            <select key={f.key} className="form-select form-select-sm" value={filters[f.key] || ''} onChange={e => { setFilters(s => ({ ...s, [f.key]: e.target.value })); setCurrentPage(1) }}>
              <option value="">{f.label}</option>
              {f.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ))}
          {showSearch && (
            <input className="form-control form-control-sm" placeholder="Buscar..." value={query} onChange={e => { setQuery(e.target.value); setCurrentPage(1) }} />
          )}
          {showCreate && (
            <button className="btn btn-sm btn-primary" onClick={onCreate}>Crear</button>
          )}
        </div>
      </div>}

      <div className="table-responsive admin-list-table">
        <table className="table table-sm">
          <thead>
            <tr>
              {columns.map(col => <th key={col.key || col.label}>{col.label}</th>)}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {total === 0 && (
              <tr><td colSpan={columns.length + 1}>No hay registros.</td></tr>
            )}
            {paged.map(item => (
              <tr key={item.id}>
                {columns.map(col => (
                  <td key={col.key || col.label}>
                    {col.render ? col.render(item) : (item[col.key] ?? '')}
                  </td>
                ))}
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(item)}>Editar</button>
                  {String((item.rol || item.role || '')).toLowerCase() !== 'administrador' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards view */}
      <div className="admin-list-cards">
        {paged.map(item => (
          <div className="admin-list-card" key={item.id}>
            <div className="admin-list-card-body">
              {columns.map(col => (
                <div className="admin-list-card-row" key={col.key || col.label}>
                  <div className="label">{col.label}</div>
                  <div className="value">{col.render ? col.render(item) : (item[col.key] ?? '')}</div>
                </div>
              ))}
              <div className="admin-list-card-actions">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(item)}>Editar</button>
                {String((item.rol || item.role || '')).toLowerCase() !== 'administrador' && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item)}>Eliminar</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">Mostrando {total === 0 ? 0 : ( (currentPage-1)*pageSize + 1)} - {Math.min(currentPage*pageSize, total)} de {total}</div>
        <div className="d-flex align-items-center">
          <select className="form-select form-select-sm d-inline-block me-2" style={{width:120}} value={pageSize} onChange={handlePageSize}>
            {pageSizeOptions.map(opt => <option key={opt} value={opt}>{opt} / página</option>)}
          </select>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={currentPage<=1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Anterior</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={currentPage>=totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}
