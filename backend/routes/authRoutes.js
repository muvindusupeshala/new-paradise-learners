const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    register,
    login,
    getCurrentUser,
    getBranches,
    getDashboardStats,
    getAllStudents,
    updateApprovalStatus,
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/branches', getBranches);

// Private routes
router.get('/me', authMiddleware, getCurrentUser);

// Admin routes
router.get('/dashboard-stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/students', authMiddleware, adminMiddleware, getAllStudents);
router.put('/students/:id/approve', authMiddleware, adminMiddleware, updateApprovalStatus);

module.exports = router;