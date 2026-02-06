const express = require('express');
const router = express.Router();
const { markAttendance, getClassAttendance } = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .post(protect, authorize('ADMIN', 'TEACHER'), markAttendance);

router.route('/class/:classId')
    .get(protect, getClassAttendance);

module.exports = router;
