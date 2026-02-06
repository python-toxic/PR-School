const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: {
        type: String,
        required: true // e.g., "Annual Tuition Phase 1"
    },
    description: String,
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    paidDate: {
        type: Date
    },
    transactionId: {
        type: String
    }
}, { timestamps: true });

const Fee = mongoose.model('Fee', feeSchema);
module.exports = Fee;
