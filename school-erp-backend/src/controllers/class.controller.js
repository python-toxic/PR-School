const Class = require('../models/Class');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin/Teacher)
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Admin)
const createClass = async (req, res) => {
    const { name, section } = req.body;

    try {
        const classExists = await Class.findOne({ name, section });

        if (classExists) {
            return res.status(400).json({ message: 'Class already exists' });
        }

        const newClass = await Class.create({
            name,
            section
        });

        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getClasses, createClass };
