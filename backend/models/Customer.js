const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // උඩ හදපු User model එකට ලින්ක් කරනවා
        required: true
    },
    customerId: {
        type: String,
        required: true,
        unique: true // Unique ID එක (e.g., NPL-2026-001)
    },
    fullName: {
        type: String,
        required: [true, 'Please add full name']
    },
    nic: {
        type: String,
        required: [true, 'Please add NIC number'],
        unique: true
    },
    dob: {
        type: Date,
        required: [true, 'Please add Date of Birth']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    vehicleModels: [{
        type: String // e.g., ['Manual Car', 'Motorbike']
    }],
    // 🗓️ Dates (Admin එකෙන් පස්සේ ඇතුළත් කරන ඒවා)
    examDate: { type: Date },
    trialDate: { type: Date },
    lPermitDate: { type: Date },
    advancePaidDate: { type: Date },
    // 💰 Payments
    totalFee: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    toPaidAmount: { type: Number, default: 0 } // Balance එක
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);