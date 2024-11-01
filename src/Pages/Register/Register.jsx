import React from 'react';
import './Register.css';

const Register = () => {
  return (
    <section className="register">
      <h1>Registrarse</h1>
      <div className="form-field">
        <label>Correo Electrónico</label>
        <input type="email" placeholder="Escribe tu correo" />
      </div>
      <div className="form-field">
        <label>Contraseña</label>
        <input type="password" placeholder="Escribe tu contraseña" />
      </div>
      <button className="submit-button">Registrarse</button>
    </section>
  );
};

export default Register;