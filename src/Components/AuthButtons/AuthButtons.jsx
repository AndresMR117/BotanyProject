import React from 'react';
import { Link } from 'react-router-dom';
import './AuthButtons.css'; // Asegúrate de crear este archivo CSS

const AuthButtons = () => {
  return (
    <div className="auth-buttons">
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/register">Registrarse</Link>
    </div>
  );
};

export default AuthButtons;