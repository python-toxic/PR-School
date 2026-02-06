const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher } = require('../controllers/teacher.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getTeachers)
    .post(protect, authorize('ADMIN'), createTeacher);

module.exports = router;
