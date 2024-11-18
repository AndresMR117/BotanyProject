import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BitacoraForm.css';

const BitacoraForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [climate, setClimate] = useState('');
  const [habitatDescription, setHabitatDescription] = useState('');
  const [sitePhotos, setSitePhotos] = useState([]);
  const [observations, setObservations] = useState('');
  const [species, setSpecies] = useState([
    { name: '', commonName: '', family: '', quantity: 1, state: '', photos: [] },
  ]);

  const handleAddSpecies = () => {
    setSpecies([...species, { name: '', commonName: '', family: '', quantity: 1, state: '', photos: [] }]);
  };

  const handleSaveBitacora = () => {
    const newBitacora = {
      id: Date.now(),
      title,
      dateTime, // Actualizamos aquí
      location,
      climate,
      habitatDescription,
      sitePhotos,
      observations,
      species,
    };

    const existingBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    localStorage.setItem('bitacoras', JSON.stringify([...existingBitacoras, newBitacora]));
    navigate('/bitacoras');
  };

  return (
    <section className="bitacora-form">
      <div className="form-field">
        <label className="form-label">Título de la Bitácora</label>
        <input className="form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Escribe el título" />
      </div>
      <div className="form-field">
        <label className="form-label">Fecha y Hora del Muestreo</label>
        <input className="form-input" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} /> {/* Actualizamos aquí */}
      </div>
      <div className="form-field">
        <label className="form-label">Localización Geográfica (Coordenadas GPS)</label>
        <input className="form-input" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej. 6.2442° N, 75.5812° W" />
      </div>
      <div className="form-field">
        <label className="form-label">Condiciones Climáticas</label>
        <input className="form-input" type="text" value={climate} onChange={(e) => setClimate(e.target.value)} placeholder="Ej. Soleado, 25°C" />
      </div>
      <div className="form-field">
        <label className="form-label">Descripción del Hábitat</label>
        <textarea className="form-input" value={habitatDescription} onChange={(e) => setHabitatDescription(e.target.value)} placeholder="Escribe una descripción del hábitat"></textarea>
      </div>
      <div className="form-field">
        <label className="form-label">Fotografías del Sitio de Muestreo</label>
        <input className="form-input" type="file" multiple onChange={(e) => setSitePhotos([...e.target.files])} />
      </div>

      <h3>Detalles de las Especies Recolectadas</h3>
      {species.map((sp, index) => (
        <div key={index} className="species-section">
          <div className="form-field">
            <label className="form-label">Nombre Científico</label>
            <input className="form-input" type="text" value={sp.name} onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].name = e.target.value;
              setSpecies(newSpecies);
            }} placeholder="Nombre científico" />
          </div>
          <div className="form-field">
            <label className="form-label">Nombre Común</label>
            <input className="form-input" type="text" value={sp.commonName} onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].commonName = e.target.value;
              setSpecies(newSpecies);
            }} placeholder="Nombre común" />
          </div>
          <div className="form-field">
            <label className="form-label">Familia</label>
            <input className="form-input" type="text" value={sp.family} onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].family = e.target.value;
              setSpecies(newSpecies);
            }} placeholder="Familia" />
          </div>
          <div className="form-field">
            <label className="form-label">Cantidad de Muestras</label>
            <input className="form-input" type="number" min="1" value={sp.quantity} onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].quantity = e.target.value;
              setSpecies(newSpecies);
            }} />
          </div>
          <div className="form-field">
            <label className="form-label">Estado de la Planta</label>
            <select className="form-input" value={sp.state} onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].state = e.target.value;
              setSpecies(newSpecies);
            }}>
              <option value="viva">Viva</option>
              <option value="seca">Seca</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Fotografías de la Especie</label>
            <input className="form-input" type="file" multiple onChange={(e) => {
              const newSpecies = [...species];
              newSpecies[index].photos = [...e.target.files];
              setSpecies(newSpecies);
            }} />
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddSpecies} className="add-species-button">Agregar Otra Especie</button>
      <div className="form-field">
        <label className="form-label">Observaciones Adicionales</label>
        <textarea className="form-input" value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Escribe observaciones adicionales"></textarea>
      </div>
      <button onClick={handleSaveBitacora} className="submit-button">Guardar Bitácora</button>
    </section>
  );
};

export default BitacoraForm;
