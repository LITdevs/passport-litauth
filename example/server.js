var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('../lib').Strategy
  , app      = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', 'email'];

passport.use(new Strategy({
    clientID: '123',
    clientSecret: '123',
    callbackURL: 'http://localhost:5000/callback',
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', passport.authenticate('litauth', { scope: scopes }), function(req, res) {});
app.get('/callback',
    passport.authenticate('litauth', { failureRedirect: '/' }), function(req, res) { res.redirect('/info') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}


app.listen(5000, function (err) {
    if (err) return console.log(err)
    console.log('Listening at http://localhost:5000/')
})