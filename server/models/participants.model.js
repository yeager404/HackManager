const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams",
        required: true
    }
});

module.exports = mongoose.model("participants", participantSchema);
