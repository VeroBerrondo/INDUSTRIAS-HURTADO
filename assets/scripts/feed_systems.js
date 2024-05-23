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
    if (!user) {
        console.log("No hay usuario autenticado.");
        window.location.replace('/log_in.html');
    } else {
        currentUserUID = user.uid;
    }
});

/*----- Funciones Varias -----*/
async function imagesVueLoad(saveVars) {
    const profileImagesCollection = collection(db, 'profileImage');
    const imageDoc = doc(profileImagesCollection, 'image');
    
    try {
        const imageDocSnapshot = await getDoc(imageDoc);
        
        if (imageDocSnapshot.exists()) {
            const imageData = imageDocSnapshot.data();
            // Actualiza las propiedades individuales de saveVars en lugar de reemplazar el objeto completo
            Object.keys(imageData).forEach((key) => {
                saveVars[key] = imageData[key];
            });
            return saveVars;
        } else {
            console.log('El documento "image" no existe en la colección "profileImages".');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el documento:', error);
        return null;
    }
}

/*----- Funcion Principal -----*/
function createCards(usersList, ImagesList) {
    const usersCollection = collection(db, 'users');
        
    onSnapshot(usersCollection, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const userUID = doc.id;
            if (userUID !== currentUserUID) {
                const userData = doc.data();
                
                const imgID = "image" + userData.selectedImage
                const profileURL = ImagesList[imgID]

                const date = new Date(userData.birthdate)

                const freshdata = {
                    id: userUID,
                    imageURL: profileURL,
                    name: userData.name,
                    lastName: userData.lastname,
                    birthdate: date,
                    email: userData.email
                }

                usersList.push(freshdata);
            }
        });
    });
}

/*----- Plantillas de Vue -----*/
Vue.component('user-card', {
    props: ['data'],
    template: `
        <div class="card">
            <div class="card__top" :style="{ 'background-image': 'url(' + data.imageURL + ')' }">
                <span class="profile"><img :src="data.imageURL"></span>
            </div>
            <div class="card__bottom">
                <h2>{{ data.name }} {{ data.lastName }}</h2>
                <p>{{ data.birthdate }}</p>
                <p>Email: {{ data.email }}</p>
            </div>
        </div>
    `
});

/*----- Funcionamiento de Vue -----*/
new Vue({
    el: '#app__mount-feed',
    data: {
        usersData: [],
        profileImages: {},
        maxWidthToShowElement: 799
    },
    methods: {
        handleResize() {
            this.$forceUpdate();
        },
        logout() {
            auth.signOut().then(() => {
                // La sesión se cerró correctamente
                console.log('Sesión cerrada exitosamente');
            }).catch((error) => {
                // Ocurrió un error al cerrar la sesión
                console.error('Error al cerrar la sesión', error);
            }); 
        }
    },
    created() {
        imagesVueLoad(this.profileImages)
        .then(() => {
            createCards(this.usersData, this.profileImages);
        })
        .catch((error) => {
            console.error('Error al cargar las imágenes de perfil:', error);
        });
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
});