const express = require('express');
const router = express.Router();
const { assignFee, getStudentFees, payFee } = require('../controllers/fee.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .post(protect, authorize('ADMIN'), assignFee);

router.route('/student/:studentId')
    .get(protect, getStudentFees);

router.route('/:id/pay')
    .put(protect, authorize('ADMIN'), payFee);

module.exports = router;
