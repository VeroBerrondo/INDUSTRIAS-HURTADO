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

    <script type="module" src="../assets/scripts/chat_systems.js"></script>


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

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

let currentUserUid = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
        console.log(currentUserUid); 
    } else {
        console.log("No hay usuario autenticado.");
        currentUserUid = null;
    }
});

            .testing {
                width: 100px;
                height: 100px;
                overflow: hidden;
                position: relative;
                &::before {
                    content: "";
                    display: block;
                    width: 200%;
                    height: 200%;
                    position: absolute;
                    border-radius: 50%;
                    bottom: 0;
                    right: 0;
                    box-shadow: 50px 50px 0 0 red;
                }
            }
            .testingTwo {
                position: relative;
                width: 0;
                height: 0;
                border-left: 100px solid transparent; /* Triángulo */
                border-right: 100px solid transparent; /* Triángulo */
                border-bottom: 200px solid lightblue; /* Parte sólida */
                clip-path: polygon(0 0, 100% 0, 50% 100%);
            }