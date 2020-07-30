// Select DOM Items

// const { render } = require("../../app");

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
// const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const etusivunappi = document.getElementById('etusivu');

let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/wall');

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

etusivunappi.addEventListener('click', toWall);

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

function toWall() {
    console.log("kaikki keksit: " + document.cookie);
    console.log("pelkkä keksi: " + getCookie('payload'));
    var payload = JSON.parse(getCookie('payload'));
    console.log("payload.token: " + payload.token);
    xhr.setRequestHeader('Authorization', "Token " + payload.token);

    xhr.withCredentials = true;
    xhr.send();
    // let url = 'wall';

    // let headers = new Headers();

    // //headers.append('Content-Type', 'text/json');
    // headers.append('Authorization', 'Token ' + payload.token);

    // fetch(url, {
    //     method: 'GET',
    //     headers: headers,
    //     credentials: 'include',
    //     redirect: 'follow'
    // })
    // .then(response => response.json());
    // .then(json => console.log(json));
    // .done();

    // function parseJSON(response) {
    //     return response.json()
    // }
}

xhr.onload = function () {
    console.log("response saatu");
    console.log(JSON.stringify(xhr.response));
    document.write(xhr.response);
    // window.location.assign('wall'); ei toimi koska authorization..
}
