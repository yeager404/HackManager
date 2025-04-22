const mongoose = require("mongoose");

const scoringCriteria = new mongoose.Schema({
    criteria:{
        type: String,
        required:true,
        trim:true,
    },
    maxPoints:{
        type:Number,
        require: true,
    },
    recievedPoints:{
        type:Number,
    }
})

module.exports = mongoose.model("scoringCriteria", scoringCriteria);