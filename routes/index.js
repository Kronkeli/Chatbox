var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'ChatBox' });
});

/* POST request for login confirmation */
router.post('/login', function (req, res, next) {
  res.redirect('/main');
});

module.exports = router;
