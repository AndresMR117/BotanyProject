import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddNote.css';

const AddNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');

  const handleSave = () => {
    const storedBitacoras = JSON.parse(localStorage.getItem('bitacoras')) || [];
    const updatedBitacoras = storedBitacoras.map((b) =>
      b.id === Number(id)
        ? { ...b, notes: [...(b.notes || []), note] }
        : b
    );
    localStorage.setItem('bitacoras', JSON.stringify(updatedBitacoras));
    navigate('/bitacoras');
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


