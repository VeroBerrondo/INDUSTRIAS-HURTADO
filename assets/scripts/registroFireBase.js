import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Configuración del proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVSG-i1dkjcWvZgXLJ3Ahp_q6ye-WAhfo",
  authDomain: "heart-7d6b1.firebaseapp.com",
  projectId: "heart-7d6b1",
  storageBucket: "heart-7d6b1.appspot.com",
  messagingSenderId: "721295981788",
  appId: "1:721295981788:web:90cf47cb71c37d61da4819",
  measurementId: "G-SNJQ16Z23B"

};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener una instancia de Auth
const auth = getAuth(app);

// Obtener una instancia de Firestore
const db = getFirestore(app);
window.register = async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Función para validar el formato del correo electrónico
  function validarEmail(email) {
    // Expresión regular para validar el formato del correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  // Validar el formato del correo electrónico antes de iniciar sesión
  if (!validarEmail(email)) {
    // Si el correo electrónico no tiene un formato válido, mostrar un mensaje de error
    alert("Por favor, ingresa un correo electrónico válido.");
    return; // Detener el proceso de inicio de sesión
  }
  // Comprobación de la longitud de la contraseña
  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: document.getElementById('name').value,
      lastname: document.getElementById('lastname').value,
      birthdate: document.getElementById('birthdate').value,
      nameUser: document.getElementById('nameUser').value,
      email: email
    });
    alert('Registro completo. Bienvenido!');
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Error en el registro: ' + error.message);
  }

}


window.savePreferences = async function savePreferences() {
  try {
    const userId = auth.currentUser.uid; // Obténer el ID del usuario actual
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;


    // Manejar opciones de radio
    const genderOptions = document.querySelectorAll('input[name="gender"]');
    let genderSelected;
    genderOptions.forEach(option => {
      if (option.checked) {
        genderSelected = option.value;
      }
    });
    // Manejar opciones de checkbox
    const activitiesCheckbox = document.querySelectorAll('input[name="enjoy"]:checked');
    const activitiesSelected = [];
    activitiesCheckbox.forEach(checkbox => {
      activitiesSelected.push(checkbox.value);
    })

    const checkboxOptions = document.querySelectorAll('input[name="range"]:checked');
    const rangeSelected = [];
    checkboxOptions.forEach(option => {
      rangeSelected.push(option.value);
    });

    // Obtener comentario
    const comments = document.getElementById('comments').value;

    // Guarda las preferencias del usuario en Firestore
    await setDoc(doc(db, "preferences", userId), {

      country: country,
      city: city,
      gender: genderSelected,
      range: rangeSelected,
      activities: activitiesSelected,
      comments: comments,
    });

    alert('Preferencias guardadas correctamente.');
    window.location.href = "log_in.html";
  } catch (error) {
    console.error('Error al guardar preferencias:', error);
    alert('Error al guardar preferencias: ' + error.message);
  }
}















