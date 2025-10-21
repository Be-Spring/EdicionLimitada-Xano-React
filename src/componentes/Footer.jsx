import logoImg from '../assets/img/Logo Edicion Limitada.png'

// src/componentes/Header.jsx
export const Footer = () => {
  return (
    <footer className="bg-white py-5">
      <div className="container">
        <div className="row">
          {/* Formulario subscripción */}
          <div className="col-md-4">
            <h5>Suscríbete a nuestro Newsletter</h5>
            <form className="newsletter-form">
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Tu email" />
                <button className="btn btn-dark" type="submit">Suscríbete</button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5>Información</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Edición Limitada</a></li>
              <li><a href="#">Diseñadores</a></li>
              <li><a href="#">Editorial</a></li>
              <li><a href="#">Eventos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>

          {/* Social Media & Logo */}
          <div className="col-md-4 text-center">
            <div className="social-links mb-3">
              <a href="#" className="text-dark mx-2"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-dark mx-2"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-dark mx-2"><i className="fab fa-youtube"></i></a>
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
};

export default Footer
