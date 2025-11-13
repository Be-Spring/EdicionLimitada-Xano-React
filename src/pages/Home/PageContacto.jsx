import React from 'react'
import Header from '../../componentes/Index/Header.jsx'
import Footer from '../../componentes/Index/Footer.jsx'
import ContactForm from '../../componentes/Formularios/Contacto.jsx'

export default function PageContacto() {
	return (
		<>
			<Header />
			<main className="pt-5">
				<ContactForm />
			</main>
			<Footer />
		</>
	)
}
