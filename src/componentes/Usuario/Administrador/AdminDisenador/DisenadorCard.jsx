import React from 'react'
import './DisenadorCard.css'

export default function DisenadorCard({ designer = {}, onEdit = () => {}, onDelete = () => {} }){
  return (
    <div className="disenador-card card">
      <div className="disenador-media">
        <img src={designer.avatar || '/src/assets/img/img_placeholder.png'} alt={designer.nombre_disenador} />
      </div>
      <div className="disenador-body">
        <h4 className="disenador-name">{designer.nombre_disenador}</h4>
        <div className="disenador-actions">
          <button className="btn btn-warning" onClick={onEdit}>Editar</button>
          <button className="btn btn-danger" onClick={() => onDelete(designer)}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}
