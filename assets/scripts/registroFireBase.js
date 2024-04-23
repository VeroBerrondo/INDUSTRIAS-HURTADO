import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Configuración del proyecto en Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBEYbPUrWo2UNNw8MHy8qdOOzEjGfJKATA",
    authDomain: "heartmate-168db.firebaseapp.com",
    projectId: "heartmate-168db",
    storageBucket: "heartmate-168db.appspot.com",
    messagingSenderId: "437656068270",
    appId: "1:437656068270:web:d3fbf3f6a9beaa4b04cd3f",
    measurementId: "G-TXVE9873VJ"
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

    // Comprobación de la longitud de la contraseña
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            fecha_cumpleanos: document.getElementById('fecha_cumpleanos').value,
            usuario: document.getElementById('usuario').value,
            email: email
        });
        alert('Registro completo. Bienvenido!');
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Error en el registro: ' + error.message);
    }
}








