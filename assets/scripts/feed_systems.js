import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Configuración de Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

function getUserData(userId) {
    const userDocPromise = getDoc(doc(db, "users", userId));

    return userDocPromise.then((userDoc) => {
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.error("No se encontró el usuario en Firestore");
            return "¿?";
        }
    }).catch((error) => {
        console.error("Error al obtener el nombre de usuario:", error);
        return { usuario: "Error en usuario" };
    });
}

const usersRef = db.collection('users');
const currentUserUID = auth.currentUser.uid;

usersRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // Obtener el UID de cada usuario en la colección
        const userUID = doc.id;

        // Verificar si el usuario no es el usuario actual
        if (userUID !== currentUserUID) {
            const userData = doc.data();
            // Mostrar la información de los usuarios que no sean el usuario actual
            console.log(userData.name, userData.email);
            // Aquí puedes agregar lógica para mostrar los datos en tu página HTML
        }
    });
});