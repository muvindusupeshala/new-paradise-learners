const User = require('../models/User');
const Branch = require('../models/Branch');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
        expiresIn: '7d',
    });
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
    try {
        const { name, username, email, nic, contact, password, branchId } = req.body;

        // Validation
        if (!name || !username || !email || !nic || !contact || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            username,
            email,
            nic,
            contact,
            password,
            branch: branchId,
            role: 'student',
            approvalStatus: 'approved', // 👈 🎯 Pending වෙනුවට කෙලින්ම Approved විදිහට සේව් වෙනවා!
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully and approved',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                approvalStatus: user.approvalStatus,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const loginQuery = username || email;

        // Validation
        if (!loginQuery || !password) {
            return res.status(400).json({ message: 'Please provide email/username and password' });
        }

        // Username එකෙන් හෝ Email එකෙන් ඩේටාබේස් එක පීරලා හොයනවා
        const user = await User.findOne({
            $or: [
                { username: loginQuery },
                { email: loginQuery }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                approvalStatus: user.approvalStatus,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                approvalStatus: user.approvalStatus,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Get all branches
// @route GET /api/auth/branches
// @access Public
const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.status(200).json({
            success: true,
            branches,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Get dashboard stats (Admin only)
// @route GET /api/auth/dashboard-stats
// @access Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingApprovals = await User.countDocuments({
            role: 'student',
            approvalStatus: 'pending',
        });
        const approvedStudents = await User.countDocuments({
            role: 'student',
            approvalStatus: 'approved',
        });

        res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                pendingApprovals,
                approvedStudents,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Get all students (Admin only)
// @route GET /api/auth/students
// @access Private/Admin
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.status(200).json({
            success: true,
            students,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc Update student approval status (Admin only)
// @route PUT /api/auth/students/:id/approve
// @access Private/Admin
const updateApprovalStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: status },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Approval status updated',
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    getBranches,
    getDashboardStats,
    getAllStudents,
    updateApprovalStatus
};