import React from 'react';
import { Link } from 'react-router-dom'
import './New.css';

const New = () => (
    <section className="products-section py-5">
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-light">Productos Destacados</h2>
                <Link to="/productos" className="btn btn-outline-light">Ver todos los productos</Link>
            </div>

            <div className="row g-4">

            </div>
        </div>
    </section>
);

export default New;