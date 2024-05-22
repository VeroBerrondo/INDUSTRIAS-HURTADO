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

/*----- Funcion Principal -----*/
function createMessages(messagesList) {
    const messagesQuery = query(collection(db, "mensajes"), orderBy("timestamp"));

    onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                /*obtener los datos del mensaje desde la coleccion*/
                const messageData = change.doc.data();
                
                /*inicializar las variables pertinentes*/
                let id = change.doc.id;
                let profileURL;
                let UserName;
                let UserLastName;
                let content = messageData.content;
                let dateTime;
                let selfmsg = false;

                /*ajuste de los datos de fecha*/
                let fecha;
                if (messageData.timestamp == null) {
                    fecha = new Date();
                } else {
                    fecha = new Date(messageData.timestamp.seconds*1000);
                }
                const dia = fecha.getDate();
                const mes = fecha.getMonth() + 1;
                const año = fecha.getFullYear();
                const hora = fecha.getHours();
                const minutos = fecha.getMinutes();
                
                /*variable de mensaje propio*/
                try {
                    if (messageData.user == auth.currentUser.uid) {
                        selfmsg = true
                    }
                } catch {
                    console.log("error al identificar el auth.currentUser")
                }
                
                /*obtencion de los nombres*/
                getUserData(messageData.user).then((userData) => {
                    UserName = userData.name;
                    UserLastName = userData.lastname;
                    if (userData.profile) {
                        profileURL = userData.selectedImage;
                    } else {
                        profileURL = "http://cache0.bigcartel.com/product_images/45752467/envelope.jpg"
                    }
                }).catch((error) => {
                    // Manejo de errores si getUserData() falla
                    console.error(error);
                });
    
                dateTime = `${getMonthName(mes)} ${dia.toString().padStart(2, '0')} de ${año} ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

                /*Anexar los datos*/
                let freshdata = {
                    id: id,
                    profileURL: profileURL,
                    UserName: UserName,
                    UserLastName: UserLastName,
                    content: content,
                    dateTime: dateTime,
                    selfmsg: selfmsg
                }
                messagesList.push(freshdata)
            }
        });
    });
}

/*----- Plantillas de Vue -----*/
Vue.component('message-card', {
    props: ['data'],
    template: `
        <div :class="['message', { 'self-msg': data.selfmsg }]">
            <div class="message__left-section">
                <div class="avatar">
                    <img src="{{ data.profileURL }}">
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
        messages: [],
        chatList: [],
        maxWidthToShowElement: 799
    },
    methods: {
        handleResize() {
            this.$forceUpdate();
        },
        enviarMensaje() {
            const message = this.$refs.mensajeInput.value;
            sendMessage(message);
        }
    },
    created() {
        createMessages(this.messages)
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
});