// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Componentes principales
import Header from './Components/Header/Header';
import Footer from './components/Footer/Footer';
import NavBar from './Components/NavBar/NavBar';
import HomePage from './Pages/HomePage/HomePage';
import BitacoraForm from './Pages/BitacoraForm/BitacoraForm';
import BitacoraList from './Pages/BitacoraList/BitacoraList';
import BitacoraDetail from './Pages/BitacoraDetail/BitacoraDetail';
import Login from './Pages/Login/Login'; 
import Register from './Pages/Register/Register'; 

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Header />
          <NavBar />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bitacoras" element={<BitacoraList />} />
              <Route path="/bitacoras/nueva" element={<BitacoraForm />} />
              <Route path="/bitacoras/:id" element={<BitacoraDetail />} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/register" element={<Register />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;




