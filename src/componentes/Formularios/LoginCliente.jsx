
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

import { useEffect } from 'react'

export default function InicioSesionCliente() {
  const navigate = useNavigate()
  const { loginCliente } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // ensure inputs start empty (avoid stale values)
    setEmail('')
    setPassword('')
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Ingresa correo y contraseña.')
      return
    }

    setLoading(true)
    try {
      await loginCliente({ email: email.trim(), password })
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión.')
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form id="loginForm" className="needs-validation" onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label michroma-regular">Correo electrónico</label>
                  <input name="cliente-email" type="email" className="form-control rounded-3" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
                  <div className="invalid-feedback">Por favor ingresa tu correo electrónico</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label michroma-regular">Contraseña</label>
                  <input name="cliente-password" type="password" className="form-control rounded-3" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="off" />
                  <div className="invalid-feedback">Por favor ingresa tu contraseña</div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <label className="form-check-label" htmlFor="remember">Recordar sesión</label>
                  </div>
                  <a href="#" className="text-light text-decoration-none small">¿Olvidaste tu contraseña?</a>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-light w-100 michroma-regular" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</button>
                </div>

                <div className="text-center mt-3">
                  <span>¿No tienes una cuenta? </span>
                  <Link to="/registro" className="text-light">Regístrate aquí</Link>
                </div>

                <div className="text-center mt-2">
                  <Link to="/sesion-admin" className="text-secondary small text-decoration-none">¿Eres administrador?</Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
