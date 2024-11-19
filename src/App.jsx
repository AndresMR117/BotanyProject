// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Componentes principales
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Pages/HomePage/HomePage';
import BitacoraForm from './Pages/BitacoraForm/BitacoraForm';
import BitacoraList from './Pages/BitacoraList/BitacoraList';
import BitacoraDetail from './Pages/BitacoraDetail/BitacoraDetail';
import EditBitacora from './Pages/EditBitacora/EditBitacora';
import AddNote from './Pages/AddNote/AddNote';
import Login from './Components/Login/Login';
import appFirebase from './Components/Firebase/FirebaseConfig'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
const auth = getAuth(appFirebase)

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Verde botánico
    },
    secondary: {
      main: '#8bc34a', // Verde claro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const App = () => {

  const[usuario, setUsuario] = useState(null);

  onAuthStateChanged(auth, (usuarioFirebase)=>{
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase)
    }else{
      setUsuario(null)
    }
  })

return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      {usuario ? (
        <div className="app-container">
          <Header />
          <NavBar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bitacoras" element={<BitacoraList />} />
              <Route path="/bitacoras/nueva" element={<BitacoraForm />} />
              <Route path="/bitacoras/:id" element={<BitacoraDetail />} />
              <Route path="/bitacoras/:id/add-note" element={<AddNote />} />
              <Route path="/bitacoras/edit/:id" element={<EditBitacora />} />
            </Routes>
          </main>
          <Footer />
        </div>
      ) : (
        <Login />
      )}
    </Router>
  </ThemeProvider>
);
};

export default App;









