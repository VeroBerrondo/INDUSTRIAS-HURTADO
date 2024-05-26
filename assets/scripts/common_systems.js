import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
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

/*----- Procesos Previos -----*/
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No hay usuario autenticado.");
        window.location.replace('/log_in.html');
    }
});

/*----- Funcionamiento de Vue -----*/
new Vue({
    el: '#app__mount',
    data: {
        maxWidthToShowElement: 799
    },
    methods: {
        handleResize() {
            this.$forceUpdate();
        },
        logout() {
            auth.signOut().then(() => {
                console.log('Sesión cerrada exitosamente');
            }).catch((error) => {
                console.error('Error al cerrar la sesión', error);
            }); 
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
});