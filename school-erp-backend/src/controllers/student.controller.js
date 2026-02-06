const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({})
            .populate('user', 'name email role')
            .populate('class', 'name section');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('user', 'name email')
            .populate('class', 'name section');

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new student (and user)
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
    const {
        name,
        email,
        password,
        classId,
        rollNumber,
        studentId,
        gender,
        phone
    } = req.body;

    try {
        // 1. Create the User first
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password: password || 'student123', // Default password if not provided
            role: 'STUDENT',
        });

        // 2. Validate Class
        const classObj = await Class.findById(classId);
        if (!classObj) {
            // Rollback user creation ideally, keeping simple for now
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ message: 'Invalid Class ID' });
        }

        // 3. Create Student Profile
        const student = await Student.create({
            user: user._id,
            studentId,
            class: classId,
            rollNumber,
            gender,
            phone
        });

        res.status(201).json({
            ...student._doc,
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

module.exports = { getStudents, getStudentById, createStudent };
