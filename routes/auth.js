const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
    console.log("onko authorization:  " + authorization);
    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

// Guess NOT TO DO
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
const getTokenFromCookies = (req) => {
    const payload = req.cookies;
    var authorization = getCookie('payload');
    console.log(authorization);
}

const auth = {
    required: jwt({
        secret: 'chatbox',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256']
    }),
    optional: jwt({
        secret: 'chatbox',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
        algorithms: ['HS256']
    }),
};

module.exports = auth;