const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // e.g., "10"
    },
    section: {
        type: String,
        required: true,
        // e.g., "A"
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, { timestamps: true });

// Compound index to ensure 10-A is unique
classSchema.index({ name: 1, section: 1 }, { unique: true });

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
