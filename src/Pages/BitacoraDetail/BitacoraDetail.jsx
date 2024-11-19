import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Importamos jsPDF
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'; // Firestore
import { db } from '../../Components/Firebase/FirebaseConfig'; // Configuración de Firebase
import './BitacoraDetail.css';

const BitacoraDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bitacora, setBitacora] = useState(null);
    const [especies, setEspecies] = useState([]); // Estado para las especies

    // Obtener la bitácora y las especies
    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                const bitacoraRef = doc(db, 'bitacora', id);
                const bitacoraSnap = await getDoc(bitacoraRef);
                if (bitacoraSnap.exists()) {
                    setBitacora({ id: bitacoraSnap.id, ...bitacoraSnap.data() });
                    
                    // Obtener especies relacionadas (subcolección)
                    const especiesRef = collection(bitacoraRef, 'especie');
                    const especiesSnap = await getDocs(especiesRef);
                    const especiesData = especiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        try {
            // Eliminar la bitácora
            await deleteDoc(doc(db, 'bitacora', id));
            alert('Bitácora eliminada exitosamente.');
            navigate('/bitacoras'); // Redirigir a la lista de bitácoras
        } catch (error) {
            console.error('Error al eliminar la bitácora:', error);
            alert('Hubo un error al eliminar la bitácora.');
        }
    };

    const handleEdit = () => {
        navigate(`/bitacoras/edit/${id}`);
    };

    const handleAddNote = () => {
        navigate(`/bitacoras/${id}/add-note`);
    };

    const handleExportPDF = async () => {
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
        doc.text(`Descripción del Hábitat: ${bitacora.habitatDescription}`, 10, 90);
    
        let yPosition = 100;
    
        // Agregar imagen del sitio
        if (bitacora.sitePhoto) {
            try {
                const imgData = await fetch(bitacora.sitePhoto).then((res) => res.blob()).then((blob) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                });
                doc.addImage(imgData, 'JPEG', 10, yPosition, 60, 40); // Ajusta las dimensiones según sea necesario
                yPosition += 50;
            } catch (error) {
                console.error('Error al cargar la imagen del sitio:', error);
            }
        }
    
        // Observaciones
        if (bitacora.observations) {
            doc.setFillColor(...greenLight);
            doc.rect(10, yPosition, 190, 10, 'F');
    
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...greenPrimary);
            doc.text('Observaciones:', 15, yPosition + 7);
            yPosition += 15;
    
            // Agregar el texto de las observaciones
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textDark);
            const observationsText = bitacora.observations || "No hay observaciones";
    
            // Dividir el texto en líneas para que se ajuste al ancho de la página
            const lines = doc.splitTextToSize(observationsText, 190);
            doc.text(lines, 10, yPosition);
    
            // Ajustar la posición después de las observaciones
            yPosition += lines.length * 6; // Ajusta la altura según el tamaño de las líneas
    
            // Asegurarse de que no se solapen con otros elementos
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        }
    
        // Especies observadas
        doc.setFillColor(...greenLight);
        doc.rect(10, yPosition, 190, 10, 'F');
    
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...greenPrimary);
        doc.text('Especies Observadas:', 15, yPosition + 7);
        yPosition += 15;
    
        // Detalles de las especies con imágenes
        for (const especie of especies) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...textDark);
            doc.text(`Nombre Científico: ${especie.name}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Nombre Común: ${especie.commonName}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Familia: ${especie.family}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Cantidad: ${especie.quantity}`, 10, yPosition);
            yPosition += 10;
            doc.text(`Estado: ${especie.state}`, 10, yPosition);
            yPosition += 10;
    
            // Imagen de la especie
            if (especie.photo) {
                try {
                    const imgData = await fetch(especie.photo).then((res) => res.blob()).then((blob) => {
                        return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                    });
                    doc.addImage(imgData, 'JPEG', 10, yPosition, 60, 40); // Ajusta las dimensiones según sea necesario
                    yPosition += 50;
                } catch (error) {
                    console.error(`Error al cargar la imagen de la especie ${especie.name}:`, error);
                }
            }
    
            // Ajustar posición para evitar solapamiento
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        }
    
        // Pie de página
        const pageHeight = doc.internal.pageSize.height;
    
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...gray);
    
        doc.text('Generado con Bitácoras App', 10, pageHeight - 10);
    
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
          <p className="detail-description">Descripción del Hábitat: {bitacora.habitatDescription}</p>
          <p className="detail-observations">Observaciones: {bitacora.observations || "No hay observaciones"}</p>

          {/* Mostrar imagen del sitio */}
          {bitacora.sitePhoto && (
              <div className="site-photo">
                  <p><strong>Foto del Sitio</strong></p>
                  <img src={bitacora.sitePhoto} alt="Imagen del Sitio" />
              </div>
          )}

          <h2 className="species-title">Especies Observadas</h2>
          <ul className="species-list">
              {especies.map((especie) => (
                  <li key={especie.id}>
                      <p><strong>Nombre Científico:</strong> {especie.name}</p>
                      <p><strong>Nombre Común:</strong> {especie.commonName}</p>
                      <p><strong>Familia:</strong> {especie.family}</p>
                      <p><strong>Cantidad:</strong> {especie.quantity}</p>
                      <p><strong>Estado:</strong> {especie.state}</p>
                      {/* Mostrar imagen de la especie si existe */}
                      {especie.photo && (
                          <>
                              <p><strong>Foto de la Especie</strong></p>
                              <img src={especie.photo} alt={`Imagen de ${especie.name}`} />
                          </>
                      )}
                  </li>
              ))}
          </ul>

          {/* Mostrar notas si existen */}
          {bitacora.notes && bitacora.notes.length > 0 && (
              <>
                  <h2 className="notes-title">Notas</h2>
                  <ul className="notes-list">
                      {bitacora.notes.map((note, index) => (
                          <li key={index}>{note}</li>
                      ))}
                  </ul>
              </>
          )}

          <div className="button-container">
              <button className="back-button" onClick={() => navigate(-1)}>Volver</button>
              <button className="edit-button" onClick={handleEdit}>Editar Bitácora</button>
              <button className="delete-button" onClick={handleDelete}>Eliminar Bitácora</button>
          </div>
      </section>
    );
};

export default BitacoraDetail;