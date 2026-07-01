const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
        },
        username: {
            type: String,
            required: [true, 'Please provide a username'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        nic: {
            type: String,
            required: [true, 'Please provide a NIC'],
            unique: true,
        },
        contact: {
            type: String,
            required: [true, 'Please provide a contact number'],
        },
        address: { // 👈 🎯 මෙන්න මේ කොටස අලුතින්ම එකතු කළා මචන්!
            type: String,
            required: false, // ෆ්‍රොන්ට් එන්ඩ් එකෙන් අනිවාර්යයෙන්ම එන නිසා මෙතන false තිබ්බට අවුලක් නෑ
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        branch: {
            type: String,
        },
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        enrollmentDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);