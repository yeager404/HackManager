const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "participants"
    }],
    scoringCriteria:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "scoringCriteria"
    }],
    assignedStatus:{
        type: Boolean,
        default: false
    },
    assignedPanelist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "panelist"
    }],
});

module.exports = mongoose.model("teams", teamSchema);
