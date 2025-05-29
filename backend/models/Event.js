const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    Homedescription: {
        type: String,
        required: true,
    },
    eventDescription: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
        required: true,
    },
    image3: {
        type: String,
        required: true,
    },
    registeredusers: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fullname: { type: String, required: true },
        registerDate: { type: Date, default: Date.now }
    }],
    totalregistration: {
        type: Number,
        default: 0,
    }
}, { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);