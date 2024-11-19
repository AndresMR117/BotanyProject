import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../Components/Firebase/FirebaseConfig';
import './BitacoraForm.css';

const BitacoraForm = () => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [climate, setClimate] = useState('');
  const [habitatDescription, setHabitatDescription] = useState('');
  const [observations, setObservations] = useState('');
  const [sitePhoto, setSitePhoto] = useState(null); // Para la imagen del sitio
  const [species, setSpecies] = useState([
    { name: '', commonName: '', family: '', quantity: 1, state: '', photos: null },
  ]);

  const uploadImage = async (imageFile, path) => {
    const imageRef = ref(storage, `${path}/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const handleSaveBitacora = async () => {
    // Validar si todos los campos están completos
    if (
      !title.trim() ||
      !dateTime.trim() ||
      !location.trim() ||
      !climate.trim() ||
      !habitatDescription.trim() ||
      !observations.trim() ||
      !species.every(sp => 
        sp.name.trim() && sp.commonName.trim() && sp.family.trim() && sp.quantity && sp.state
      )
    ) {
      alert('Por favor, completa todos los campos antes de guardar la bitácora.');
      return;
    }

    try {
      // Subir imagen del sitio si existe
      const sitePhotoURL = sitePhoto
        ? await uploadImage(sitePhoto, `bitacora_images/${title}`)
        : null;

      // Crear un documento en la colección `bitacora`
      const bitacoraRef = await addDoc(collection(db, 'bitacora'), {
        title,
        dateTime,
        location,
        climate,
        habitatDescription,
        observations,
        sitePhoto: sitePhotoURL, // Guardar la URL de la imagen del sitio
      });

      // Añadir las especies como subcolección
      const speciesCollectionRef = collection(bitacoraRef, 'especie');
      for (const sp of species) {
        const speciesPhotoURL = sp.photos
          ? await uploadImage(sp.photos, `species_images/${title}/${sp.name}`)
          : null;

        await addDoc(speciesCollectionRef, {
          name: sp.name,
          commonName: sp.commonName,
          family: sp.family,
          quantity: sp.quantity,
          state: sp.state,
          photo: speciesPhotoURL, // Guardar la URL de la imagen de la especie
        });
      }

      alert('Bitácora guardada exitosamente.');
    } catch (error) {
      console.error('Error al guardar la bitácora:', error);
      alert('Hubo un error al guardar la bitácora.');
    }
  };

  const handleSpeciesChange = (index, field, value) => {
    const updatedSpecies = [...species];
    updatedSpecies[index][field] = value;
    setSpecies(updatedSpecies);
  };

  const handleAddSpecies = () => {
    const lastSpecies = species[species.length - 1];
    if (
      !lastSpecies.name.trim() ||
      !lastSpecies.commonName.trim() ||
      !lastSpecies.family.trim() ||
      !lastSpecies.quantity ||
      !lastSpecies.state
    ) {
      alert('Por favor, completa todos los campos de la especie actual antes de agregar otra.');
      return;
    }
    setSpecies([...species, { name: '', commonName: '', family: '', quantity: 1, state: '', photos: null }]);
  };

  return (
    <section className="bitacora-form">
      <div className="form-field">
        <label className="form-label">Título de la Bitácora</label>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe el título"
        />
      </div>
      <div className="form-field">
        <label className="form-label">Fecha y Hora del Muestreo</label>
        <input
          className="form-input"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Localización Geográfica (Coordenadas GPS)</label>
        <input
          className="form-input"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej. 6.2442° N, 75.5812° W"
        />
      </div>
      <div className="form-field">
        <label className="form-label">Condiciones Climáticas</label>
        <input
          className="form-input"
          type="text"
          value={climate}
          onChange={(e) => setClimate(e.target.value)}
          placeholder="Ej. Soleado, 25°C"
        />
      </div>
      <div className="form-field">
        <label className="form-label">Descripción del Hábitat</label>
        <textarea
          className="form-input"
          value={habitatDescription}
          onChange={(e) => setHabitatDescription(e.target.value)}
          placeholder="Escribe una descripción del hábitat"
        ></textarea>
      </div>
      <div className="form-field">
        <label className="form-label">Imagen del Sitio</label>
        <input
          className="form-input"
          type="file"
          accept="image/*"
          onChange={(e) => setSitePhoto(e.target.files[0])}
        />
      </div>
      <h3>Detalles de las Especies Recolectadas</h3>
      {species.map((sp, index) => (
        <div key={index} className="species-section">
          <div className="form-field">
            <label className="form-label">Nombre Científico</label>
            <input
              className="form-input"
              type="text"
              value={sp.name}
              onChange={(e) => handleSpeciesChange(index, 'name', e.target.value)}
              placeholder="Nombre científico"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Nombre Común</label>
            <input
              className="form-input"
              type="text"
              value={sp.commonName}
              onChange={(e) => handleSpeciesChange(index, 'commonName', e.target.value)}
              placeholder="Nombre común"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Familia</label>
            <input
              className="form-input"
              type="text"
              value={sp.family}
              onChange={(e) => handleSpeciesChange(index, 'family', e.target.value)}
              placeholder="Familia"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Cantidad de Muestras</label>
            <input
              className="form-input"
              type="number"
              min="1"
              value={sp.quantity}
              onChange={(e) => handleSpeciesChange(index, 'quantity', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Estado de la Planta</label>
            <select
              className="form-input"
              value={sp.state}
              onChange={(e) => handleSpeciesChange(index, 'state', e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="viva">Viva</option>
              <option value="seca">Seca</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Imagen de la Especie</label>
            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleSpeciesChange(index, 'photos', e.target.files[0])
              }
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddSpecies} className="add-species-button">
        Agregar Otra Especie
      </button>
      <div className="form-field">
        <label className="form-label">Observaciones Adicionales</label>
        <textarea
          className="form-input"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Escribe observaciones adicionales"
        ></textarea>
      </div>
      <button onClick={handleSaveBitacora} className="submit-button">
        Guardar Bitácora
      </button>
    </section>
  );
};

export default BitacoraForm;
