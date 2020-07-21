var express = require('express');
var router = express.Router();

/* GET create account form. */
router.get('/', function (req, res, next) {
    res.render('signup', { title: "Create account" });
});

/* POST request to creating a new account */
router.post('/createAccount', function (req, res, next) {
    res.send('create account, name: ' + req.body.username + ' and password: ' + req.body.password);
});

module.exports = router;
