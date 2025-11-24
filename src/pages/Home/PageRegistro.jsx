import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Registro from '../../componentes/Formularios/Registro.jsx'

export default function PageRegistro() {
  return (
    <>
      <Header />
      <main className="pt-5">
        <Registro />
      </main>
      <Footer />
    </>
  )
}
