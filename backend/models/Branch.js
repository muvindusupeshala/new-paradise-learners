const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide branch name'],
        },
        location: {
            type: String,
            required: [true, 'Please provide branch location'],
        },
        phone: {
            type: String,
            required: [true, 'Please provide branch phone'],
        },
        email: {
            type: String,
            required: [true, 'Please provide branch email'],
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Branch', branchSchema);
