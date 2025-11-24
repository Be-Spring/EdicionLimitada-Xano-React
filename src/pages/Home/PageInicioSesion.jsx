import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Login from '../../componentes/Formularios/LoginCliente.jsx'

export default function PageInicioSesion() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<Login />
			</main>
			<Footer />
		</>
	)
}
