const router = require('express').Router(); // handle routing for the /students endpoint

router.get('/', (req, res) => { res.send('Welcome to the Student API!'); });

router.use('/students', require('./students'));

module.exports = router;