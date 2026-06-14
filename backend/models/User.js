const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    branch: {
        type: String,
        required: [true, 'Please select a branch']
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);