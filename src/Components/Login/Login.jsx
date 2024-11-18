import React, { useState } from "react";
import appFirebase from "../Firebase/FirebaseConfig";
import Swal from "sweetalert2";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import './Login.css';

const auth = getAuth(appFirebase);
const firestore = getFirestore(appFirebase);

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeRol = (e) => setRol(e.target.value);

  async function registrarUsuario(email, password, rol) {
    try {
      const usuarioFirebase = await createUserWithEmailAndPassword(auth, email, password);
      const docuRef = doc(firestore, `usuarios/${usuarioFirebase.user.uid}`);
      await setDoc(docuRef, { correo: email, rol: rol });
      
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: `Bienvenido ${email}, tu cuenta ha sido creada.`,
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

  function submitHandler(e) {
    e.preventDefault();
    if (isRegistrando) {
      registrarUsuario(email, password, rol);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: `¡Bienvenido de nuevo, ${email}!`,
            confirmButtonText: 'Continuar'
          });
        })
        .catch((error) => {
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
        });
    }
  }

  const handleChangeForm = () => {
    setIsRegistrando(!isRegistrando);
    setEmail("");
    setPassword("");
    setRol("");
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
              name="rol" 
              type="text" 
              placeholder="Rol" 
              required 
              value={rol} 
              onChange={handleChangeRol} 
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