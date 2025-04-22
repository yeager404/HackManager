const mongoose = require("mongoose");

const panelistSchema = mongoose.Schema(
    {
        firstName:{
            type:String,
            required: true,
            trim: true,
        },
        lastName:{
            type:String,
            required: true,
            trim: true,
        },
        email:{
            type:String,
            required: true,
            trim: true,
        },
        speciality:[{
            type:String,
            trim: true,
        }],
        teams:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"teams" 
        }]
    }
)

module.exports = mongoose.model("panelist", panelistSchema);