function show_miniChat () {
    var appWrapper = document.getElementsByClassName("app__wrapper")[0];
    var state = appWrapper.classList.contains("chat-active");
    if (state == false) {
        appWrapper.classList.add('chat-active');
    } else {
        appWrapper.classList.remove('chat-active');
    }
}

function sidePanel_toggle (button_caller) {
    var wrapper = document.getElementsByClassName("current-msg__wrapper")[0];
    var state = wrapper.classList.contains("panel-visible");
    var buttonState = button_caller.classList.contains("current");
    if (state == false) {
        wrapper.classList.add('panel-visible');
    } else {
        wrapper.classList.remove('panel-visible');
    }
    if (buttonState == false) {
        button_caller.classList.add("current");
    } else {
        button_caller.classList.remove("current");
    }
}

function sideMenu_toggle () {
    var wrapper = document.getElementsByClassName("nav-bar_mobile__wrapper")[0];
    var state = wrapper.classList.contains("menu-visible");
    if (state == false) {
        wrapper.classList.add('menu-visible');
    } else {
        wrapper.classList.remove('menu-visible');
    }
}

/*----- -----*/
function currentChat_toggle() {
    var wrapper = document.getElementsByClassName("app__wrapper")[0];
    var state = wrapper.classList.contains("chat-visible");
    var sidePanelWrapper = document.getElementsByClassName("current-msg__wrapper")[0];
    var sidePanelStatus = sidePanelWrapper.classList.contains("panel-visible")
    if (state == false) {
        wrapper.classList.add("chat-visible");
    } else {
        wrapper.classList.remove("chat-visible");
        if (sidePanelStatus == true) {
            sidePanelWrapper.classList.remove('panel-visible');
            document.getElementsByName('sidePanel_btn')[0].classList.remove("current");
        }
    }
}
