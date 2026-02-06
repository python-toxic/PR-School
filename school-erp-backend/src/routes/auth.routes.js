const express = require('express');
const router = express.Router();
const { loginUser, registerAdmin } = require('../controllers/auth.controller');

router.post('/login', loginUser);
router.post('/register-admin', registerAdmin);

module.exports = router;
