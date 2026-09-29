const router = require('express').Router(); // handle routing for the /students endpoint
const passport = require('passport');

router.use('/', require('./swagger'));

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;