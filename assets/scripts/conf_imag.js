import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Configuración del proyecto en Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVSG-i1dkjcWvZgXLJ3Ahp_q6ye-WAhfo",
    authDomain: "heart-7d6b1.firebaseapp.com",
    projectId: "heart-7d6b1",
    storageBucket: "heart-7d6b1.appspot.com",
    messagingSenderId: "721295981788",
    appId: "1:721295981788:web:90cf47cb71c37d61da4819",
    measurementId: "G-SNJQ16Z23B"

};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const anime_imagesjson = [
    { "id": 1, "direccion": "https://i.pinimg.com/564x/44/00/8c/44008cfa1059f44763077c0c8f996dfe.jpg" },
    { "id": 2, "direccion": "https://i.pinimg.com/564x/ba/b7/d5/bab7d5608106c32bec7b9f05243c9ac6.jpg" },
    { "id": 3, "direccion": "https://i.pinimg.com/564x/7e/6c/33/7e6c3323abdcb862d7be02ae6ca34b53.jpg" },
    { "id": 4, "direccion": "https://i.pinimg.com/564x/aa/13/1f/aa131fb5e3608ab786ff99cd29164257.jpg" },
    { "id": 5, "direccion": "https://i.pinimg.com/564x/e4/1c/8d/e41c8d3639ced06624dc1bd90d0e3024.jpg" },
    { "id": 6, "direccion": "https://i.pinimg.com/564x/15/b8/1d/15b81db88dedfb31ad94a0f7411a871f.jpg" },
    { "id": 7, "direccion": "https://i.pinimg.com/564x/a5/6b/cb/a56bcb9dda749e06db2ea3fc27bc71df.jpg" },
    { "id": 8, "direccion": "https://i.pinimg.com/564x/a5/42/82/a54282563f8bf2529bb27db50e02a163.jpg" },
    { "id": 9, "direccion": "https://i.pinimg.com/564x/c0/41/dd/c041ddf374735eedefb4d88a1793ef60.jpg" },
    { "id": 10, "direccion": "https://i.pinimg.com/564x/66/3e/5b/663e5bb4203f2fe974dfa81ca7b89e2a.jpg" },
    { "id": 11, "direccion": "https://i.pinimg.com/564x/80/70/ee/8070eef4af5500a9d0cc3c831810f2ac.jpg" },
    { "id": 12, "direccion": "https://i.pinimg.com/564x/b3/fc/7c/b3fc7ce60530f326a06b0750c635250e.jpg" },
    { "id": 13, "direccion": "https://i.pinimg.com/564x/c8/08/b2/c808b24ab9afa7e4c6bb9244f399b6e1.jpg" },
    { "id": 14, "direccion": "https://i.pinimg.com/564x/1d/40/ad/1d40ad02b31626a43746f1b845725b9a.jpg" },
    { "id": 15, "direccion": "https://i.pinimg.com/564x/cd/e3/80/cde380dd359f95de040480fe86692808.jpg" },
    { "id": 16, "direccion": "https://i.pinimg.com/564x/f8/97/57/f897576a69e79e847906c683038e388a.jpg" },
    { "id": 17, "direccion": "https://i.pinimg.com/564x/0c/2f/b1/0c2fb1f0b4ce55f47b9a6d684a832cf3.jpg" },
    { "id": 18, "direccion": "https://i.pinimg.com/564x/70/b2/fe/70b2fe967f3faaab50c04c7ff6e1a4d5.jpg" },
    { "id": 19, "direccion": "https://i.pinimg.com/564x/5e/14/29/5e14294a48b114d4e1556010cb24ee01.jpg" },
    { "id": 20, "direccion": "https://i.pinimg.com/564x/a3/5d/91/a35d914be00111ac9a4b72fe2a4f3a8f.jpg" },
    { "id": 21, "direccion": "https://i.pinimg.com/564x/df/4d/18/df4d18243c607de4dd826ebc551ebe62.jpg" },
    { "id": 22, "direccion": "https://i.pinimg.com/564x/51/5f/d0/515fd0590867fff4da8771e7efa1254a.jpg" },
    { "id": 23, "direccion": "https://i.pinimg.com/564x/45/58/f1/4558f1c406a1b89052aa0ecc9ca6d36c.jpg" },
    { "id": 24, "direccion": "https://i.pinimg.com/564x/02/b6/3b/02b63b909aea1e74164fe4168b7bdf4c.jpg" },
    { "id": 25, "direccion": "https://i.pinimg.com/564x/f2/85/84/f28584eeaa9b133ec2bd81e879e4b1f3.jpg" },
    { "id": 26, "direccion": "https://i.pinimg.com/564x/b7/eb/9e/b7eb9ea507e9a73953cbcbac8e428457.jpg" },
    { "id": 27, "direccion": "https://i.pinimg.com/564x/54/97/8c/54978cc0313c182fe0cff769311ab549.jpg" },
    { "id": 28, "direccion": "https://i.pinimg.com/564x/d2/d7/95/d2d7951c38d35ca2fdaba4207f226bf4.jpg" },
    { "id": 29, "direccion": "https://i.pinimg.com/564x/9a/d1/e3/9ad1e30e6103c3c6d300dd8b813984ed.jpg" },
    { "id": 30, "direccion": "https://i.pinimg.com/564x/86/07/71/860771294647df6c320d3f0f44efe0ca.jpg" }
];
// Función para mostrar las imágenes en la página
function displayImages(selectedImageId) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; 
    anime_imagesjson.forEach(image => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-item');

        const imageElement = document.createElement('img');
        imageElement.src = image.direccion;
        imageElement.dataset.id = image.id;
        imageElement.classList.add('selectable-image');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'selectedImage';
        radioButton.value = image.id; 

        if (image.id == selectedImageId) {
            radioButton.checked = true;
            imageElement.classList.add('selected');
        }

        imageDiv.appendChild(imageElement);
        imageDiv.appendChild(radioButton);
        imageContainer.appendChild(imageDiv);

        imageElement.addEventListener('click', () => {
            radioButton.checked = true;
            document.querySelectorAll('.selectable-image').forEach(img => {
                img.classList.remove('selected');
            });
            imageElement.classList.add('selected');
        });
    });
}

// Llamar a la función para mostrar las imágenes cuando se carga la página
window.onload = function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const selectedImageId = userDoc.data().selectedImage;
                displayImages(selectedImageId);
            } else {
                displayImages(null);
            }
        } else {
            displayImages(null);
        }
    });
}

// Función para manejar la selección de imagen
window.chooseImage = async function chooseImage(event) {
    event.preventDefault();  

    const selectedImage = document.querySelector('input[name="selectedImage"]:checked');
    if (!selectedImage) {
        alert('Por favor selecciona una imagen.');
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid; // Obtener el ID del usuario actual
            try {
                await setDoc(doc(db, "users", userId), {
                    selectedImage: selectedImage.value
                }, { merge: true });

                // Actualizar la imagen mostrada
                const selectedImageElement = anime_imagesjson.find(img => img.id == selectedImage.value);
                if (selectedImageElement) {
                    document.querySelector('#selectedImage').src = selectedImageElement.direccion;
                } else {
                    console.error('No se encontró la imagen seleccionada en anime_imagesjson');
                }

                alert('Imagen de perfil guardada correctamente.');
            } catch (error) {
                console.error('Error al guardar la imagen:', error);
                alert('Error al guardar la imagen: ' + error.message);
            }
        }
    });
}
