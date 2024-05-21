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

// Enviar mensaje a Firestore
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

// botón enviar
document.getElementById('enviarBtn').addEventListener('click', () => {
    const message = document.getElementById('mensajeInput').value;
    sendMessage(message);
});

// tecla Enter
document.getElementById('mensajeInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage(event.target.value);
    }
});

// Aux para fechas
function getMonthName(mes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes - 1];
}

// Escuchar nuevos mensajes desde Firestore
const messagesQuery = query(collection(db, "mensajes"), orderBy("timestamp"));

onSnapshot(messagesQuery, (snapshot) => {
    const messagesContainer = document.getElementById('mensajes');
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const messageData = change.doc.data();

            const messageWrapper = document.createElement('div'); //Envoltorio de todo el mensaje
            const messageLeftWrapper = document.createElement('div'); //Envoltorio izquierdo
            const messageRightWrapper = document.createElement('div');
            const messageLabel = document.createElement('p'); //Contenido del mensaje
            const messageDateTime = document.createElement('span'); //Hora del mensaje
            const messageUser = document.createElement('span');//Usuario del mensaje
            const messageImageWrapper = document.createElement('div');//Envoltorio de imagen
            const messageImage = document.createElement('img');//imagen

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

            messageLeftWrapper.classList.add("message__left-section");
            messageRightWrapper.classList.add("message__right-section");
            messageWrapper.classList.add("message");
            
            try {
                if (messageData.user == auth.currentUser.uid) {
                    messageWrapper.classList.add("self-msg");
                }
            } catch {
                console.log("error al identificar el auth.currentUser")
            }

            messageImageWrapper.classList.add("avatar");
            messageLabel.classList.add("content");
            messageUser.classList.add("user");
            messageDateTime.classList.add("time");

            messageLabel.innerHTML = messageData.content;
            
            getUserData(messageData.user).then((userData) => {
                messageUser.textContent = userData.usuario;
                if (userData.profile) {
                    messageImage.src = userData.profile;
                } else {
                    messageImage.src = "http://cache0.bigcartel.com/product_images/45752467/envelope.jpg"
                }
            }).catch((error) => {
                // Manejo de errores si getUserData() falla
                console.error(error);
            });

            messageDateTime.textContent = `${getMonthName(mes)} ${dia.toString().padStart(2, '0')} de ${año} ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            
            messagesContainer.appendChild(messageWrapper);
            messageWrapper.appendChild(messageLeftWrapper);
            messageWrapper.appendChild(messageRightWrapper)

            messageLeftWrapper.appendChild(messageImageWrapper);
            messageImageWrapper.appendChild(messageImage);
            messageRightWrapper.appendChild(messageUser);
            messageRightWrapper.appendChild(messageLabel);
            messageRightWrapper.appendChild(messageDateTime);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
    // Limpiar el chat
    document.getElementById('limpiarChat').addEventListener('click', function () {
        document.getElementById('mensajes').innerHTML = '';
    })
});