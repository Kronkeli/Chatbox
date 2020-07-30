var Post = require("../models/Post");

// For sanitizing user written content
const { sanitizeBody } = require('express-validator');
const { decode } = require("jsonwebtoken");

// For handling user sent cookies
function getCookie(cname, decodedCookie) {
    var name = cname + "=";
    // var decodedCookie = decodeURIComponent(document.cookie);
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

exports.index = function (req, res, next) {
    return Post.find({}).then((list_posts) => {
        if (!list_posts) {
            console.log("Postilistaa ei löydy");
            next(err);
        } else {
            // console.log("postilista löytynyt ja se on: " + list_posts);
            // Jos lista on tyhjä, erikoistapaus
            if (list_posts.length === 0) {
                return res.render('wall', { title: "The Wall", post_list: list_posts });
            }
            else {
                // console.log("formina toimii: " + res.format);
                res.format({
                    'text/html': function () {
                        console.log("FORM: text/html");
                        return res.render('wall', { title: "The wall", post_list: list_posts });
                    },
                    'json': function () {
                        console.log("FORM: json");
                        return res.json({ post_list: list_posts });
                    },
                    'default': function () {
                        console.log("FORM: default");
                        // log the request and respond with 406
                        return res.status(406).send('Not Acceptable');
                    }

                });
            }
        }
    });
};

exports.createPost = function (req, res, next) {
    // Username from clients cookies
    decodedCookie = req.headers.cookie;
    // decodedCookie = decodedURLComponent(req.headers.cookie);
    var username = JSON.parse(req.cookies.payload).username;
    sanitizeBody('*').trim().escape();
    console.log("uusi post{ author: " + username + " ja content: " + req.headers.content + "}");

    // Create a new Post and save it to database
    var post = new Post({
        author: username,
        content: req.headers.content
    });
    post.save(function (err) {
        if (err) {
            console.log("postia ei tallennettu");
            return next(err);
        }
        else {
            // Successful - redirect to new book record.
            // res.redirect('/posts');  
            console.log("tallennus onnistui");
            // return next(res.status(200).send("Post Saved"));
            res.status(200).send("Post Saved");
        }
    });
};