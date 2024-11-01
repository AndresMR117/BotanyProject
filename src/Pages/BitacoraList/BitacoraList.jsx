import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BitacoraList.css';

const BitacoraList = () => {
  const navigate = useNavigate();

  // Función para navegar a la página de detalle de una bitácora específica
  const handleNavigate = (id) => {
    navigate(`/bitacora-detail/${id}`);
  };

  return (
    <section className="bitacora-list">
      <div className="bitacora-item" onClick={() => handleNavigate(1)}>
        <h2 className="bitacora-title">Bitácora 1</h2>
        <p className="bitacora-description">Descripción de la bitácora...</p>
      </div>
      <div className="bitacora-item" onClick={() => handleNavigate(2)}>
        <h2 className="bitacora-title">Bitácora 2</h2>
        <p className="bitacora-description">Descripción de la bitácora...</p>
      </div>
      {/* Añade más bitácoras según sea necesario */}
    </section>
  );
};

export default BitacoraList;



