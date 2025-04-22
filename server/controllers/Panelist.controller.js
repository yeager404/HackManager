const mongoose = require("mongoose");
const Panelist = require("../models/panelist.model.js");
const Hackathon = require("../models/hackathon.model.js");
const Team = require("../models/teams.model.js");
const ScoringCriteria = require("../models/scoringCriteria.model.js"); // Add this import at top

// Panelist Gets the Team List  
exports.getTeamList = async(req, res) => {
    try{
        const {panelistID} = req.params;
        console.log("Received", panelistID);

        if(!panelistID){
            return res.status(400).json({
                success: false,
                message: "Panelist ID not provided"
            })
        }

        const panelist = await Panelist.findById(panelistID);
        if(!panelist){
            return res.status(404).json({
                success: false,
                message: "Panelist not found"
            })
        }

        const teamList = await Team.find({ 
            assignedPanelist: panelistID 
        });

        return res.status(200).json({
            success: true,
            message: "Team List found",
            teams: teamList || []
        })

    }catch(err){
        console.error("Error in getTeamList:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error at getTeamList (panelist.controller)",
            error: err.message
        })
    }
}

// Update Team Score
exports.updateTeamScore = async(req, res) => {
    try {
        const { teamId, scores } = req.body;
        
        if (!teamId || !scores || !Array.isArray(scores)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data - teamId and scores array required"
            });
        }

        // Validate teamId format
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid team ID format"
            });
        }

        const team = await Team.findById(teamId).populate('scoringCriteria');
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        // Validate scores array matches criteria count
        if (scores.length !== team.scoringCriteria.length) {
            return res.status(400).json({
                success: false,
                message: `Scores array length (${scores.length}) doesn't match criteria count (${team.scoringCriteria.length})`
            });
        }

        // Update each scoring criteria
        const updatePromises = team.scoringCriteria.map((criteria, index) => {
            const score = scores[index];
            
            // Validate score
            if (typeof score !== 'number' || score < 0 || score > criteria.maxPoints) {
                throw new Error(`Invalid score ${score} for criteria "${criteria.criteria}". Must be between 0 and ${criteria.maxPoints}`);
            }

            return ScoringCriteria.findByIdAndUpdate(
                criteria._id,
                { recievedPoints: score }, // Note: matches the model's spelling
                { new: true }
            );
        });

        await Promise.all(updatePromises);

        return res.status(200).json({
            success: true,
            message: "Scores updated successfully",
            updatedTeam: await Team.findById(teamId).populate('scoringCriteria') // Return updated data
        });
        
    } catch (err) {
        console.error("Error in updateTeamScore:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error at updateTeamScore",
            error: err.message
        });
    }
};  

//Get Team Score
exports.getTeamScoringCriteria = async(req, res) => {
    try {
        const { teamId } = req.params;
        
        const team = await Team.findById(teamId)
            .populate('scoringCriteria');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Team scoring criteria retrieved successfully",
            scoringCriteria: team.scoringCriteria
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error at getTeamScoringCriteria",
            error: err.message
        });
    }
};
