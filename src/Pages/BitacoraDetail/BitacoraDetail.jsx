// src/Pages/BitacoraDetail/BitacoraDetail.jsx
import React from 'react';
import './BitacoraDetail.css';

const BitacoraDetail = ({ title, description, date, onBack }) => {
  return (
    <section className="bitacora-detail">
      <h1 className="detail-title">{title}</h1>
      <p className="detail-description">{description}</p>
      <p className="detail-date">Fecha: {date}</p>
      <button className="back-button" onClick={onBack}>Volver</button>
    </section>
  );
};

export default BitacoraDetail;
