import React, { useState } from "react";
import appFirebase from "../Firebase/FirebaseConfig";
import Swal from "sweetalert2";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import './Login.css';

const auth = getAuth(appFirebase);
const firestore = getFirestore(appFirebase);

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeNombre = (e) => setNombre(e.target.value);

  async function registrarUsuario(email, password, nombre) {
    try {
      const usuarioFirebase = await createUserWithEmailAndPassword(auth, email, password);
      const docuRef = doc(firestore, `usuarios/${usuarioFirebase.user.uid}`);
      await setDoc(docuRef, { correo: email, nombre: nombre });
      
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: `Bienvenido ${nombre}, tu cuenta ha sido creada.`,
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar usuario',
        text: error.message,
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  }

  async function iniciarSesion(email, password) {
    try {
      const usuarioFirebase = await signInWithEmailAndPassword(auth, email, password);
      const uid = usuarioFirebase.user.uid;

      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuSnap = await getDoc(docuRef);

      if (docuSnap.exists()) {
        const datosUsuario = docuSnap.data();
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: `¡Bienvenido de nuevo, ${datosUsuario.nombre}!`,
          confirmButtonText: 'Continuar'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo encontrar la información del usuario.',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        Swal.fire({
          icon: 'warning',
          title: 'Demasiados intentos',
          text: 'Has intentado iniciar sesión demasiadas veces. Espera un momento y vuelve a intentarlo.',
          confirmButtonText: 'Aceptar'
        });
      } else if (error.code === 'auth/user-not-found') {
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'No existe una cuenta con ese correo electrónico.',
          confirmButtonText: 'Intentar de nuevo'
        });
      } else if (error.code === 'auth/wrong-password') {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña incorrecta',
          text: 'La contraseña ingresada es incorrecta.',
          confirmButtonText: 'Intentar de nuevo'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    }
  }

  function submitHandler(e) {
    e.preventDefault();
    if (isRegistrando) {
      registrarUsuario(email, password, nombre);
    } else {
      iniciarSesion(email, password);
    }
  }

  const handleChangeForm = () => {
    setIsRegistrando(!isRegistrando);
    setEmail("");
    setPassword("");
    setNombre("");
  };

  return (
    <div className="contenedor__todo">
      <div className="caja__trasera">
        {isRegistrando ? (
          <div>
            <h3>¿Ya tienes cuenta?</h3>
            <p>Inicia sesión para acceder</p>
            <button className="botons" onClick={handleChangeForm}>Iniciar Sesión</button>
          </div>
        ) : (
          <div id="caja__trasera2">
            <h3>¿Aún no tienes cuenta?</h3>
            <p>Regístrate para empezar</p>
            <button className="botons" onClick={handleChangeForm}>Registrarse</button>
          </div>
        )}
      </div>

      <div className={`contenedor__login-register ${isRegistrando ? "isRegistrando" : ""}`}>
        {isRegistrando ? (
          <form className="formulario__register" onSubmit={submitHandler}>
            <h2>Regístrate</h2>
            <input 
              name="nombre" 
              type="text" 
              placeholder="Nombre" 
              required 
              value={nombre} 
              onChange={handleChangeNombre} 
              className="imputs"
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              required 
              value={email} 
              onChange={handleChangeEmail} 
              className="imputs"
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              required 
              value={password} 
              onChange={handleChangePassword} 
              className="imputs"
            />
            <button type="submit">Registrar</button>
          </form>
        ) : (
          <form className="formulario__login" onSubmit={submitHandler}>
            <h2>Iniciar Sesión</h2>
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              required 
              value={email} 
              onChange={handleChangeEmail} 
              className="imputs"
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              required 
              value={password} 
              onChange={handleChangePassword} 
              className="imputs"
            />
            <button type="submit">Iniciar Sesión</button>
          </form>
        )}
      </div>
    </div>
  );
} 

export default Login;