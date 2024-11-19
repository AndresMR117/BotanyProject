import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import appFirebase from '../Firebase/FirebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Header.css';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false); // Estado para determinar si el usuario es admin
  const [loading, setLoading] = useState(true); // Estado para gestionar la carga del rol

  useEffect(() => {
    // Verificar el rol del usuario al iniciar sesión
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Obtener el documento del usuario desde Firestore
          const userDocRef = doc(db, 'usuarios', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'Admin'); // Verificar si el rol es 'admin'
          }
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        }
      } else {
        setIsAdmin(false); // Si no hay usuario autenticado, no es admin
      }
      setLoading(false);
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <Box className="header-container">
      <Typography variant="h3" className="header-title">
        Bitácora Botánica
      </Typography>
      <Typography variant="subtitle1" className="header-subtitle">
        Registro de muestreos y observaciones botánicas
      </Typography>

      {/* Solo mostrar el botón Usuarios si el usuario es admin y si el rol ha sido cargado */}
      {!loading && isAdmin && (
        <Button
          variant="outlined"
          color="inherit"
          className="users-button"
        >
          Usuarios
        </Button>
      )}

      <Button onClick={() => signOut(auth)}
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



