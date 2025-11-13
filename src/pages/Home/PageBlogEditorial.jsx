import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import Editorial from '../../componentes/Nosotros/Editorial.jsx'

export default function PageBlogEditorial() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<Editorial />
			</main>
			<Footer />
		</>
	)
}
