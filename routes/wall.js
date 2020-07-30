const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Users = mongoose.model('Users');
const session = require('express-session');

var post_controller = require("../controllers/postController");
const { json } = require('body-parser');

//GET current route (required, only authenticated users have access)
router.get('/', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    console.log("idenä toimii: " + id);
    return Users.findById(id).then((user) => {
        if (!user) {
            console.log("/wallissa id:llä ei useria löytynyt");
            return res.sendStatus(400);
        }
        console.log("/wallissa user löytynyt");
        // return res.json({ user: user.toAuthJSON() });
        console.log({ user: user.toAuthJSON() });
        // return res.render('wall', { "title": "The Wall", "msg": "" });
        return post_controller.index(req, res, next).then((res) => {
            console.log("mitä vittua index: " + res);
        });
    });
});

// {auth.required}
router.post('/createPost', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    console.log("createpost id: " + id);

    return Users.findById(id).then((user) => {
        if (!user) {
            console.log("createPostissa id:llä ei useria löytynyt");
            return res.sendStatus(400);
        }
        console.log("createssa used löytynyt: " + user.toAuthJSON);
        return post_controller.createPost(req, res, next).then((res) => {
            console.log("mitä vittua createPost: " + res);
        });
    });
});

module.exports = router;