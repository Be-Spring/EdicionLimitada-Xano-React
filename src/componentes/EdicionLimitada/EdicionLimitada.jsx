import React from 'react'
import GridDiseñador from '../GridDiseñador'

export default function EdicionLimitada() {
  const desc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae dolor sed nunc sagittis commodo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla facilisi. Praesent dignissim magna eget tellus tincidunt, vitae placerat ligula finibus.`

  return (
    <section className="py-5 bg-black text-light">
      <div className="container">
        <GridDiseñador title="Edición Limitada" description={desc} igUrl="#" />
      </div>
    </section>
  )
}
