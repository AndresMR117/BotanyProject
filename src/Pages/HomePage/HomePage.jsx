// src/Pages/HomePage/HomePage.jsx
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <section className="home-section">
      <div className="home-content">
        <h1 className="home-welcome">Bienvenido al Botany Project</h1>
        <p className="home-description">
          Esta aplicación te permite registrar y gestionar muestreos botánicos de forma fácil y organizada. Explora el mundo de la botánica y lleva un seguimiento de tus descubrimientos y observaciones en la naturaleza.
        </p>
        
        <div className="home-features">
          <h2>Características del Proyecto Botánico:</h2>
          <ul>
            <li>Registra nuevos muestreos y observa su crecimiento con el tiempo.</li>
            <li>Filtra por ubicación, hábitat, clima y mucho más para organizar tus registros.</li>
            <li>Visualiza detalles de cada muestreo y edita información fácilmente.</li>
          </ul>
        </div>

        <div className="home-instructions">
          <h2>¿Cómo empezar?</h2>
          <p>Para comenzar, dirígete a la sección de "Nueva Bitácora" y registra tu primer muestreo. ¡Documenta cada observación y descubre patrones fascinantes en el mundo de las plantas!</p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;





