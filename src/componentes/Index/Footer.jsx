import React from 'react';
import { Link } from 'react-router-dom'
import './Footer.css';
import logoImg from '../../assets/img/Logo Edicion Limitada.png'

const Footer = () => (
    <footer className="bg-white py-5">
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <h5>Suscríbete a nuestro Newsletter</h5>
                    <form className="newsletter-form">
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Tu email" />
                            <button className="btn btn-dark" type="submit">Suscríbete</button>
                        </div>
                    </form>
                </div>

                <div className="col-md-4">
                    <h5>Información</h5>
                    <ul className="list-unstyled footer-links">
                        <li><Link to="/nosotros/edicion-limitada">Edición Limitada</Link></li>
                        <li><Link to="/nosotros/disenadores">Diseñadores</Link></li>
                        <li><Link to="/blog/editorial">Editorial</Link></li>
                        <li><Link to="/blog/eventos">Eventos</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </div>

                <div className="col-md-4 text-center">
                    <div className="social-links mb-3">
                        <a href="#" className="text-dark mx-2"><i className="fab fa-instagram" /></a>
                        <a href="#" className="text-dark mx-2"><i className="fab fa-twitter" /></a>
                        <a href="#" className="text-dark mx-2"><i className="fab fa-youtube" /></a>
                    </div>
                    <div className="footer-logo d-flex flex-column align-items-center">
                        <img src={logoImg} alt="Logo Edición Limitada" className="footer-logo-img" />
                        <span className="michroma-regular mt-2">EDICION LIMITADA</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;