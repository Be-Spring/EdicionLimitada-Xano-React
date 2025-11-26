import React, { useEffect, useState } from 'react';
import './Disenador.css';
import { listDesigners } from '../../api/xano.js';

// BASE de Xano para armar las URLs de imágenes
const XANO_BASE = import.meta.env.VITE_XANO_STORE_BASE.replace(/\/api:.+$/, '');

// Keep the static alphabetical sidebar names in case API is empty
const DesignersListStatic = [
  'Alter','Amanda','Caro Piña','Coca Moya','Cog by Cal','Dreamworld','Fancy','Fran Garcia',
  'Game Over','GOIS','Happy Berry','Hurga','Incorrecta','Irreversible','Josefina Collection',
  'Kaosfera','Kazú','KE LÍO','Kuro Archives','Lena Freestyle','Lisauskas','Mal Vidal',
  'Marta by Tamar','Mitsuki Studio','Sin Etiquetas','Valentina Gaymer','Virtual Genesis','Vnneno'
];

// helper para resolver la URL de la imagen del diseñador
function getDesignerAvatar(d) {
  if (!d || !Array.isArray(d.images) || d.images.length === 0) {
    return '/src/assets/img/img_placeholder.png';
  }

  const first = d.images[0];

  let rawPath = '';
  if (typeof first === 'string') {
    rawPath = first;
  } else if (first && (first.url || first.path)) {
    rawPath = first.url || first.path;
  }

  if (!rawPath) {
    return '/src/assets/img/img_placeholder.png';
  }

  // si ya viene con http, la usamos tal cual
  if (rawPath.startsWith('http')) {
    return rawPath;
  }

  // si es un path relativo de Xano, le pegamos la base
  if (!rawPath.startsWith('/')) {
    rawPath = '/' + rawPath;
  }
  return `${XANO_BASE}${rawPath}`;
}

function DesignerTile({ d }){
  const avatar = getDesignerAvatar(d);
  return (
    <div className="designer-tile text-center">
      <img
        src={avatar}
        alt={d.nombre_disenador || ''}
        style={{width:'100%',height:180,objectFit:'cover',borderRadius:8}}
      />
      <div style={{marginTop:8,fontWeight:600}}>
        {d.nombre_disenador}
      </div>
    </div>
  );
}

const Disenador = () => {
  const [designers, setDesigners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const ds = await listDesigners()
        if (!mounted) return
        console.log('Designers desde Xano:', ds) // 👈 para confirmar estructura
        setDesigners(ds || [])
      } catch (err) {
        console.error('listDesigners failed', err)
        if (mounted) setError('No se pudieron cargar diseñadores')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const sidebarList = DesignersListStatic

  return (
    <section className="py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="designers-list">
              <h4 className="michroma-regular">Diseñadores</h4>
              <ul className="alphabet-list">
                {sidebarList.map(name => (
                  <li key={name}>
                    <a href="#" className="text-decoration-none">{name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="designers-grid">
              {loading ? (
                <div>Cargando diseñadores...</div>
              ) : error ? (
                <div className="text-danger">{error}</div>
              ) : (
                <div className="row">
                  {designers.map(d => (
                    <div key={d.id} className="col-md-4 mb-4">
                      <DesignerTile d={d} />
                    </div>
                  ))}
                </div>
              )}

              <nav aria-label="Page navigation" className="mt-4">
                <ul className="pagination justify-content-center" />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Disenador;