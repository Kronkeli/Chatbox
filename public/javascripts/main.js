// Select DOM Items

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
// const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const etusivunappi = document.getElementById('etusivu');

let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/current');

// Set Initial State of Menu
let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (!showMenu) {
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        // menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        // Set Menu State
        showMenu = true;
    } else {
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        // menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));

        // Set Menu State
        showMenu = false;
    }
}

etusivunappi.addEventListener('click', toCurrent);

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toCurrent() {
    console.log("kaikki keksit: " + document.cookie);
    console.log("pelkkä keksi: " + getCookie('payload'));
    var payload = JSON.parse(getCookie('payload'));

    xhr.setRequestHeader('Authorization', "Token " + payload.token);
    xhr.withCredentials = true;
    xhr.send();
}

xhr.onload = function () {
    console.log("response saatu");
    window.location.assign('/');
}
