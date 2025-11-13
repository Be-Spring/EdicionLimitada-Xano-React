import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Evento from '../../componentes/Nosotros/Evento.jsx'

export default function PageBlogEventos() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<Evento />
			</main>
			<Footer />
		</>
	)
}
