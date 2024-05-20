import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';

const firebaseConfig = {

  apiKey: "AIzaSyDVSG-i1dkjcWvZgXLJ3Ahp_q6ye-WAhfo",
  authDomain: "heart-7d6b1.firebaseapp.com",
  projectId: "heart-7d6b1",
  storageBucket: "heart-7d6b1.appspot.com",
  messagingSenderId: "721295981788",
  appId: "1:721295981788:web:90cf47cb71c37d61da4819",
  measurementId: "G-SNJQ16Z23B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function iniciarSesion(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuario autenticado:", user);
    window.location.href = "./app/chat.html";
  } catch (error) {
    console.error("Error al iniciar sesion:", error.message);
    alert("Error al iniciar sesion. Verifica tus credenciales e intenta nuevamente.")
  }
}
// Función para validar el formato del correo electrónico
function validarEmail(email) {
  // Expresión regular para validar el formato del correo electrónico
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
//Funcion para validar que la contraseña tenga 6 caracteres o mas
function validarPassword(password) {
  return password.length >= 6;
}
const password = "abc123";
if (validarPassword(password)) {
  console.log("El password es válido.");
} else {
  console.log("El password no es válido. Debe tener al menos 6 caracteres.");
}

// Obtener el formulario de inicio de sesión
const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar que el formulario se envíe de manera tradicional


  const email = loginForm.email.value;
  const password = loginForm.password.value;

  // Validar el formato del correo electrónico antes de iniciar sesión
  if (!validarEmail(email)) {
    // Si el correo electrónico no tiene un formato válido, mostrar un mensaje de error
    alert("Por favor, ingresa un correo electrónico válido.");
    return; // Detener el proceso de inicio de sesión
  }


  iniciarSesion(email, password);
})




