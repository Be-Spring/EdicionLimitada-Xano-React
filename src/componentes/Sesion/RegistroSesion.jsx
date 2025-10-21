import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authSignup, authMe } from '../../api/xano'

export default function RegistroSesion() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [remember, setRemember] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const validate = () => {
        setError(null)
        if (!name.trim()) return setError('Por favor ingresa tu nombre')
        if (!email.trim()) return setError('Por favor ingresa tu correo')
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRe.test(email)) return setError('Correo inválido')
        if (!password || password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
        if (password !== confirmPassword) return setError('Las contraseñas no coinciden')
        return true
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        if (!validate()) return
        setLoading(true)
        try {
            const data = await authSignup({ name: name.trim(), email: email.trim(), password, remember })
            setSuccess('Registro completado. Redirigiendo al inicio de sesión...')
            // optionally refresh user info
            try { await authMe() } catch (err) {}
            window.dispatchEvent(new Event('auth_changed'))
            setTimeout(() => navigate('/sesion/inicioSesion'), 1200)
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || 'Error al registrar la cuenta.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
    <section className="registration-section py-5 mt-5 bg-black text-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card bg-dark text-white p-4 rounded-4">
                            <h2 className="text-center mb-4 michroma-regular">Registro de Usuario</h2>

                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {success && <div className="alert alert-success" role="alert">{success}</div>}

                            <form id="registrationForm" className="needs-validation" onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label michroma-regular">Nombre</label>
                                    <input type="text" className="form-control rounded-3" id="nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                                    <div className="invalid-feedback">Por favor ingresa tu nombre</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label michroma-regular">Correo electrónico</label>
                                    <input type="email" className="form-control rounded-3" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <div className="invalid-feedback">Por favor ingresa un correo electrónico válido</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label michroma-regular">Contraseña</label>
                                    <input type="password" className="form-control rounded-3" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <small className="form-text text-light">La contraseña debe tener al menos 6 caracteres</small>
                                    <div className="invalid-feedback">La contraseña debe cumplir con todos los requisitos</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label michroma-regular">Confirmar Contraseña</label>
                                    <input type="password" className="form-control rounded-3" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    <div className="invalid-feedback">Las contraseñas no coinciden</div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone" className="form-label michroma-regular">Teléfono (opcional)</label>
                                    <input type="tel" className="form-control rounded-3" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn btn-light w-100 michroma-regular" disabled={loading}>{loading ? 'Registrando...' : 'Completar Registro'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}