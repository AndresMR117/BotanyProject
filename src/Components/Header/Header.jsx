import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import appFirebase from '../Firebase/FirebaseConfig';
import {getAuth, signOut} from 'firebase/auth'
const auth=getAuth(appFirebase);
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
      <Button
        variant="outlined"
        color="inherit"
        className="users-button"
      >
        Usuarios
      </Button>

  
      <Button onClick={()=> signOut(auth)}
        variant="outlined"
        color="inherit"
        className="logout-button"
      >
        Cerrar Sesión
      </Button>
    </Box>
  );
};

export default Header;


