const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/courses');

router.get('/', coursesController.getAllCourses);

router.get('/:id', coursesController.getSingleCourse);

router.post('/', coursesController.createCourse);

router.put('/:id', coursesController.updateCourse);

router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
