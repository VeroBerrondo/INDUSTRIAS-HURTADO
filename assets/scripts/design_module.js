function show_miniChat () {
    var appWrapper = document.getElementsByClassName("app__wrapper")[0];
    var state = appWrapper.classList.contains("chat-active");
    if (state == false) {
        appWrapper.classList.add('chat-active');
    } else {
        appWrapper.classList.remove('chat-active');
    }
}