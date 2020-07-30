const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local')

const Users = mongoose.model('Users');

// passport.use(new LocalStrategy({
//     usernameField: 'user[username]',
//     passwordField: 'user[password]',
// }, (username, password, done) => {
//     console.log("toteutetaan haku nimellä: " + username);
//     Users.findOne({ username })
//         .then((user) => {
//             if (!user || !user.validatePassword(password)) {
//                 console.log("useri hukattu locaalissa strategiassa!");
//                 return done(null, false, { errors: { 'username or password': 'is invalid' } });
//             }

//             return done(null, user);
//         }).catch(done);
// }));

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log("toteutetaan haku nimellä: " + username);
        Users.findOne({ username }).then((user) => {
            if (!user || !user.validatePassword(password)) {
                console.log("useri hukattu locaalissa strategiassa!");
                return done(null, false, { errors: { 'username orpassword': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});