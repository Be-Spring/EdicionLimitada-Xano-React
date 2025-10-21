import React from 'react'
import { useParams } from 'react-router-dom'
import designers from './Diseñadores/data'
import GridDiseñador from './GridDiseñador'

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')

export default function DesignerPage() {
  const { slug } = useParams()
  const found = designers.find(d => slugify(d.name) === slug)
  const title = found ? found.name : 'Diseñador'

  return (
    <div className="container">
      <GridDiseñador title={title} />
    </div>
  )
}
