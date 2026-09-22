const getStudents = (req, res) => {
    res.status(200).json([]);
};

const createStudent = (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({
            error: 'firstName, lastName, and email are required.'
        });
    }

    res.status(201).json({
        message: 'Student received successfully.',
        student: {
            firstName,
            lastName,
            email
        }
    });
};

module.exports = {
    getStudents,
    createStudent
};