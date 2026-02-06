const Fee = require('../models/Fee');

// @desc    Assign fee to student
// @route   POST /api/fees
// @access  Private (Admin)
const assignFee = async (req, res) => {
    const { studentId, title, amount, dueDate, description } = req.body;

    try {
        const fee = await Fee.create({
            student: studentId,
            title,
            amount,
            dueDate,
            description
        });
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get fees for a student
// @route   GET /api/fees/student/:studentId
// @access  Private
const getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.find({ student: req.params.studentId });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark fee as paid
// @route   PUT /api/fees/:id/pay
// @access  Private (Admin)
const payFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (fee) {
            fee.status = 'Paid';
            fee.paidDate = Date.now();
            fee.transactionId = req.body.transactionId || `TXN-${Date.now()}`;

            const updatedFee = await fee.save();
            res.json(updatedFee);
        } else {
            res.status(404).json({ message: 'Fee record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { assignFee, getStudentFees, payFee };
