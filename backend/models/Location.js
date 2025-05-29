const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
    cities:{
        type: [String],
        unique: true,
        required:true,
    }
})

module.exports = mongoose.model("Location", LocationSchema);