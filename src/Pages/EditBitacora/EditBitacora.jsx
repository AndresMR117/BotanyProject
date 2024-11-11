// src/Pages/EditBitacora/EditBitacora.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditBitacora.css';

const EditBitacora = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bitacora, setBitacora] = useState({
    title: '',
    dateTime: '', // Cambiamos de "date" a "dateTime" para incluir la hora.
    location: '',
    climate: '',
    habitatDescription: '',
  });

  useEffect(() => {
    const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    const foundBitacora = storedBitacoras.find((b) => b.id === Number(id));
    if (foundBitacora) {
      setBitacora(foundBitacora);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBitacora((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearField = (fieldName) => {
    setBitacora((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const handleSave = () => {
    const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    const updatedBitacoras = storedBitacoras.map((b) =>
      b.id === Number(id) ? bitacora : b
    );
    localStorage.setItem('bitacoras', JSON.stringify(updatedBitacoras));
    navigate('/bitacoras');
  };

  return (
    <section className="edit-bitacora">
      <h1>Editar Bitácora</h1>
      <label>
        Título:
        <input
          type="text"
          name="title"
          value={bitacora.title}
          onChange={handleChange}
        />
        <button onClick={() => handleClearField('title')}>Borrar</button>
      </label>
      <label>
        Fecha y Hora:
        <input
          type="datetime-local" // Cambiamos de "date" a "datetime-local"
          name="dateTime"
          value={bitacora.dateTime}
          onChange={handleChange}
        />
        <button onClick={() => handleClearField('dateTime')}>Borrar</button>
      </label>
      <label>
        Localización:
        <input
          type="text"
          name="location"
          value={bitacora.location}
          onChange={handleChange}
        />
        <button onClick={() => handleClearField('location')}>Borrar</button>
      </label>
      <label>
        Condiciones Climáticas:
        <input
          type="text"
          name="climate"
          value={bitacora.climate}
          onChange={handleChange}
        />
        <button onClick={() => handleClearField('climate')}>Borrar</button>
      </label>
      <label>
        Descripción del Hábitat:
        <textarea
          name="habitatDescription"
          value={bitacora.habitatDescription}
          onChange={handleChange}
        />
        <button onClick={() => handleClearField('habitatDescription')}>Borrar</button>
      </label>
      <div className="button-container">
        <button onClick={() => navigate(-1)}>Cancelar</button>
        <button onClick={handleSave}>Guardar Cambios</button>
      </div>
    </section>
  );
};

export default EditBitacora;


