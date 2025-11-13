import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Hero from '../../componentes/Index/Hero.jsx'
import Categoria from '../../componentes/Index/Categoria.jsx'
import New from '../../componentes/Index/New.jsx'

export default function PageHome() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<Categoria />
				<New />
			</main>
			<Footer />
		</>
	)
}
