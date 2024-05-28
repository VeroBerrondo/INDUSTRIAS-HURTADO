function nextPanel() {
    var appWrapper_One = document.getElementsByClassName("formulario-caja")[0];
    var appWrapper_Two = document.getElementsByClassName("formulario-caja2")[0];

    // Obtener todos los campos del primer formulario
    var name = document.getElementById("name").value.trim();
    var lastname = document.getElementById("lastname").value.trim();
    var nameUser= document.getElementById ("nameUser"). value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();

    // Validar que todos los campos estén llenos
    if (!name || !lastname|| !nameUser || !email || !password) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Validación adicional del email (opcional)
    if (!email.includes("@") || !email.includes(".")) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return;
    }

    // Validación adicional de la contraseña (opcional)
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    // Cambiar de panel
    appWrapper_One.classList.remove("visible");
    appWrapper_Two.classList.add("visible");
}

function TogglePassword() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") { passwordField.type = "text" } else {
        passwordField.type = "password";
    }
}
