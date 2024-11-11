import React from 'react';
import { Typography, Box } from '@mui/material';
import './Header.css';

const Header = () => {
  return (
    <Box className="header-container">
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
