import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Disenador from '../../componentes/Nosotros/Disenador.jsx'

export default function PageNosotrosDisenadores() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<Disenador />
			</main>
			<Footer />
		</>
	)
}
