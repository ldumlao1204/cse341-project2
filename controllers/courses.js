const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const coursesCollection = () => mongodb.getDatabase().collection('courses');

// Checks the course data. Returns an error message, or null if everything is OK.
const validateCourse = (course) => {
    if (!course.courseCode || !course.courseName || !course.instructor || !course.semester) {
        return 'courseCode, courseName, instructor, and semester are required.';
    }
    if (typeof course.credits !== 'number' || course.credits < 1 || course.credits > 6) {
        return 'credits must be a number from 1 to 6.';
    }
    return null;
};

const getAllCourses = async (req, res) => {
    //#swagger.tags=['Courses']
    try {
        const courses = await coursesCollection().find().toArray();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve courses.' });
    }
};

const getSingleCourse = async (req, res) => {
    //#swagger.tags=['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid course ID.' });
    }

    try {
        const course = await coursesCollection().findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve course.' });
    }
};

const createCourse = async (req, res) => {
    //#swagger.tags=['Courses']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Course information to create',
        required: true,
        schema: { $ref: '#/definitions/Course' }
    } */
    const course = {
        courseCode: req.body.courseCode,
        courseName: req.body.courseName,
        instructor: req.body.instructor,
        credits: req.body.credits,
        semester: req.body.semester
    };

    const validationError = validateCourse(course);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const result = await coursesCollection().insertOne(course);
        res.status(201).json({
            message: 'Course created successfully.',
            courseId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Unable to create course.' });
    }
};

const updateCourse = async (req, res) => {
    //#swagger.tags=['Courses']
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated course information (all fields required)',
        required: true,
        schema: { $ref: '#/definitions/Course' }
    } */
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid course ID.' });
    }

    const course = {
        courseCode: req.body.courseCode,
        courseName: req.body.courseName,
        instructor: req.body.instructor,
        credits: req.body.credits,
        semester: req.body.semester
    };

    const validationError = validateCourse(course);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const result = await coursesCollection().replaceOne(
            { _id: new ObjectId(req.params.id) },
            course
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to update course.' });
    }
};

const deleteCourse = async (req, res) => {
    //#swagger.tags=['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid course ID.' });
    }

    try {
        const result = await coursesCollection().deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete course.' });
    }
};

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
};
