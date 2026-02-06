const express = require('express');
const router = express.Router();
const { getClasses, createClass } = require('../controllers/class.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getClasses)
    .post(protect, authorize('ADMIN'), createClass);

module.exports = router;
