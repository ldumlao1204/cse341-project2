const router = require('express').Router(); // handle routing for the /students endpoint

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Welcome to the Student API!'];
    res.send((`Welcome to the Student API!`));
});

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));


module.exports = router;