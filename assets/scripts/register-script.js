
document.getElementById('btn').addEventListener('click', function () {
    let name = document.getElementById('name').value;
    let lastname = document.getElementById('lastname').value;
    let nameUser = document.getElementById('nameUser').value;
    let birthdate = document.getElementById('birthdate').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (!name || !lastname || !nameUser || !birthdate || !email || !password) {
        alert('Por favor, complete todos los campos.');
    } else {
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('preferencesForm').style.display = 'block';
    }
});
function nextPanel() {
    var appWrapper_One = document.getElementsByClassName("formulario-caja")[0];
    var appWrapper_Two = document.getElementsByClassName("formulario-caja2")[0];

    /*OneStatus = appWrapper_One.classList.contains("visible");
    TwoStatus = appWrapper_Two.classList.contains("visible");*/
    appWrapper_One.classList.remove("visible");
    appWrapper_Two.classList.add("visible");
}
function TogglePassword() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") { passwordField.type = "text" } else {
        passwordField.type = "password";
    }
}
