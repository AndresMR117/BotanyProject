import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <section className="login">
      <h1>Iniciar Sesión</h1>
      <div className="form-field">
        <label>Correo Electrónico</label>
        <input type="email" placeholder="Escribe tu correo" />
      </div>
      <div className="form-field">
        <label>Contraseña</label>
        <input type="password" placeholder="Escribe tu contraseña" />
      </div>
      <button className="submit-button">Iniciar Sesión</button>
    </section>
  );
};

export default Login;