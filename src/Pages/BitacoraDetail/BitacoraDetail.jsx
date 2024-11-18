import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Importamos jsPDF
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
  
    // Colores personalizados
    const greenPrimary = [46, 125, 50]; // Verde principal
    const greenLight = [241, 248, 233]; // Verde claro
    const textDark = [33, 37, 41]; // Texto oscuro
    const gray = [100];
  
    // Fondo de título
    doc.setFillColor(...greenPrimary);
    doc.rect(0, 0, 210, 25, 'F'); // Fondo del encabezado
  
    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text('Bitácora de Observación', 105, 15, null, null, 'center');
  
    // Sección de contenido
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...textDark);
  
    doc.setFillColor(...greenLight); // Fondo verde claro
    doc.rect(10, 30, 190, 10, 'F'); // Fondo para el título del detalle
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenPrimary);
    doc.text('Detalles de la Bitácora', 15, 37);
  
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    doc.text(`Título: ${bitacora.title}`, 10, 50);
    doc.text(`Fecha y Hora: ${bitacora.dateTime}`, 10, 60);
    doc.text(`Localización: ${bitacora.location}`, 10, 70);
    doc.text(`Condiciones Climáticas: ${bitacora.climate}`, 10, 80);
  
    // Descripción del hábitat
    doc.setFillColor(...greenLight);
    doc.rect(10, 90, 190, 10, 'F'); // Fondo para el título de la descripción
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...greenPrimary);
    doc.text('Descripción del Hábitat:', 15, 97);
  
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textDark);
    const splitDescription = doc.splitTextToSize(bitacora.habitatDescription, 180);
    doc.text(splitDescription, 10, 110);
  
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
      <h1 className="detail-title">{bitacora.title}</h1>
      <p className="detail-date">Fecha y Hora: {bitacora.dateTime}</p>
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
