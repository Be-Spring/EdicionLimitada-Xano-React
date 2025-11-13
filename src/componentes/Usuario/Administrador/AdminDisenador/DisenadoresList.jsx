import React from 'react'
import DisenadorCard from './DisenadorCard.jsx'
import './DisenadoresList.css'

const MOCK = [
  { id: 1, nombre_disenador: 'Alter', avatar: '/src/assets/img/img_placeholder.png' },
  { id: 2, nombre_disenador: 'Amanda', avatar: '/src/assets/img/img_placeholder.png' },
  { id: 3, nombre_disenador: 'Caro Piña', avatar: '/src/assets/img/img_placeholder.png' },
  { id: 4, nombre_disenador: 'Coca Moya', avatar: '/src/assets/img/img_placeholder.png' },
  { id: 5, nombre_disenador: 'Cog by Cal', avatar: '/src/assets/img/img_placeholder.png' }
]

export default function DisenadoresList({ onEdit = () => {} }){
  return (
    <div className="disenadores-list">
      <div className="cards-grid">
        {MOCK.map(d => (
          <DisenadorCard key={d.id} designer={d} onEdit={() => onEdit(d)} />
        ))}
      </div>
    </div>
  )
}
