import React from 'react'
import './diseñadores.css'
import designers from './data'
import { Link } from 'react-router-dom'

export default function Diseñadores() {
  const sorted = designers.slice().sort((a, b) => a.name.localeCompare(b.name, 'es'))

  const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')

  return (
    <section className="designers-page py-5 bg-black text-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="p-3 rounded-3" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <h4 className="michroma-regular text-white">Diseñadores</h4>
              <ul className="list-unstyled mt-3 designers-list-left">
                {sorted.map(d => (
                  <li key={d.name} className="py-1 text-white">{d.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row g-4">
              {sorted.map((d) => (
                <div key={d.name} className="col-lg-3 col-md-4 col-sm-6">
                  <Link to={`/disenadores/${slugify(d.name)}`} className="text-decoration-none">
                    <div className="card product-card-zoom bg-transparent border-0 text-center">
                      <div className="product-image-container rounded-3 overflow-hidden">
                        <img src={d.img} alt={d.name} className="product-image img-fluid" />
                      </div>
                      <div className="mt-2">
                        <small className="text-white">{d.name}</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
