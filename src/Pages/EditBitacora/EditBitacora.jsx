import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../Components/Firebase/FirebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
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
        const bitacoraRef = doc(db, 'bitacora', id);
        const bitacoraSnapshot = await getDoc(bitacoraRef);

        if (bitacoraSnapshot.exists()) {
          setBitacora(bitacoraSnapshot.data());

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

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Subir el archivo a Firebase Storage
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progreso de la carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Subiendo...', progress);
      },
      (error) => {
        console.error('Error al subir el archivo:', error);
      },
      async () => {
        // Obtener la URL después de la carga
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (type === 'sitePhoto') {
          setBitacora((prev) => ({ ...prev, sitePhoto: downloadURL }));
        } else if (type === 'speciesPhoto') {
          const updatedSpecies = [...species];
          updatedSpecies[e.target.dataset.index].photo = downloadURL;
          setSpecies(updatedSpecies);
        }
      }
    );
  };

  const handleSave = async () => {
    try {
      const bitacoraRef = doc(db, 'bitacora', id);
      await updateDoc(bitacoraRef, bitacora);

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

  const handleCancel = () => {
    navigate('/bitacoras'); 
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

      {/* Campo para la imagen del sitio */}
      <label>
        Foto del Sitio:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'sitePhoto')}
        />
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

          {/* Campo para la imagen de la especie */}
          <label>
            Foto de la Especie:
            <input
              type="file"
              accept="image/*"
              data-index={index}
              onChange={(e) => handleFileChange(e, 'speciesPhoto')}
            />
          </label>
        </div>
      ))}

      <div className="buttons">
        <button onClick={handleSave}>Guardar Cambios</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
      </div>
    </section>
  );
};

export default EditBitacora;



