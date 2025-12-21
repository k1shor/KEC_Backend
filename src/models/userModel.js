const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        // 'admin', 'superadmin', 'client'
        // 0 - client, 1 - admin, 2 - superAdmin
        // isAdmin - true/false
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)