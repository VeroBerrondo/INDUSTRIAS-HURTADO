import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

/*----- Datos de la API -----*/
const firebaseConfig = {
    apiKey: "AIzaSyDVSG-i1dkjcWvZgXLJ3Ahp_q6ye-WAhfo",
    authDomain: "heart-7d6b1.firebaseapp.com",
    projectId: "heart-7d6b1",
    storageBucket: "heart-7d6b1.appspot.com",
    messagingSenderId: "721295981788",
    appId: "1:721295981788:web:90cf47cb71c37d61da4819",
    measurementId: "G-SNJQ16Z23B"
};

/*----- Variables de inicio -----*/
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let currentUserUID = null;

/*----- Procesos Previos -----*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUID = user.uid;
        console.log(currentUserUID); 
    } else {
        console.log("No hay usuario autenticado.");
        currentUserUID = null;
    }
});

/*----- Funciones Varias -----*/
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

/*----- Plantillas de Vue -----*/
Vue.component('user-card', {
    props: ['user'],
    template: `
        <div class="card">
            <h2>{{ user.name }} {{ user.lastname }}</h2>
            <p>{{ user.birthday }}</p>
            <p>Email: {{ user.email }}</p>
        </div>
    `
});

/*----- Funcionamiento de Vue -----*/
new Vue({
    el: '#app',
    data: {
        usersData: [] // Aquí se almacenarán los datos de los usuarios obtenidos de Firebase
    },
    created() {
        const usersCollection = collection(db, 'users'); // Acceder a la colección 'users'
        
        onSnapshot(usersCollection, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const userUID = doc.id;
                if (userUID !== currentUserUID) {
                    const userData = doc.data();
                    this.usersData.push(userData); // Agregar datos del usuario al array usersData
                }
            });
        });
    }
});