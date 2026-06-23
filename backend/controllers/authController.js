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
        // 1. req.body එකට username එක සහ branchId එකතු කරගත්තා
        const { name, username, email, nic, contact, password, branchId } = req.body;

        // Validation - username එකත් අනිවාර්ය කලා
        if (!name || !username || !email || !nic || !contact || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if username already exists (Username එක කලින් කෙනෙක් අරන්ද බලනවා)
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Check if email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user - මෙතනට username එක සහ branch එකට branchId එක සෙට් කලා
        const user = await User.create({
            name,
            username, // 👈 Database එකට සේව් වෙනවා
            email,
            nic,
            contact,
            password,
            branch: branchId, // Frontend එකෙන් එවපු "Ogodapola" වගේ String එක කෙලින්ම යනවා
            role: 'student',
            approvalStatus: 'pending',
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username, // 👈 Response එකටත් එකතු කලා
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
        // 2. Email වෙනුවට දැන් req.body එකෙන් username එක ගන්නවා
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Check for user using USERNAME (Email වෙනුවට Username එකෙන් find කරනවා)
        const user = await User.findOne({ username }).select('+password');
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
                username: user.username, // 👈
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
        // බ්‍රාන්ච් එක String එකක් නිසා පරණ .populate('branch') එක අයින් කලා (නැත්නම් error එන්න පුළුවන්)
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
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
        // බ්‍රාන්ච් එක String එකක් නිසා පරණ .populate('branch') එක අයින් කලා
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

module.exports = { register, login, getCurrentUser, getBranches, getDashboardStats, getAllStudents, updateApprovalStatus };