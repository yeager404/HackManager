const mongoose = require("mongoose");

const hackathonSchema = mongoose.Schema(
    {
        hackathonName:{
            type:String,
            required: true,
            trim:true,
        },
        panelists:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"panelist"
        }],
        scoringCriteria:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"scoringCriteria",
        }],
        teams:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"teams"
        }],
        teamMaxSize:{
            type:Number,
        },
        teamMinSize:{
            type:Number,
        }
    }
)

module.exports = mongoose.model("hackathon", hackathonSchema);