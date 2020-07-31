const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Users = mongoose.model('Users');
const session = require('express-session');

var post_controller = require("../controllers/postController");
const { json } = require('body-parser');

//GET wall route (required, only authenticated users have access)
router.get('/', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id).then((user) => {
        if (!user) {
            console.log("/wallissa id:llä ei useria löytynyt");
            return res.sendStatus(400);
        }
        post_controller.index(req, res, next);
    });
});

//GET own wall (required, only authenticated users have access)
router.get('/ownWall', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id).then((user) => {
        if (!user) {
            console.log("/ownWallissa id:llä ei useria löytynyt");
            return res.sendStatus(400);
        }
        post_controller.ownWall(req, res, next);
    });
});

//POST createPost route (required, only authenticated users have access)
router.post('/createPost', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id).then((user) => {
        if (!user) {
            console.log("createPostissa id:llä ei useria löytynyt");
            return res.sendStatus(400);
        }
        post_controller.createPost(req, res, next);
    });
});

module.exports = router;