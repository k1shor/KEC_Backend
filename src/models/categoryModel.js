const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true,
        // unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Category", categorySchema)

// _id -> provided by mongoDB by default, type -> ObjectId -> 24bit hex string
// timestamps: true -> createdAt, updatedAt