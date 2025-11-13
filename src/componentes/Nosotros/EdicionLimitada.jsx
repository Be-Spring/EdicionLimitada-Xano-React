import React from 'react';
import './EdicionLimitada.css';

const EdicionLimitada = () => {
    return (
        <section className="about-section py-5 mt-5">
            <div className="container">
                <div className="row justify-content-between align-items-center g-5">

                    <div className="col-lg-6">
                        <h1 className="michroma-regular mb-4">Edición Limitada</h1>
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
                            <a
                                href="https://www.instagram.com/edicionlimitada.scl/"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-light text-decoration-none social-link"
                            >
                                <i className="fab fa-instagram fa-2x" />
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-5 text-center">
                        {/* Image / visual block can be added here later (logo/gallery) */}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EdicionLimitada;