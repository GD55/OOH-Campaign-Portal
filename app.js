// server.js
// set up ======================================================================
// get all the tools we need
var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    multer = require('multer'),
    app = express(),
    passport = require('passport'),
    flash = require('connect-flash'),
    methodOverride = require("method-override"),
    mysql = require('mysql');

require('dotenv').config({ path: __dirname + '/.env' });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage });

// var dbconfig = require('./database');
var con = mysql.createPool({
    host: process.env.DATABASEHost,
    user: process.env.DATABASEUser,
    password: process.env.DATABASEPassword,
    database: process.env.DATABASEName
});


// configuration ===============================================================
// connect to our database

require('./config/passport')(passport, con); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: process.env.SessonSecret,
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport, con, upload); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(process.env.PORT);
console.log('The magic happens on port ' + process.env.PORT);