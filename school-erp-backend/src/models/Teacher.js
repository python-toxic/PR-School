const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    qualification: {
        type: String
    },
    subjects: [{
        type: String // List of subjects they can teach e.g., ["Math", "Physics"]
    }],
    phone: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;
