import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Importamos jsPDF
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'; // Firestore
import { db } from '../../Components/Firebase/FirebaseConfig'; // Configuración de Firebase
import './BitacoraDetail.css';

const BitacoraDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bitacora, setBitacora] = useState(null);
  const [especies, setEspecies] = useState([]);

  // Obtener la bitácora y las especies
  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const bitacoraRef = doc(db, 'bitacora', id);
        const bitacoraSnap = await getDoc(bitacoraRef);

        if (bitacoraSnap.exists()) {
          setBitacora({ id: bitacoraSnap.id, ...bitacoraSnap.data() });

          // Obtener especies relacionadas (subcolección)
          const especiesRef = collection(bitacoraRef, 'especies');
          const especiesSnap = await getDocs(especiesRef);

          const especiesData = especiesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEspecies(especiesData);
        } else {
          console.error('La bitácora no existe.');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchBitacora();
  }, [id]);

  const handleDelete = async () => {
    // Aquí implementas la eliminación de Firestore si es necesario
    navigate('/bitacoras');
  };

  const handleEdit = () => {
    navigate(`/bitacoras/edit/${id}`);
  };

  const handleAddNote = () => {
    navigate(`/bitacoras/${id}/add-note`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Colores personalizados
    const greenPrimary = [46, 125, 50];
    const greenLight = [241, 248, 233];
    const textDark = [33, 37, 41];
    const gray = [100];

    // Fondo de título
    doc.setFillColor(...greenPrimary);
    doc.rect(0, 0, 210, 25, 'F');

    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Bitácora de Observación', 105, 15, null, null, 'center');

    // Detalles de la bitácora
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...textDark);

    doc.setFillColor(...greenLight);
    doc.rect(10, 30, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenPrimary);
    doc.text('Detalles de la Bitácora', 15, 37);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(`Título: ${bitacora.title}`, 10, 50);
    doc.text(`Fecha y Hora: ${bitacora.dateTime}`, 10, 60);
    doc.text(`Localización: ${bitacora.location}`, 10, 70);
    doc.text(`Condiciones Climáticas: ${bitacora.climate}`, 10, 80);

    // Especies
    doc.setFillColor(...greenLight);
    doc.rect(10, 90, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenPrimary);
    doc.text('Especies Observadas:', 15, 97);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    especies.forEach((especie, index) => {
      const yPosition = 110 + index * 10;
      doc.text(`${index + 1}. ${especie.nombre} - ${especie.descripcion}`, 10, yPosition);
    });

    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text('Generado con Bitácoras App', 10, pageHeight - 10);
    doc.text(`Página 1`, 200, pageHeight - 10, null, null, 'right');

    // Guardar el PDF
    doc.save(`Bitacora_${bitacora.title.replace(/\s+/g, '_')}.pdf`);
  };

  if (!bitacora) {
    return <p>Bitácora no encontrada.</p>;
  }

  return (
    <section className="bitacora-detail">
      <button className="export-pdf-button" onClick={handleExportPDF}>Exportar PDF</button> 
      <button className="add-note-button" onClick={handleAddNote}>Agregar Nota</button>    
      <h1 className="detail-title">{bitacora.title}</h1>
      <p className="detail-date">Fecha y Hora: {bitacora.dateTime}</p>
      <p className="detail-location">Localización: {bitacora.location}</p>
      <p className="detail-climate">Condiciones Climáticas: {bitacora.climate}</p>
      <p className="detail-description"> Descripción del Hábitat: {bitacora.habitatDescription}</p>

      <h2 className="species-title">Especies Observadas</h2>
      <ul className="species-list">
        {especies.map((especie) => (
          <li key={especie.id}>
            <p><strong>{especie.nombre}</strong>: {especie.descripcion}</p>
          </li>
        ))}
      </ul>

      <div className="button-container">
        <button className="back-button" onClick={() => navigate(-1)}>Volver</button>    
        <button className="edit-button" onClick={handleEdit}>Editar Bitácora</button>    
        <button className="delete-button" onClick={handleDelete}>Eliminar Bitácora</button>    
      </div>
    </section>
  );
};

export default BitacoraDetail;
