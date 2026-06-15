const User = require('../models/User');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Helper function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerCustomer = async (req, res) => {
    try {
        const { username, password, branch, fullName, nic, dob, gender, contactNumber } = req.body;

        // 1. Check if user or NIC already exists
        const userExists = await User.findOne({ username });
        const nicExists = await Customer.findOne({ nic });

        if (userExists || nicExists) {
            return res.status(400).json({ message: 'Username or NIC already registered' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Auto Generate Unique Customer ID (e.g., NPL-2026-001)
        const currentYear = new Date().getFullYear();
        const totalCustomers = await Customer.countDocuments();
        const nextNumber = String(totalCustomers + 1).padStart(3, '0'); // 001, 002...
        const customerId = `NPL-${currentYear}-${nextNumber}`;

        // 4. Create User Instance
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'customer',
            branch
        });

        // 5. Create Customer Profile Linked to User
        const customer = await Customer.create({
            user: user._id,
            customerId,
            fullName,
            nic,
            dob,
            gender,
            contactNumber
        });

        if (user && customer) {
            res.status(201).json({
                _id: user._id,
                customerId: customer.customerId,
                username: user.username,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If customer, fetch their profile to send customerId
        let customerId = null;
        if (user.role === 'customer') {
            const customerProfile = await Customer.findOne({ user: user._id });
            if (customerProfile) customerId = customerProfile.customerId;
        }

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            customerId: customerId,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerCustomer, loginUser };