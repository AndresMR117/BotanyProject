import React from 'react';
import { Typography, Box } from '@mui/material';
import AuthButtons from '../AuthButtons/AuthButtons'; // Asegúrate de importar el componente
import './Header.css';

const Header = () => {
  return (
    <Box className="header-container">
      <div className="header-left">
        <AuthButtons />
      </div>
      <Typography variant="h3" className="header-title">
        Bitácora Botánica
      </Typography>
      <Typography variant="subtitle1" className="header-subtitle">
        Registro de muestreos y observaciones botánicas
      </Typography>
    </Box>
  );
};

export default Header;
