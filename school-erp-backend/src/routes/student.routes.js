const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent } = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getStudents)
    .post(protect, authorize('ADMIN'), createStudent);

router.route('/:id')
    .get(protect, getStudentById);

module.exports = router;
