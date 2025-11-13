import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import EdicionLimitada from '../../componentes/Nosotros/EdicionLimitada.jsx'

export default function PageNosotrosED() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<EdicionLimitada />
			</main>
			<Footer />
		</>
	)
}
