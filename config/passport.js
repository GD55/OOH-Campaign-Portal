// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

// expose this function to our app using module.exports
module.exports = function(passport,con) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        con.query("SELECT * FROM `user` WHERE id = ? ", [id], function(err, rows) {
            done(err, rows[0]);
        });
    });

    con.on('error', function(err) {
        console.log("[mysql error]", err);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we can override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                var designation = req.body.designation.toLowerCase();
                var office_id = req.body.officeId;
                var email = req.body.email.toLowerCase();
                var phone_no = req.body.number;
                // find a user whose username is the same as the forms username
                con.query("SELECT * FROM `user` WHERE name = ?", [username], function(err, rows) {
                    if (err)
                        return done(err);
                    // we are checking to see if the user trying to login already exists
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username.toLowerCase(),
                            password: bcrypt.hashSync(password, 10, null) // use the generateHash function in our user model
                        };
                        var insertQuery = "INSERT INTO user ( name, password, designation, office_id, email, phone_no ) values (?,?,?,?,?,?)";
                        con.query(insertQuery, [newUserMysql.username, newUserMysql.password, designation, office_id, email, phone_no], function(err, rows) {
                            if (err) {
                                console.log(err);
                            }
                            newUserMysql.id = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we can override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with username and password from our form
                con.query("SELECT * FROM `user` WHERE name = ?", [username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};