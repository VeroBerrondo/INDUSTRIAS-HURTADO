import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
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

/*----- Procesos Previos -----*/
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No hay usuario autenticado.");
        window.location.replace('/log_in.html');
    }
});

// Limpiar el chat
document.getElementById('limpiarChat').addEventListener('click', function () {
    document.getElementById('mensajes').innerHTML = '';
})

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

async function sendMessage(message) {
    if (message.trim() === "") return;
    try {
        await addDoc(collection(db, "mensajes"), {
            content: message,
            timestamp: serverTimestamp(),
            user: auth.currentUser.uid
        });
        document.getElementById('mensajeInput').value = '';  // Limpiar el input
    } catch (error) {
        console.error("Error al enviar mensaje: ", error);
    }
}

function getMonthName(mes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes - 1];
}

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
async function createMessages(messagesList, ImagesList) {
    const messagesQuery = query(collection(db, "mensajes"), orderBy("timestamp"));

    onSnapshot(messagesQuery, async (snapshot) => {
        for (const change of snapshot.docChanges()) {
            if (change.type === "added") {
                const messageData = change.doc.data();

                let id = change.doc.id;
                let profileURL;
                let UserName;
                let UserLastName;
                let content = messageData.content;
                let selfmsg = false;

                let fecha;
                if (messageData.timestamp == null) {
                    fecha = new Date();
                } else {
                    fecha = new Date(messageData.timestamp.seconds * 1000);
                }
                const dia = fecha.getDate();
                const mes = fecha.getMonth() + 1;
                const año = fecha.getFullYear();
                const hora = fecha.getHours();
                const minutos = fecha.getMinutes();
                
                try {
                    if (messageData.user == auth.currentUser.uid) {
                        selfmsg = true
                    }
                } catch {
                    console.log("error al identificar el auth.currentUser")
                }

                try {
                    const userData = await getUserData(messageData.user);
                    UserName = userData.name;
                    UserLastName = userData.lastname;
                    const imgID = "image" + userData.selectedImage
                    profileURL = ImagesList[imgID]
                } catch (error) {
                    console.error(error);
                }

                const freshdata = {
                    id: id,
                    profileURL: profileURL,
                    UserName: UserName,
                    UserLastName: UserLastName,
                    content: content,
                    dateTime: `${getMonthName(mes)} ${dia.toString().padStart(2, '0')} de ${año} ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`,
                    selfmsg: selfmsg
                }
                messagesList.push(freshdata);
                const event = new CustomEvent('nuevo-mensaje-recibido', { detail: { scrollNeeded: true } });
                document.dispatchEvent(event);
            }
        }
    });
}


/*----- Plantillas de Vue -----*/
Vue.component('message-card', {
    props: ['data'],
    template: `
        <div :class="['message', { 'self-msg': data.selfmsg }]">
            <div class="message__left-section">
                <div class="avatar">
                    <img :src="data.profileURL">
                </div>
            </div>
            <div class="message__right-section">
                <span class="user">{{ data.UserName }} {{ data.UserLastName }}</span>
                <p class="content">{{ data.content }}</p>
                <span class="time">{{ data.dateTime }}</span>
            </div>
        </div>
    `
});

/*----- Funcionamiento de Vue -----*/
new Vue({
    el: '#app__mount-chat',
    data: {
        currentChatID: "",
        messages: [],
        chatList: [],
        profileImages: {},
        maxWidthToShowElement: 799
    },
    methods: {
        handleResize() {
            this.$forceUpdate();
        },
        enviarMensaje() {
            const message = this.$refs.mensajeInput.value;
            sendMessage(message);
        },
        logout() {
            auth.signOut().then(() => {
                console.log('Sesión cerrada exitosamente');
            }).catch((error) => {
                console.error('Error al cerrar la sesión', error);
            }); 
        }
    },
    created() {
        imagesVueLoad(this.profileImages)
        .then(() => {
            createMessages(this.messages, this.profileImages);
        })
        .catch((error) => {
            console.error('Error al cargar las imágenes de perfil:', error);
        });
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('nuevo-mensaje-recibido', (event) => {
            const scrollNeeded = event.detail.scrollNeeded;
        
            if (scrollNeeded) {
                this.$nextTick(() => {
                    const messageWrapper = this.$refs.messageWrapper;
                    messageWrapper.scrollTop = messageWrapper.scrollHeight - messageWrapper.clientHeight;
                });
            }
        });
    },
});