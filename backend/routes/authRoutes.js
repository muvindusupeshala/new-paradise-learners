const express = require('express');
const router = express.Router();
const { registerCustomer, loginUser } = require('../controllers/authController');

// Routes mapping to controllers
router.post('/register', registerCustomer);
router.post('/login', loginUser);

module.exports = router;