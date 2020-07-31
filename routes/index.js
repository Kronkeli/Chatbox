const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const Users = mongoose.model('Users');
const session = require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'ChatBox' });
});

/* GET create account form. */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: "Create account" });
});

//POST create new user route (optional, everyone has access)
router.post('/signup', auth.optional, (req, res, next) => {

  var name = req.body.username;
  var password1 = req.body.password1;
  var password2 = req.body.password2;

  // Validation 

  const user = { username: req.body.username, password: req.body.password1 };
  console.log(req.body);

  if (password1 !== password2) {
    return res.status(422).json({
      errors: {
        password: 'Passwords do not match',
      },
    });
  }

  else if (password1.length < 8) {
    return res.status(422).json({
      errors: {
        password: 'is too short',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const user = req.body;

  if (!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  // return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
  return passport.authenticate('local', (err, passportUser, info) => {
    if (err) {
      console.log("error passport.authenticatessa!");
      return next(err);
    }

    if (passportUser) {
      console.log("passport.auhtenticoitu!");
      const user = passportUser;
      user.token = passportUser.generateJWT();
      // Set cookies
      // console.log("userobjekt : " + user);
      // console.log("userJSON : " + JSON.stringify({ "_id": user._id, "username": user.username, "token": user.token }));
      var userString = JSON.stringify({ "_id": user._id, "username": user.username, "token": user.token });
      res.cookie('payload', userString);
      // console.log("coocies laitettu: " + req.cookies);
      // console.log("token on: " + userString);
      return res.render('main', { "title": "main", "user": user.username });
      // return res.json({ user: user.toAuthJSON() });
    }

    console.log("elsessä eikä useria tunnisteta ja user on joku " + JSON.stringify(info));
    // return status(400).info;
    // return res.sendStatus(400).info;

    return res.redirect("/");
  })(req, res, next)
});

// //GET current route (required, only authenticated users have access)
// router.get('/wall', auth.required, (req, res, next) => {
//   const { payload: { id } } = req;

//   console.log("idenä toimii: " + id);
//   return Users.findById(id).then((user) => {
//     if (!user) {
//       console.log("/wallissa id:llä ei useria löytynyt");
//       return res.sendStatus(400);
//     }
//     console.log("/wallissa user löytynyt");
//     return res.json({ user: user.toAuthJSON() });
//   })
// });

module.exports = router;