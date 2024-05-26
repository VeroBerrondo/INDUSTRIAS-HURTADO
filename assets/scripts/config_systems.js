import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, getDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
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

/**
 * image4: ["valor en la nube", "4"]
 * @returns {object} retorna una lista por clave.
 */
async function imagesVueLoad(saveVars) {
    const profileImagesCollection = collection(db, 'profileImage');
    const imageDoc = doc(profileImagesCollection, 'image');

    try {
        const imageDocSnapshot = await getDoc(imageDoc);
        
        if (imageDocSnapshot.exists()) {
            const imageData = imageDocSnapshot.data();
            Object.keys(imageData).forEach((key) => {
                const number = key.replace("image", "");
                saveVars[key] = [imageData[key], number];
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

function getMonthName(mes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes - 1];
}

function getUserInfo(userId) {
    const userDocPromise = getDoc(doc(db, "preferences", userId));

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

/*----- Funcion Principal -----*/
async function createUserCard(ImagesList, currentUserDict) {
    const userDoc = doc(collection(db, 'users'), currentUserUID);
        
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
        const userData = docSnap.data();
        const userPreferences = await getUserInfo(currentUserUID);

        const imgID = userData.selectedImage;
        const profileURL = ImagesList[ "image" + imgID][0];

        const fecha = new Date(userData.birthdate);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();

        let freshdata = {
            id: currentUserUID,
            imageURL: profileURL,
            imgID: imgID,
            name: userData.name,
            lastName: userData.lastname,
            birthdate: `Nació el ${dia.toString().padStart(2, '0')} de ${getMonthName(mes)} del año ${año}`,
            comments: `Le gusta ${userPreferences.activities.join(", ")}`
        };

        Object.keys(freshdata).forEach((key) => {
            currentUserDict[key] = freshdata[key];
        });
    } else {
        console.log('No such document!');
    }
}

/*----- Plantillas de Vue -----*/
Vue.component('current-profile-card', {
    props: ['data', 'executable'],
    template: `
        <div class="card currentProfile">
            <div class="card__content">
                <div class="card__top">
                    <img :src="data.imageURL">
                </div>
                <div class="card__bottom">
                    <div><h2>{{ data.name }} {{ data.lastName }}</h2></div>
                    <div>
                        <p>{{ data.birthdate }}</p>
                        <p>{{ data.comments }}</p>
                    </div>
                    <button class="button simple" @click="executable">Guardar nueva imagen seleccionada</button>
                </div>
            </div>
        </div>
    `
});

Vue.component('new-image-card', {
    props: ['data', 'user'],
    template: `
        <div v-if="data[1] !== user.imgID" class="card new_image" @click="handleCardTouch"">
            <div class="card__content">
                <label :for="data[1]" class="card__top">
                    <img :src="data[0]">
                </label>
                <div class="card__hidden">
                    <input :id="data[1]" type="radio" name="images" :value="data[1]">
                </div>
            </div>
        </div>
    `,
    methods: {
        handleCardTouch() {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('touched'));
            this.$el.classList.add('touched');
        }
    }
});

/*----- Funcionamiento de Vue -----*/
new Vue({
    el: '#app__mount-config',
    data: {
        userData: {},
        profileImages: {},
        maxWidthToShowElement: 799,
        dataLoaded: false,
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
        },
        async saveNewImage() {
            const selectedInput = document.querySelector('input[name="images"]:checked');
            if (selectedInput) {
                try {
                    await setDoc(doc(db, "users", currentUserUID), {
                        selectedImage: selectedInput.value
                    }, { merge: true });

                    // Actualizar la imagen mostrada
                    alert('Imagen de perfil guardada correctamente.');
                    window.location.reload();                    
                } catch (error) {
                    console.error('Error al guardar la imagen:', error);
                    alert('Error al guardar la imagen: ' + error.message);
                }
            } else {
                console.log("denegado", selectedInput);
                alert('Por favor selecciona una imagen.');
            }
        }
    },
    created() {
        imagesVueLoad(this.profileImages)
        .then(() => {
            createUserCard(this.profileImages, this.userData).then(()=> {
                this.dataLoaded = true;
            })
        })
        .catch((error) => {
            console.error('Error al cargar las imágenes de perfil:', error);
        });
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    }
});