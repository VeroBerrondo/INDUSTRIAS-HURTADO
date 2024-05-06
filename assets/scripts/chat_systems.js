import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Configuración de Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

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
            const messageWrapper = document.createElement('div');
            const messageLabel = document.createElement('p');
            const messageDateTime = document.createElement('span');
            const messageUser = document.createElement('span');

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

            messageWrapper.classList.add("message");
            messageLabel.textContent = messageData.content;
            messageUser.textContent = messageData.user;
            messageDateTime.textContent = `${getMonthName(mes)} ${dia.toString().padStart(2, '0')} de ${año} ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
            messagesContainer.appendChild(messageWrapper);
            messageWrapper.appendChild(messageUser);
            messageWrapper.appendChild(messageLabel);
            messageWrapper.appendChild(messageDateTime);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
    // Limpiar el chat
    document.getElementById('limpiarChat').addEventListener('click', function () {
        document.getElementById('mensajes').innerHTML = '';
    })
});