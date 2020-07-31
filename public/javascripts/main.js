// Select DOM Items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
// const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const etusivunappi = document.getElementById('etusivu');
const ownWallBtn = document.getElementById('ownWall');

// Http requests for rendering wall-page and the creation of a post
let xhr_index = new XMLHttpRequest();
let xhr_ownWall = new XMLHttpRequest();
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
ownWallBtn.addEventListener('click', toOwnWall);

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
        var newPosts = xhr_loadPosts.response.post_list;
        var oldPosts = document.getElementById("posts");

        // Update if there are more new posts
        if (newPosts.length != oldPosts.children.length) {
            for (let i = newPosts.length; i > oldPosts.children.length; i--) {
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
    if (xhr_createpost.status == 200) {
        console.log("createn response OK");
    }
}

xhr_index.onload = function () {
    if (xhr_index.status == 200) {
        console.log("response saatu");
        document.write(xhr_index.response);
        xhr_loadPosts.open("GET", "http://localhost:3000/wall");
        var payload = JSON.parse(getCookie('payload'));
        xhr_loadPosts.setRequestHeader('Authorization', "Token " + payload.token);
        xhr_loadPosts.responseType = 'json';
        xhr_loadPosts.setRequestHeader('Accept', 'application/json');
        xhr_loadPosts.withCredentials = true;
        xhr_loadPosts.send();
    }
}
xhr_ownWall.onload = function () {
    if (xhr_ownWall.status == 200) {
        console.log("own wall response saatu");
        document.write(xhr_ownWall.response);
    }
}

function toWall() {
    var payload = JSON.parse(getCookie('payload'));
    xhr_index.open('GET', 'http://localhost:3000/wall');
    xhr_index.setRequestHeader('Authorization', "Token " + payload.token);
    xhr_index.withCredentials = true;
    xhr_index.send();
}

function toOwnWall() {
    var payload = JSON.parse(getCookie('payload'));
    xhr_ownWall.open('GET', 'http://localhost:3000/wall/ownWall');
    xhr_ownWall.setRequestHeader('Authorization', "Token " + payload.token);
    xhr_ownWall.withCredentials = true;
    xhr_ownWall.send();
}

function createPost() {
    console.log("tehdäänpä postia");

    // Reading data from form "content"
    var postString = document.getElementById("textBox").value;
    postString = postString.replace(/(\r\n|\n|\r)/gm, " ");
    xhr_createpost.open("POST", "http://localhost:3000/wall/createPost");
    var payload = JSON.parse(getCookie('payload'));
    var author = payload.username;

    // Lisätään posti lokaalisti
    var postList = document.getElementById('posts');
    let newChild = document.createElement("div");
    newChild.classList.add("postBox");
    newChild.innerHTML = "<strong>" + author + "</strong>" + "<br>" + postString;
    postList.insertBefore(newChild, postList.firstChild);

    xhr_createpost.setRequestHeader('Authorization', "Token " + payload.token);
    xhr_createpost.setRequestHeader("content", postString);
    xhr_createpost.withCredentials = true;
    xhr_createpost.send();
}
