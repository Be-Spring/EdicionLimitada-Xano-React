import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import './Header.css';
import logoImg from '../../assets/img/Logo Edicion Limitada.png'
import { CartContext } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const Header = () => (
    <header className="fixed-top">
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">

                <Link to="/" className="text-decoration-none">
                    <div className="logo-container d-flex align-items-center">
                        <img src={logoImg} alt="Logo Edición Limitada" className="navbar-logo me-2" />
                        <span className="michroma-regular text-white">EDICION LIMITADA</span>
                    </div>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">

                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/productos">Productos</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="nosotrosDropdown" data-bs-toggle="dropdown">
                                Nosotros
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/nosotros/edicion-limitada">Edición Limitada</Link></li>
                                <li><Link className="dropdown-item" to="/nosotros/disenadores">Diseñadores</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="blogsDropdown" data-bs-toggle="dropdown">
                                Blogs
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/blog/eventos">Eventos</Link></li>
                                <li><Link className="dropdown-item" to="/blog/editorial">Editorial</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contacto">Contacto</Link>
                        </li>
                    </ul>

                    <CartActions />
                </div>
            </div>
        </nav>
    </header>
);

export default Header;

function CartActions() {
    const { toggleCart, items } = useContext(CartContext)
    const { user, logout } = useAuth()
    const count = items?.reduce((c, it) => c + (it.quantity || 0), 0) || 0

    // Determine if the logged user is a cliente
    const role = (user?.rol || user?.role || '').toString().toLowerCase()
    const isCliente = role === 'cliente' || role === 'user' || role === 'usuario'

    // If a cliente is logged in, show a mini dropdown menu with profile + logout
    if (user && isCliente) {
        const displayName = user?.name || user?.nombre || user?.email || 'Cliente'
        return (
            <div className="d-flex align-items-center">
                <div className="dropdown me-3">
                    <button className="btn btn-outline-light dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                        Hola, <strong>{displayName}</strong>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                        <li><Link className="dropdown-item" to="/perfil/datos-personales">Datos personales</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={() => { try { logout() } catch {} }}>Cerrar sesión</button></li>
                    </ul>
                </div>
                <button className="btn btn-link text-light position-relative" id="cartButton" type="button" onClick={toggleCart} aria-label="Abrir carrito">
                    <i className="fas fa-shopping-cart" />
                    {count > 0 && <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{count}</span>}
                </button>
            </div>
        )
    }

    // Default (no cliente logged): show login/register
    return (
        <div className="d-flex align-items-center">
            <Link to="/sesion" className="btn btn-outline-light me-2">Iniciar Sesión</Link>
            <Link to="/registro" className="btn btn-light me-3">Regístrate</Link>
            <button className="btn btn-link text-light position-relative" id="cartButton" type="button" onClick={toggleCart} aria-label="Abrir carrito">
                <i className="fas fa-shopping-cart" />
                {count > 0 && <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{count}</span>}
            </button>
        </div>
    )
}