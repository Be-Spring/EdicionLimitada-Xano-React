import React from 'react';
import './Categoria.css';

const categories = [
	{ id: 'vestuario', title: 'Vestuario', img: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg' },
	{ id: 'accesorios', title: 'Accesorios', img: 'https://images.pexels.com/photos/1661474/pexels-photo-1661474.jpeg' },
	{ id: 'bolsos', title: 'Bolsos', img: 'https://images.pexels.com/photos/2983460/pexels-photo-2983460.jpeg' },
	{ id: 'joyas', title: 'Joyas', img: 'https://images.pexels.com/photos/208543/pexels-photo-208543.jpeg' },
];

const Categoria = () => (
		<section className="categoria-section py-5">
		<div className="container">
				<div className="categoria-header d-flex justify-content-between align-items-center mb-4">
					<h2 className="text-light">Categorías</h2>
				</div>

				<div className="row g-4">
					{categories.map(cat => (
						<div className="col-lg-3 categoria-col" key={cat.id}>
							<div className="categoria-card-zoom">
								<div className="categoria-image-container">
									<img src={`${cat.img}?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`} alt={cat.title} className="categoria-image" />
								</div>
								<div className="p-3 text-center">
									<h5 className="m-0 text-white categoria-title">{cat.title}</h5>
									<small className="text-muted">Ver colección</small>
								</div>
							</div>
						</div>
					))}
				</div>
		</div>
	</section>
);

export default Categoria;
