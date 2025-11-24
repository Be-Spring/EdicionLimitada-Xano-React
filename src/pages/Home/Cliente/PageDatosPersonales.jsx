import React from 'react'
import Header from '../../../componentes/Index/Header.jsx'
import Footer from '../../../componentes/Index/Footer.jsx'
import DatosPersonales from '../../../componentes/Usuario/Cliente/DatosPersonales.jsx'

export default function PageDatosPersonales() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<DatosPersonales />
			</main>
			<Footer />
		</>
	)
}

