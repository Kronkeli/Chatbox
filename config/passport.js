const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local')

const Users = mongoose.model('Users');

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