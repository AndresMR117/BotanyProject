// src/components/Footer.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="body2" color="inherit">
        © 2024 Botany Project. Todos los derechos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
