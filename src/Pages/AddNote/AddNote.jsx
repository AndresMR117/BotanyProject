import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { db } from '../../Components/Firebase/FirebaseConfig'; 
import './AddNote.css';

const AddNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  const handleSave = async () => {
    if (note.trim() === '') {
      alert('La nota no puede estar vacía.');
      return;
    }

    try {
      const bitacoraRef = doc(db, 'bitacora', id);
      await updateDoc(bitacoraRef, {
        notes: arrayUnion(note), 
      });
      alert('Nota guardada exitosamente.');
      navigate('/bitacoras'); 
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      alert('Hubo un error al guardar la nota.');
    }
  };

  return (
    <section className="add-note">
      <h1>Agregar Nota</h1>
      <textarea
        className="note-input"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Escribe tu nota aquí..."
      ></textarea>
      <div className="button-container">
        <button id="save-button" onClick={handleSave}>
          Guardar
        </button>
        <button id="cancel-button" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>
    </section>
  );
};

export default AddNote;