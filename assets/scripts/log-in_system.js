import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyBEYbPUrWo2UNNw8MHy8qdOOzEjGfJKATA",
  authDomain: "heartmate-168db.firebaseapp.com",
  projectId: "heartmate-168db",
  storageBucket: "heartmate-168db.appspot.com",
  messagingSenderId: "437656068270",
  appId: "1:437656068270:web:d3fbf3f6a9beaa4b04cd3f",
  measurementId: "G-TXVE9873VJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function iniciarSesion(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.warn("Usuario autenticado:", user);
    window.location.href = "app/index.html"; /*chatHeartMate.html*/
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




