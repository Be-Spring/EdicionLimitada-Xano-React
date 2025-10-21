import React, { useEffect, useState } from 'react'
import './admin.css'
import { listDesigners, createProduct } from '../../api/xano.js'
// Suponiendo que existe listCategories en xano.js
import { listCategories } from '../../api/xano.js'

export default function ProductosAdmin() {
  const [name, setName] = useState('')
  // Eliminar cantidad, solo usar stock
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [categoria, setCategoria] = useState("")
  const [categoriasList, setCategoriasList] = useState([])
  const [stock, setStock] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedDesigner, setSelectedDesigner] = useState('')
  const [designersList, setDesignersList] = useState([])
  const [price, setPrice] = useState('')
  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_products')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('admin_products', JSON.stringify(products)) } catch {}
  }, [products])

  useEffect(() => {
    if (!imageFiles || imageFiles.length === 0) { setImagePreview(null); return }
    // Mostrar la primera imagen como preview
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(imageFiles[0])
    return () => { reader.onload = null }
  }, [imageFiles])

  useEffect(() => {
    // cargar diseñadores y categorías correctamente
    async function fetchData() {
      try {
        const designers = await listDesigners();
        if (designers && designers.length) setDesignersList(designers)
      } catch (e) {}
      try {
        const categorias = await listCategories();
        if (categorias && categorias.length) setCategoriasList(categorias)
      } catch (e) {}
    }
    fetchData();
  }, [])

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!name.trim()) return;

  const token = localStorage.getItem('auth_token') || null;

  // 1) Subir imágenes (si hay) → obtener array RAW
  let imagesRaw = [];
  if (imageFiles && imageFiles.length > 0) {
    try {
      const { uploadImages } = await import('../../api/xano.js');
      const up = await uploadImages(token, imageFiles);
      // normaliza a array RAW (sin mapear a {url,raw}; Xano necesita path/name/mime…)
      imagesRaw = Array.isArray(up) ? up : (up?.files || []).filter(Boolean);
    } catch (err) {
      console.error('Error subiendo imágenes', err);
      window.dispatchEvent(new CustomEvent('flash', {
        detail: { text: 'Error al subir imágenes. El producto se guardará sin imágenes.', type: 'danger' }
      }));
      imagesRaw = [];
    }
  }

  // 2) Crear producto SIN imágenes (tipos correctos y nombres exactos)
  const createPayload = {
    nombre_producto: name.trim(),
    descripcion: description.trim(),
    valor_producto: price ? Number(price) : 0,
    categoria: categoria ? Number(categoria) : null,
    disenador: selectedDesigner ? Number(selectedDesigner) : null,
    stock: Number(stock) || 0
  };

  try {
    const created = await createProduct(token, createPayload);
    if (!created || !created.id) {
      // fallback si la API devuelve algo inesperado
      setProducts(prev => [createPayload, ...prev]);
      window.dispatchEvent(new CustomEvent('flash', {
        detail: { text: 'Producto guardado localmente (API respondió inesperadamente)', type: 'warning' }
      }));
      return;
    }

    // 3) Adjuntar imágenes por PATCH si hay
    let finalProduct = created;
    if (imagesRaw.length > 0) {
      try {
        const { attachImagesToProduct } = await import('../../api/xano.js');
        // IMPORTANTE: manda el ARRAY RAW tal cual lo devolvió /upload/image
        finalProduct = await attachImagesToProduct(token, created.id, imagesRaw);
      } catch (err) {
        console.error('Error adjuntando imágenes al producto', err);
        window.dispatchEvent(new CustomEvent('flash', {
          detail: { text: 'Producto creado, pero no se pudieron adjuntar las imágenes.', type: 'warning' }
        }));
      }
    }

    // 4) Refrescar lista UI con el producto final
    setProducts(prev => [finalProduct, ...prev]);

  } catch (err) {
    console.error('Error creando producto en Xano', err);
    window.dispatchEvent(new CustomEvent('flash', {
      detail: { text: 'Error creando producto en servidor. Guardado localmente.', type: 'danger' }
    }));
    setProducts(prev => [createPayload, ...prev]); // fallback local
  }

  // 5) reset form
  setName('');
  setDescription('');
  setImageFiles([]);
  setImagePreview(null);
  setSelectedDesigner('');
  setPrice('');
  setStock('');
  setCategoria('');
};

  
  return (
    <div className="admin-layout bg-black text-light">
      <main className="admin-content">
        <h2 className="michroma-regular mb-4">Agregar / Editar Productos</h2>

        <div className="card bg-dark p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <ul className="list-unstyled">
              <li className="mb-3">
                <label className="form-label text-white">Nombre del producto</label>
                <input className="form-control bg-secondary text-white" value={name} onChange={e => setName(e.target.value)} required />
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Precio</label>
                <input className="form-control bg-secondary text-white" value={price} onChange={e => setPrice(e.target.value)} />
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Stock</label>
                <input type="number" className="form-control bg-secondary text-white" value={stock} onChange={e => setStock(e.target.value)} />
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Categoría</label>
                <select className="form-select bg-secondary text-white" value={categoria} onChange={e => setCategoria(e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  {categoriasList.length > 0 ? categoriasList.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre_categoria || c.name || c.titulo || c.title}</option>
                  )) : <option value="">Sin categorías disponibles</option>}
                </select>
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Diseñador</label>
                <select className="form-select bg-secondary text-white" value={selectedDesigner} onChange={e => setSelectedDesigner(e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  {designersList.length > 0 ? designersList.map(d => (
                    <option key={d.id} value={d.id}>{`${d.nombre_disenador} ${d.apellido_disenador || ''}`.trim()}</option>
                  )) : <option value="">Sin diseñadores disponibles</option>}
                </select>
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Imágenes</label>
                <input type="file" accept="image/*" multiple className="form-control bg-secondary text-white" onChange={e => setImageFiles(Array.from(e.target.files))} />
              </li>
              <li className="mb-3">
                <label className="form-label text-white">Descripción breve</label>
                <textarea className="form-control bg-secondary text-white" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
              </li>
              {imagePreview && (
                <li className="mb-3">
                  <div className="mb-2">Vista previa:</div>
                  <img src={imagePreview} alt="preview" style={{ maxWidth: 240 }} />
                </li>
              )}
              <li>
                <button className="btn btn-light">Agregar producto</button>
              </li>
            </ul>
          </form>
        </div>

        <h4 className="michroma-regular mb-3">Productos añadidos</h4>
        <div className="card bg-dark p-3">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IMAGEN</th>
                  <th>NOMBRE</th>
                  <th>DISEÑADOR</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && <tr><td colSpan={8} className="text-muted">No hay productos</td></tr>}
                {products.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td style={{ width: 80 }}>{p.id}</td>
                    <td style={{ width: 96 }}>
                      {Array.isArray(p.imagen_producto) && p.imagen_producto.length > 0 ? (
                        <img src={p.imagen_producto[0].url || p.imagen_producto[0].path} alt={p.nombre_producto || p.name} style={{ width: 64, height: 64, objectFit: 'cover' }} />
                      ) : (p.imagen_producto ? <img src={p.imagen_producto} alt={p.nombre_producto || p.name} style={{ width: 64, height: 64, objectFit: 'cover' }} /> : <div className="text-muted">-</div>)}
                    </td>
                    <td>{p.nombre_producto || p.name}</td>
                    <td>{
                      // designer may be an object returned from API or an id
                      p.disenador_nombre || (p.disenador && (typeof p.disenador === 'string' || typeof p.disenador === 'number') ? p.disenador : (p.disenador?.nombre_disenador || p.disenador?.name)) || '-'
                    }</td>
                    <td>{(p.valor_producto || p.price) ? ('$' + Number(p.valor_producto ?? p.price).toLocaleString('es-CL')) : '-'}</td>
                    <td>{p.stock ?? '-'}</td>
                    <td>{
                      // category may be id or object
                      (() => {
                        if (!p.categoria) return '-'
                        if (typeof p.categoria === 'string' || typeof p.categoria === 'number') {
                          return categoriasList.find(c => String(c.id) === String(p.categoria))?.nombre_categoria || p.categoria
                        }
                        return p.categoria.nombre_categoria || p.categoria.name || '-'
                      })()
                    }</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-light" onClick={() => navigator.clipboard?.writeText(JSON.stringify(p))}>Copiar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRemove(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
