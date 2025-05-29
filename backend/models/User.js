const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phoneno: {
        type: Number,
        required: true,
    },
    registeredEvents: [{
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        eventName: { type: String, require: true },
        bookedDate: { type: Date, default: Date.now },
        eventDate: { type: Date, required: true },
        location: { type: String, required: true },
        status: { type: String, enum: ["Confirmed", "Ended", "Cancelled"], default: "Confirmed" }
    }],

    cancelledEvents: [{
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        eventName: { type: String, require: true },
        cancelledDate: { type: Date, default: Date.now },
        eventDate: { type: Date, required: true },
        location: { type: String, required: true },
        status: { type: String, enum: ["Cancelled"], default: "Cancelled" }
    }],
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema,);