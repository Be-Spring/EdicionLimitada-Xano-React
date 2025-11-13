import React, { useState } from "react";
import logoImg from '../../assets/img/Logo Edicion Limitada.png'
import './Contacto.css'

function FormularioContacto() {
    const [form, setForm] = useState({ fullName: "", email: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // simple client-side validation
        if (!form.fullName || !form.email || !form.message) {
            setStatus({ type: "error", message: "Por favor completa todos los campos." });
            return;
        }

        // TODO: replace with real submit (API call)
        console.log("Enviar mensaje:", form);
        setStatus({ type: "success", message: "Mensaje enviado (simulado)." });
        setForm({ fullName: "", email: "", message: "" });
    };

    return (
    <section className="py-5 mt-6 bg-black text-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center mb-5">
                                <img src={logoImg} alt="Logo Edición Limitada" className="img-fluid mb-6" style={{ maxWidth: 200 }} />
                                <h2 className="michroma-regular text-white">EDICIÓN LIMITADA</h2>
                            </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card bg-dark text-white">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4 michroma-regular">Contáctanos</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label michroma-regular">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control michroma-regular"
                                            id="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label michroma-regular">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control michroma-regular"
                                            id="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="message" className="form-label michroma-regular">
                                            Mensaje
                                        </label>
                                        <textarea
                                            className="form-control michroma-regular"
                                            id="message"
                                            rows={5}
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-light w-100 michroma-regular">
                                        Enviar mensaje
                                    </button>
                                </form>
                                {status && (
                                    <div
                                        className={
                                            status.type === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3"
                                        }
                                        role="alert"
                                    >
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FormularioContacto;