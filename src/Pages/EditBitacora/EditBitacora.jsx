import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Components/Firebase/FirebaseConfig';
import './EditBitacora.css';

const EditBitacora = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bitacora, setBitacora] = useState({
    title: '',
    dateTime: '',
    location: '',
    climate: '',
    habitatDescription: '',
    observations: '',
    sitePhoto: null,
  });
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitacoraData = async () => {
      try {
        // Obtener los datos de la bitácora desde Firestore
        const bitacoraRef = doc(db, 'bitacora', id);
        const bitacoraSnapshot = await getDoc(bitacoraRef);

        if (bitacoraSnapshot.exists()) {
          setBitacora(bitacoraSnapshot.data());

          // Obtener las especies asociadas desde la subcolección
          const speciesCollectionRef = collection(bitacoraRef, 'especie');
          const speciesSnapshot = await getDocs(speciesCollectionRef);
          const speciesList = speciesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSpecies(speciesList);
        } else {
          alert('No se encontró la bitácora.');
          navigate('/bitacoras');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacoraData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBitacora((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpeciesChange = (index, field, value) => {
    const updatedSpecies = [...species];
    updatedSpecies[index][field] = value;
    setSpecies(updatedSpecies);
  };

  const handleClearField = (name) => {
    setBitacora((prev) => ({ ...prev, [name]: '' }));
  };

  const handleClearSpeciesField = (index, field) => {
    const updatedSpecies = [...species];
    updatedSpecies[index][field] = '';
    setSpecies(updatedSpecies);
  };

  const handleSave = async () => {
    try {
      // Actualizar los datos de la bitácora
      const bitacoraRef = doc(db, 'bitacora', id);
      await updateDoc(bitacoraRef, bitacora);

      // Actualizar cada especie
      const speciesCollectionRef = collection(bitacoraRef, 'especie');
      for (const sp of species) {
        const speciesDocRef = doc(speciesCollectionRef, sp.id);
        await updateDoc(speciesDocRef, sp);
      }

      alert('Bitácora actualizada exitosamente.');
      navigate('/bitacoras');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

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
        <button type="button" onClick={() => handleClearField('title')}>
          Borrar
        </button>
      </label>
      <label>
        Fecha y Hora:
        <input
          type="datetime-local"
          name="dateTime"
          value={bitacora.dateTime}
          onChange={handleChange}
        />
        <button type="button" onClick={() => handleClearField('dateTime')}>
          Borrar
        </button>
      </label>
      <label>
        Localización:
        <input
          type="text"
          name="location"
          value={bitacora.location}
          onChange={handleChange}
        />
        <button type="button" onClick={() => handleClearField('location')}>
          Borrar
        </button>
      </label>
      <label>
        Condiciones Climáticas:
        <input
          type="text"
          name="climate"
          value={bitacora.climate}
          onChange={handleChange}
        />
        <button type="button" onClick={() => handleClearField('climate')}>
          Borrar
        </button>
      </label>
      <label>
        Descripción del Hábitat:
        <textarea
          name="habitatDescription"
          value={bitacora.habitatDescription}
          onChange={handleChange}
        />
        <button type="button" onClick={() => handleClearField('habitatDescription')}>
          Borrar
        </button>
      </label>
      <label>
        Observaciones:
        <textarea
          name="observations"
          value={bitacora.observations}
          onChange={handleChange}
        />
        <button type="button" onClick={() => handleClearField('observations')}>
          Borrar
        </button>
      </label>
      <h3>Especies Recolectadas</h3>
      {species.map((sp, index) => (
        <div key={index} className="species-section">
          <label>
            Nombre Científico:
            <input
              type="text"
              value={sp.name}
              onChange={(e) => handleSpeciesChange(index, 'name', e.target.value)}
            />
            <button type="button" onClick={() => handleClearSpeciesField(index, 'name')}>
              Borrar
            </button>
          </label>
          <label>
            Nombre Común:
            <input
              type="text"
              value={sp.commonName}
              onChange={(e) => handleSpeciesChange(index, 'commonName', e.target.value)}
            />
            <button type="button" onClick={() => handleClearSpeciesField(index, 'commonName')}>
              Borrar
            </button>
          </label>
          <label>
            Familia:
            <input
              type="text"
              value={sp.family}
              onChange={(e) => handleSpeciesChange(index, 'family', e.target.value)}
            />
            <button type="button" onClick={() => handleClearSpeciesField(index, 'family')}>
              Borrar
            </button>
          </label>
          <label>
            Cantidad de Muestras:
            <input
              type="number"
              value={sp.quantity}
              onChange={(e) => handleSpeciesChange(index, 'quantity', e.target.value)}
            />
            <button type="button" onClick={() => handleClearSpeciesField(index, 'quantity')}>
              Borrar
            </button>
          </label>
          <label>
            Estado:
            <input
              type="text"
              value={sp.state}
              onChange={(e) => handleSpeciesChange(index, 'state', e.target.value)}
            />
            <button type="button" onClick={() => handleClearSpeciesField(index, 'state')}>
              Borrar
            </button>
          </label>
        </div>
      ))}
      <div className="button-container">
        <button onClick={() => navigate(-1)}>Cancelar</button>
        <button onClick={handleSave}>Guardar Cambios</button>
      </div>
    </section>
  );
};

export default EditBitacora;
