// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'

const Navbar = () => (
  <nav className="navbar">
    <ul>
      <li><Link to="/">Inicio</Link></li>
      <li><Link to="/bitacoras">Bitácoras</Link></li>
      <li><Link to="/bitacoras/nueva">Nueva Bitácora</Link></li>
    </ul>
  </nav>
);

export default Navbar;

