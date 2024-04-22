import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
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

// Enviar mensaje a Firestore
async function sendMessage(message) {
    if (message.trim() === "") return;
    try {
        await addDoc(collection(db, "mensajes"), {
            texto: message,
            timestamp: serverTimestamp()
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

// Escuchar nuevos mensajes desde Firestore
const messagesQuery = query(collection(db, "mensajes"), orderBy("timestamp"));
onSnapshot(messagesQuery, (snapshot) => {
    const messagesContainer = document.getElementById('mensajes');
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const messageData = change.doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = messageData.texto;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
    // Limpiar el chat
    document.getElementById('limpiarChat').addEventListener('click', function () {
        document.getElementById('mensajes').innerHTML = '';
    })
});  