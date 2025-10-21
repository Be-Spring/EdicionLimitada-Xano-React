import React from 'react'
import logoImg from '../assets/img/Logo Edicion Limitada.png'
import './GridDiseñador.css'

export default function GridDiseñador({ title = 'Edición Limitada', description, igUrl = '#' }) {
  const desc = description || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae dolor sed nunc sagittis commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla facilisi.`

  return (
    <div className="designer-profile d-flex align-items-center justify-content-between py-5">
      <div className="designer-info col-lg-7">
        <h1 className="michroma-regular display-5 text-white">{title}</h1>
        <p className="lead text-light mt-4">{desc}</p>

        <ul className="list-unstyled mt-4 text-light">
          <li className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> Galería Drugstore, terrazas L.69</li>
          <li className="mb-2"><i className="far fa-clock me-2"></i> Lu-Sa / 11.30-19.30</li>
        </ul>

        <a className="btn btn-outline-light mt-3" href={igUrl} target="_blank" rel="noreferrer">
          <i className="fab fa-instagram me-2"></i> Instagram
        </a>
      </div>

      <div className="designer-logo col-lg-4 text-center">
        <img src={logoImg} alt="Edición Limitada" className="big-designer-logo img-fluid" />
      </div>
    </div>
  )
}
