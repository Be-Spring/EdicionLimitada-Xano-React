// src/pages/Home/PageInicioSesionAdmin.jsx

import React from 'react'
import Header from '../../../componentes/Index/Header.jsx'
import Footer from '../../../componentes/Index/Footer.jsx'
import LoginAdmin from '../../../componentes/Formularios/LoginAdmin.jsx'

export default function PageInicioSesionAdmin() {
  return (
    <>
      <Header />
      <main className="pt-5">
        <LoginAdmin />
      </main>
      <Footer />
    </>
  )
}
