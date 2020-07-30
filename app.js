var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var cors = require('cors');
const passport = require('passport');
var session = require('express-session');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

const app = express();

// Models
require('./models/Users');
require('./config/passport');

// Routes
var indexRouter = require('./routes/index');
var mainRouter = require('./routes/main');
var signupRouter = require('./routes/signup');
var wallRouter = require('./routes/wall');

// Set up database connection
var mongoURL = "mongodb://localhost:27017/chatbox";
mongoose.connect(mongoURL);
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(session({ secret: 'chatbox', cookie: { maxAge: 5 }, resave: false, saveUninitialized: false })); // vanha maxAge:60000

// JOS KEKSEILLÄ NIIN TÄSSÄ COOKIEHOMMIA
// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie('cookieName', randomNumber, { maxAge: 3, httpOnly: true }); // Vanha maxAge: 900000
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  }
  next(); // <-- important!
});

app.use(express.static(path.join(__dirname, 'public')));
// // let static middleware do its job
// app.use(express.static(__dirname + '/public'));

// Passport middleware JOS TÄYTYY ITSE KÄYNNISTÄÄ
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/main', mainRouter);
app.use('/signup', signupRouter);
app.use('/wall', wallRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
