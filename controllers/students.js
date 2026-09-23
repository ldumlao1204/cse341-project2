const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const studentsCollection = () => mongodb.getDatabase().db().collection('students');

const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getAllStudents = async (req, res) => {
    try {
        const students = await studentsCollection().find().toArray();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve students.' });
    }
};

const getSingleStudent = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid student ID.' });
    }

    try {
        const student = await studentsCollection().findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve student.' });
    }
};

const createStudent = async (req, res) => {
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        section: req.body.section
    };

    if (!student.firstName || !student.lastName || !student.email) {
        return res.status(400).json({
            error: 'firstName, lastName, and email are required.'
        });
    }

    if (!isValidEmail(student.email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    try {
        const result = await studentsCollection().insertOne(student);
        res.status(201).json({
            message: 'Student created successfully.',
            studentId: result.insertedId
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'A student with that email already exists.' });
        }
        res.status(500).json({ error: 'Unable to create student.' });
    }
};

const updateStudent = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const updates = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        section: req.body.section
    };

    Object.keys(updates).forEach((key) => {
        if (updates[key] === undefined) {
            delete updates[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'At least one field is required to update.' });
    }

    if (updates.email !== undefined && !isValidEmail(updates.email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    try {
        const result = await studentsCollection().updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(204).send();
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'A student with that email already exists.' });
        }
        res.status(500).json({ error: 'Unable to update student.' });
    }
};

const deleteStudent = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid student ID.' });
    }

    try {
        const result = await studentsCollection().deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete student.' });
    }
};

module.exports = {
    getAllStudents,
    getSingleStudent,
    createStudent,
    updateStudent,
    deleteStudent
};
