// Select DOM Items

// const { render } = require("../../app");

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
// const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const etusivunappi = document.getElementById('etusivu');

// Http requests for rendering wall-page and the creation of a post
let xhr_index = new XMLHttpRequest();
let xhr_createpost = new XMLHttpRequest();
let xhr_loadPosts = new XMLHttpRequest();
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

xhr_loadPosts.onload = function () {
    if (xhr_loadPosts.status == 200) {
        // var postlist = document.getElementById("posts");
        // console.log("kun nyt kerran olemme loadaamassa POSTIA: " + JSON.stringify(xhr_loadPosts.response));
        var newPosts = xhr_loadPosts.response.post_list;
        var oldPosts = document.getElementById("posts");
        console.log("pituudet uusi: " + newPosts.length + " ja vanha: " + oldPosts.children.length);

        // Update if there are more new posts
        if (newPosts.length != oldPosts.children.length) {
            for (let i = newPosts.length; i > oldPosts.children.length; i--) {
                console.log("iin arvolla " + i + " olemme nyt lisäämässä objektia " + JSON.stringify(newPosts[i - 1]));
                let newChild = document.createElement("div");
                newChild.classList.add("postBox");
                newChild.innerHTML = "<strong>" + newPosts[i - 1].author + "</strong>" + "<br>" + newPosts[i - 1].content;
                oldPosts.insertBefore(newChild, oldPosts.firstChild);
            }
        }
        xhr_loadPosts.open('GET', 'http://localhost:3000/wall');
        var payload = JSON.parse(getCookie('payload'));
        xhr_loadPosts.setRequestHeader('Authorization', "Token " + payload.token);
        xhr_loadPosts.responseType = 'json';
        xhr_loadPosts.setRequestHeader('Accept', 'application/json');
        xhr_loadPosts.withCredentials = true;
        window.setTimeout(function () { xhr_loadPosts.send() }, 2000);
    }

}

xhr_createpost.onload = function () {
    console.log("onko meillä postia?");
    console.log("xhr_createPost.status = " + xhr_createpost.status);
    console.log(JSON.stringify(xhr_createpost.response));
    if (xhr_createpost.status == 200) {
        console.log("createn response saatu ja siinä on postilista Laitetaan indexipyyntö jsonille postien päivittämiseksi.");
        // let xhr_loadPosts = new XMLHttpRequest();
        xhr_loadPosts.open("GET", "http://localhost:3000/wall");
        var payload = JSON.parse(getCookie('payload'));
        xhr_loadPosts.setRequestHeader('Authorization', "Token " + payload.token);
        xhr_loadPosts.responseType = 'json';
        xhr_loadPosts.setRequestHeader('Accept', 'application/json');
        xhr_loadPosts.withCredentials = true;
        xhr_loadPosts.send();
    }
}

xhr_index.onload = function () {
    if (xhr_index.status == 200) {
        console.log("response saatu");
        console.log(JSON.stringify(xhr_index.response));
        document.write(xhr_index.response);
        // window.location.assign('wall'); ei toimi koska authorization..
    }
}

function toWall() {
    console.log("kaikki keksit: " + document.cookie);
    console.log("pelkkä keksi: " + getCookie('payload'));
    var payload = JSON.parse(getCookie('payload'));
    console.log("payload.token: " + payload.token);
    xhr_index.open('GET', 'http://localhost:3000/wall');
    xhr_index.setRequestHeader('Authorization', "Token " + payload.token);
    xhr_index.withCredentials = true;
    xhr_index.send();
}

function createPost() {
    console.log("tehdäänpä postia");

    // Reading data from form "content"
    const postString = document.getElementById("textBox").value;
    xhr_createpost.open("POST", "http://localhost:3000/wall/createPost");
    var payload = JSON.parse(getCookie('payload'));
    // headers.append('Authorization', "Token " + payload.token);
    xhr_createpost.setRequestHeader('Authorization', "Token " + payload.token);
    xhr_createpost.setRequestHeader("content", postString);
    xhr_createpost.withCredentials = true;
    xhr_createpost.send();
}
