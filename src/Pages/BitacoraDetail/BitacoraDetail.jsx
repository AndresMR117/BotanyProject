// src/Pages/BitacoraDetail/BitacoraDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BitacoraDetail.css';

const BitacoraDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bitacora, setBitacora] = useState(null);

  useEffect(() => {
    const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    const foundBitacora = storedBitacoras.find((b) => b.id === Number(id));
    setBitacora(foundBitacora);
  }, [id]);

  const handleDelete = () => {
    const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    const updatedBitacoras = storedBitacoras.filter((b) => b.id !== Number(id));
    localStorage.setItem('bitacoras', JSON.stringify(updatedBitacoras));
    navigate('/bitacoras');
  };

  const handleEdit = () => {
    navigate(`/bitacoras/edit/${id}`);
  };

  if (!bitacora) {
    return <p>Bitácora no encontrada.</p>;
  }

  return (
    <section className="bitacora-detail">
      <h1 className="detail-title">{bitacora.title}</h1>
      <p className="detail-date">Fecha y Hora: {bitacora.dateTime}</p> {/* Cambiado a dateTime */}
      <p className="detail-location">Localización: {bitacora.location}</p>
      <p className="detail-climate">Condiciones Climáticas: {bitacora.climate}</p>
      <p className="detail-description">Descripción del Hábitat: {bitacora.habitatDescription}</p>
      <div className="button-container">
        <button className="back-button" onClick={() => navigate(-1)}>Volver</button>
        <button className="edit-button" onClick={handleEdit}>Editar Bitácora</button>
        <button className="delete-button" onClick={handleDelete}>Eliminar Bitácora</button>
      </div>
    </section>
  );
};

export default BitacoraDetail;




