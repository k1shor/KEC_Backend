const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const tokenSchema = new mongoose.Schema({
    user : {
        type: ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 86400
    }
})

module.exports = mongoose.model("Token", tokenSchema)