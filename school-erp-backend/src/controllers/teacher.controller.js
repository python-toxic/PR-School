const Teacher = require('../models/Teacher');
const User = require('../models/User');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({}).populate('user', 'name email role');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new teacher (and user)
// @route   POST /api/teachers
// @access  Private (Admin)
const createTeacher = async (req, res) => {
    const {
        name,
        email,
        password,
        employeeId,
        qualification,
        subjects, // Array of strings
        phone
    } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password: password || 'teacher123',
            role: 'TEACHER',
        });

        const teacher = await Teacher.create({
            user: user._id,
            employeeId,
            qualification,
            subjects,
            phone
        });

        res.status(201).json({
            ...teacher._doc,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTeachers, createTeacher };
