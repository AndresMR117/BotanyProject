import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Components/Firebase/FirebaseConfig'; 
import './BitacoraList.css';

const BitacoraList = () => {
  const navigate = useNavigate();
  const [bitacoras, setBitacoras] = useState([]);
  const [filteredBitacoras, setFilteredBitacoras] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    habitat: '',
    climate: '',
  });
  const [sortOrder, setSortOrder] = useState('date');

  // Obtener las bitácoras desde Firestore
  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bitacora'));
        const bitacoraData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBitacoras(bitacoraData);
        setFilteredBitacoras(bitacoraData);
      } catch (error) {
        console.error('Error al obtener las bitácoras:', error);
      }
    };

    fetchBitacoras();
  }, []);

  // Filtrar las bitácoras
  useEffect(() => {
    let result = bitacoras;

    if (filters.title) {
      result = result.filter(bitacora =>
        bitacora.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.startDate) {
      result = result.filter(bitacora => new Date(bitacora.dateTime) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(bitacora => new Date(bitacora.dateTime) <= new Date(filters.endDate));
    }

    if (filters.location) {
      result = result.filter(bitacora =>
        bitacora.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.habitat) {
      result = result.filter(bitacora =>
        bitacora.habitatDescription.toLowerCase().includes(filters.habitat.toLowerCase())
      );
    }

    if (filters.climate) {
      result = result.filter(bitacora =>
        bitacora.climate.toLowerCase().includes(filters.climate.toLowerCase())
      );
    }

    if (sortOrder === 'date') {
      result.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    } else if (sortOrder === 'location') {
      result.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortOrder === 'relevance') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBitacoras(result);
  }, [bitacoras, filters, sortOrder]);

  const handleNavigate = (id) => {
    navigate(`/bitacoras/${id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <section className="bitacora-list">
      <div className="filters">
        <h2 className="filters-title">Filtrar Bitácoras</h2>
        <input
          type="text"
          name="title"
          placeholder="Buscar por título"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Buscar por ubicación"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="habitat"
          placeholder="Buscar por hábitat"
          value={filters.habitat}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="climate"
          placeholder="Buscar por clima"
          value={filters.climate}
          onChange={handleFilterChange}
        />
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="date">Fecha</option>
          <option value="location">Ubicación</option>
          <option value="relevance">Relevancia</option>
        </select>
      </div>
      
      <div className="bitacora-items">
        {filteredBitacoras.map(bitacora => (
          <div key={bitacora.id} className="bitacora-item" onClick={() => handleNavigate(bitacora.id)}>
            <h3>{bitacora.title}</h3>
            <p>Fecha y Hora: {new Date(bitacora.dateTime).toLocaleString()}</p>
            <p>Ubicación: {bitacora.location}</p>
            <p>Hábitat: {bitacora.habitatDescription}</p>
            <p>Clima: {bitacora.climate}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BitacoraList;







