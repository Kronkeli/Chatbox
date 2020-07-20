var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'ChatBox' });
});

/* Handle login information */
router.post('/login', function (req, res, next) {
  res.render('index', { title: 'Logging in ' + req.body.author + ' with password ' + req.body.content + '!' });
});

module.exports = router;
