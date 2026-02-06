const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true // School admission number
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    rollNumber: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    guardianName: {
        type: String
    },
    guardianPhone: {
        type: String
    }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
