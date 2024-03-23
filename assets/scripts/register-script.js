function nextPanel () {
    var appWrapper_One = document.getElementsByClassName("formulario-caja")[0];
    var appWrapper_Two = document.getElementsByClassName("formulario-caja2")[0];

    /*OneStatus = appWrapper_One.classList.contains("visible");
    TwoStatus = appWrapper_Two.classList.contains("visible");*/
    appWrapper_One.classList.remove("visible");
    appWrapper_Two.classList.add("visible");
}