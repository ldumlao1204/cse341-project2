require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))

// This is the basic express session({..}) initialization.
app.use(passport.initialize());
// init passport on every route call.
app.use(passport.session());
// allow passport to use "express-session".
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS, DELETE');
    next();
})
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}))
app.use(cors({ origin: '*' }))
app.use('/', require('./routes/index.js'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        //User.findCreate({ githubId: profile.id }, function (err, user) {
        return done(null, profile);
        //};
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
})

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => { console.log(`Database is listening and node is Running on port ${port}`) });
    }
});
