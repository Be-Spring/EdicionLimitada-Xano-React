import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function InicioSesion() {
  const navigate = useNavigate();

  // estado UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, user: ctxUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // validación básica
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    // admin quick check (local admin email/password)
    if (email.trim().toLowerCase() === 'administrador@edicionlimitada.cl' && password === 'Admin123') {
      // redirect to administrador panel
      navigate('/administrador')
      return
    }

    setLoading(true)
    try {
      // use auth context login helper and inspect returned user/role
      const res = await login({ email: email.trim(), password, remember })
      // res may be the user object (AuthContext now returns user when available)
      const returnedUser = res && typeof res === 'object' && (res.rol || res.role || res.email) ? res : null

      // Check role from (in order): returnedUser, context user (ctxUser), localStorage
      const stored = localStorage.getItem('auth_user')
      const storedUser = stored ? JSON.parse(stored) : null
      const role = (returnedUser?.rol || returnedUser?.role || ctxUser?.rol || ctxUser?.role || storedUser?.rol || storedUser?.role || '').toString().toLowerCase()

      if (role === 'administrador') {
        navigate('/administrador')
      } else {
        navigate('/')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Error al iniciar sesión.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
  <section className="login-section py-5 mt-5 bg-black text-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card bg-dark text-white p-4 rounded-4">
              <h2 className="text-center mb-4 michroma-regular">Iniciar Sesión</h2>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}

              <form id="loginForm" className="needs-validation" onSubmit={handleSubmit} noValidate>
                {/* Correo */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label michroma-regular">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <div className="invalid-feedback">Por favor ingresa tu correo electrónico</div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label michroma-regular">Contraseña</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <div className="invalid-feedback">Por favor ingresa tu contraseña</div>
                </div>

                {/* Recordar sesión y Olvidé contraseña */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="remember">Recordar sesión</label>
                  </div>
                  <a href="#" className="text-light text-decoration-none small">¿Olvidaste tu contraseña?</a>
                </div>

                {/* Botón de Inicio de Sesión */}
                <div className="text-center">
                  <button type="submit" className="btn btn-light w-100 michroma-regular" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                  </button>
                </div>

                {/* Enlace a Registro */}
                <div className="text-center mt-3">
                  <span>¿No tienes una cuenta? </span>
                    <Link to="/registro" className="text-light">Regístrate aquí</Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
