import React, { useRef, useState, useEffect } from 'react';
import './MisDatos.css';
import useGlobalStore from '../../../../globalState/GlobalState';
function MisDatos() {
    const { cliente, setCliente }=useGlobalStore();
    const selectorImagen = useRef(null);
    const botonGuardarRef = useRef(null);

    const clienteBase = cliente || (() => {
        try {
            const guardado = JSON.parse(localStorage.getItem('datosCliente'));
            return guardado || {};
        } catch {
            return {};
        }
    })();

    const [form, setForm] = useState({
        tipoCuenta: 'particular',
        nombre: clienteBase.nombre || '',
        apellidos: clienteBase.apellidos || '',
        email: clienteBase.cuenta?.email || '',
        telefonoContacto: clienteBase.cuenta?.telefonoContacto || '',
        fechaNacimiento: clienteBase.fechaNacimiento || '',
        genero: clienteBase.genero || '',
        nifcif: '',
        nombreEmpresa: '',
        avatarUsuario: clienteBase.cuenta?.imagenAvatar || '',
        fichImagenUsuario: null
    });
    const [showModal, setShowModal] = useState(false);
    const [emailNuevo, setEmailNuevo] = useState('');
    const [emailAntiguo, setEmailAntiguo] = useState(form.email); // email original del cliente
    const [emailGuardado, setEmailGuardado] = useState(false);

    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        
        const { name, value } = e.target;
        console.log('Cambio en el campo:', name, 'Nuevo valor:', value);
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
        setSaved(false);
    };

    const validate = () => {
        const err = {};
        // Validaciones según tipo de cliente (usar las propiedades reales del state)
        if (form.tipoCuenta === 'particular') {
            if (!form.nombre.trim()) err.nombre = 'Introduce tu nombre';
            if (!form.apellidos.trim()) err.apellidos = 'Introduce tus apellidos';
        } else {
            if (!form.nombreEmpresa.trim()) err.nombreEmpresa = 'Introduce el nombre de la empresa';
        }

        if (!form.email.trim()) {
            err.email = 'Introduce tu email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            err.email = 'Email inválido';
        }

        if (!form.nifcif.trim()) {
            err.nifcif = form.tipoCuenta === 'empresa' ? 'Introduce el CIF' : 'Introduce el DNI';
        }

        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();

        if (Object.keys(err).length) {
            setErrors(err);
            setSaved(false);
            return;
        }

        // Aquí iría la llamada al API para guardar los datos del cliente.
        // De momento simulamos éxito y mostramos un mensaje.
        setCliente(form);
        localStorage.setItem("datosCliente", JSON.stringify(form));
        setSaved(true);

        try {
            const respuesta = await fetch('http://localhost:3000/api/Cliente/Modificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCliente: cliente?._id || clienteBase?._id,  // o el campo correcto que tengas
                    nombre,
                    apellidos,
                    genero,
                    fechaNacimiento,
                    telefonoContacto,
                    nifcif,
                    tipoCuenta,
                    nombreEmpresa,
                    avatarUsuario
                }),
            });

            const data = await respuesta.json();
            if (data.codigo === 0) {
                console.log('Guardando datos personales:', form);
                alert('Datos actualizados correctamente');
                setCliente(form);
            } else {
            alert('Error al actualizar: ' + data.mensaje);
            }
        } catch (error) {
            console.error('Error al enviar actualización:', error);
        }
    };

    const handleAbrirModal = (e) => {
        e.preventDefault();
        if (!emailNuevo.trim()) {
            setErrors(prev => ({ ...prev, email: 'Introduce un email nuevo' }));
            return;
        }

        // Validación básica dpues páse email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNuevo)) {
            setErrors(prev => ({ ...prev, email: 'Email inválido' }));
            return;
        }

        setShowModal(true);
    };

    const handleConfirmarCambioEmail = async () => {
        try {
            const response = await fetch('/api/cliente/modificarEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailAntiguo: emailAntiguo,
                emailNuevo: emailNuevo
            })
            });

            if (!response.ok) throw new Error('Error al actualizar el email');

            const data = await response.json();
            

            // setForm(prev => ({ ...prev, email: emailNuevo }));
            if(data.codigo===0){
                console.log('Email actualizado:', data);
                setEmailAntiguo(emailNuevo);
                setShowModal(false);
                setEmailGuardado(true);
            } else {
                alert("Error al actualizar el email: " + data.mensaje);
            }
            

        } catch (error) {
            console.error('Error:', error);
            setErrors(prev => ({ ...prev, general: 'No se pudo actualizar el email' }));
            setShowModal(false);
        }
    };

    const InputImagenOnChange = (ev) => {
        //en ev.target.files <--- FileList o array de objetos de tipo FILE seleccionados, en pos. [0] estaria el fich.imagen a leer
        let _imagen = ev.target.files[0];
        let _lector = new FileReader();

        _lector.addEventListener('load', (evt) => {
            let _contenidoFichSerializado = evt.target.result;
            setForm((prev) => ({ ...prev, avatarUsuario: _contenidoFichSerializado }));

        });
        _lector.readAsDataURL(_imagen);
    }
    //modificar los datos el cliente incluyendo imagen avatar con el email ( mandar email antiguo y email nuevo, mostrar MODAL de cofirmacion)
    const handleModificarDatos = (e) => {
        // Mostrar modal de confirmación
        //los datos del cliente son null
        e.preventDefault();
        setEmailNuevo(form.email);
        setShowModal(true);
    }
    return (
        <div className="container">
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar cambio de email</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Seguro que deseas cambiar tu email de <strong>{emailAntiguo}</strong> a <strong>{emailNuevo}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleConfirmarCambioEmail}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='row m-4'>
                <div className='col-12'>
                    <h5>Mis Datos Personales</h5>
                    <hr></hr>
                    <p>Aquí puedes ver y editar los datos de tu cuenta.</p>
                </div>
            </div>

            <div className='row m-4'>
                <div className='col-12'>
                    <form className="mis-datos-form" onSubmit={handleSubmit} noValidate>

                        {/* Tipo de cliente: Particular / Empresa */}
                        <div className="mb-3">
                            <label className="form-label me-3">Tipo de cliente</label>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label"
                                    htmlFor="clientParticular"
                                    style={{ color: form.tipoCuenta === 'particular' ? '#00b22d' : '#ccc' }}>
                                    Soy Particular
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="clientParticular"
                                        name="tipoCuenta"
                                        value="particular"
                                        checked={form.tipoCuenta === 'particular'}
                                        onChange={handleChange}
                                    />
                                    <span className='checkmark'></span>

                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <label className="form-check-label"
                                    htmlFor="clientEmpresa"
                                    style={{ color: form.tipoCuenta === 'empresa' ? '#00b22d' : '#ccc' }}>
                                    Soy Empresa
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        id="clientEmpresa"
                                        name="tipoCuenta"
                                        value="empresa"
                                        checked={form.tipoCuenta === 'empresa'}
                                        onChange={handleChange}
                                    />
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="nombre">Nombre</label>
                                <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} type="text" className="form-control" placeholder="Nombre" />
                                {errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" htmlFor="apellidos">Apellidos</label>
                                <input id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} type="text" className="form-control" placeholder="Apellidos" />
                                {errors.apellidos && <div className="invalid-feedback d-block">{errors.apellidos}</div>}
                            </div>
                        </div>



                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label" htmlFor="telefonoContacto">Teléfono</label>
                                <input id="telefonoContacto" name="telefonoContacto" value={form.telefonoContacto} onChange={handleChange} type="tel" className="form-control" placeholder="+34 600 000 000" />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label" htmlFor="nifcif">{form.tipoCuenta === 'empresa' ? 'CIF' : 'DNI'}</label>
                                <input id="nifcif" name="nifcif" value={form.nifcif} onChange={handleChange} type="text" className="form-control" placeholder={form.tipoCuenta === 'empresa' ? 'CIF' : 'DNI'} />
                                {errors.nifcif && <div className="invalid-feedback d-block">{errors.nifcif}</div>}
                            </div>

                            {form.tipoCuenta === 'particular' && (
                                <>
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label" htmlFor="fechaNacimiento">Genero</label>
                                        <select className="form-select" aria-label="Default select example" onChange={handleChange} name='genero'>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label" htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                                        <input id="fechaNacimiento" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} type="date" className="form-control" />
                                    </div>
                                </>
                            )}
                            <div className="col-md-4">
                                <div className="text-muted">{form.tipoCuenta == 'particular' ? 'Foto' : 'Logo empresa'}</div>
                                <div id="avatarPerfil" className="card" style={{ width: "200px", height: "250px", backgroundColor: "aliceblue" }} onClick={() => selectorImagen.current.click()}>
                                    <input type="file" accept="image/*" ref={selectorImagen} style={{ visibility: "hidden" }} onChange={InputImagenOnChange} />
                                    <img src={form.avatarUsuario || "/images/imagen_usuario_sinavatar.jpg"} id="imagenUsuario" style={{ objectFit: 'cover' }} alt="..." />
                                </div>
                            </div>
                        </div>

                        {form.tipoCuenta === 'empresa' && (
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label className="form-label" htmlFor="nombreEmpresa">Nombre de la empresa</label>
                                    <input id="nombreEmpresa" name="nombreEmpresa" value={form.nombreEmpresa} onChange={handleChange} type="text" className="form-control" placeholder="Razón social" />
                                    {errors.nombreEmpresa && <div className="invalid-feedback d-block">{errors.nombreEmpresa}</div>}
                                </div>
                            </div>
                        )}



                        <div className="d-flex flex-row justify-content-end ">
                            <button type="submit" ref={botonGuardarRef} className="btn btn-hsn-1 w-50"><i className="fa-solid fa-check"></i> Guardar Cambios</button>
                        </div>

                        {saved && <div className="text-success">Datos guardados correctamente.</div>}
                    </form>
                </div>
            </div>

            <div className='row m-4'>
                <div className='col-12'>
                    <h5>Editar Email</h5>
                    <hr></hr>
                    <p>Recibiras un email en tu cuenta actual para verificar el cambio de direccion:</p>
                </div>
            </div>

            <div className="row m-4">
                <div className="col-8">
                    <input 
                        id="email"
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} type="email" className="form-control" placeholder="usuario@correo.com" />
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                </div>
                <div className="col-4 d-flex flex-row justify-content-end ">
                    <button onClick={handleModificarDatos} type="button" className="btn btn-hsn-1"><i className="fa-solid fa-check"></i> Modificar Email</button>
                </div>
            </div>

        </div>
    );


}

export default MisDatos;