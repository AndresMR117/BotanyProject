// src/Pages/BitacoraForm/BitacoraForm.jsx
import React from 'react';
import './BitacoraForm.css';

const BitacoraForm = () => {
  return (
    <section className="bitacora-form">
      <div className="form-field">
        <label className="form-label">Título de la Bitácora</label>
        <input className="form-input" type="text" placeholder="Escribe el título" />
      </div>
      <div className="form-field">
        <label className="form-label">Descripción</label>
        <textarea className="form-input" placeholder="Escribe una descripción"></textarea>
      </div>
      <button className="submit-button">Guardar Bitácora</button>
    </section>
  );
};

export default BitacoraForm;


