import React from 'react';
import './Disenador.css';

const DesignersList = [
    'Alter','Amanda','Caro Piña','Coca Moya','Cog by Cal','Dreamworld','Fancy','Fran Garcia','Game Over','GOIS','Happy Berry','Hurga','Incorrecta','Irreversible','Josefina Collection','Kaosfera','Kazú','KE LÍO','Kuro Archives','Lena Freestyle','Lisauskas','Mal Vidal','Marta by Tamar','Mitsuki Studio','Sin Etiquetas','Valentina Gaymer','Virtual Genesis','Vnneno'
];

const Disenador = () => (
    <section className="py-5 mt-5">
        <div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <div className="designers-list">
                        <h4 className="michroma-regular">Diseñadores</h4>
                        <ul className="alphabet-list">
                            {DesignersList.map(name => (
                                <li key={name}><a href="#" className="text-decoration-none">{name}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-9">
                    <div className="designers-grid">
                        <div className="row">
                            {/* grid content placeholder (visual only) */}
                        </div>

                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center" />
                        </nav>
                    </div>
                </div>

                <div className="row justify-content-between align-items-center g-5">
                    <div className="col-lg-6">
                        <h1 className="michroma-regular mb-4">Alter</h1>
                        <div className="content-text text-white mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae dolor sed nunc sagittis commodo.
                            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                            Nulla facilisi. Praesent dignissim magna eget tellus tincidunt, vitae placerat ligula finibus.
                            Nullam venenatis gravida ex, vitae commodo nisl ultrices vel. Donec feugiat mi non diam convallis,
                            nec tincidunt nulla ultricies.
                        </div>
                        <div className="store-info">
                            <p className="mb-2">
                                <i className="fas fa-map-marker-alt me-2" />
                                Galería Drugstore, terrazas L.69
                            </p>
                            <p className="mb-3">
                                <i className="far fa-clock me-2" />
                                Lu-Sa / 11.30-19.30
                            </p>
                            <a href="https://www.instagram.com/alter_______/" target="_blank" rel="noreferrer" className="text-light text-decoration-none social-link">
                                <i className="fab fa-instagram fa-2x" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Disenador;

