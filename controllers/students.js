const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllStudents = async (req, res) => {
    try {
        const students = await mongodb.getDatabase().db().collection('students').find().toArray();
        res.setHeader('Content-Type', 'application/json');
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
        const student = await mongodb.getDatabase().db().collection('students').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve student.' });
    }
};

const createStudent = async (req, res) => {
    const student = req.body;

    if (!student.firstName || !student.lastName || !student.email) {
        return res.status(400).json({
            error: 'firstName, lastName, and email are required.'
        });
    }

    try {
        const result = await mongodb.getDatabase().db().collection('students').insertOne(student);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Unable to create student.' });
    }
};

module.exports = {
    getAllStudents,
    getSingleStudent,
    createStudent
};