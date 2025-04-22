const multer = require("multer");
const xlsx = require("xlsx");
const Team = require("../models/teams.model.js");
const Participant = require("../models/participants.model.js");
const Hackathon = require("../models/hackathon.model.js");


// Multer setup to handle file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

// Controller to handle Excel upload and data storage
exports.uploadExcelAndSaveTeams = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "File upload failed", error: err });
            }

            const { hackathonID } = req.params;
            console.log(hackathonID);

            if (!hackathonID) {
                return res.status(400).json({ success: false, message: "Hackathon ID not provided" });
            }

            // Fetch Hackathon with its teams
            const hackathon = await Hackathon.findById(hackathonID).populate('teams');
            if (!hackathon) {
                return res.status(404).json({ success: false, message: "Hackathon not found" });
            }

            // Check scoring criteria exists
            if (!hackathon.scoringCriteria || hackathon.scoringCriteria.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Scoring criteria is not set. Cannot upload teams." 
                });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: "Please upload an Excel file" });
            }

            // Process the Excel file
            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            let savedTeams = [];
            const existingTeamNames = hackathon.teams.map(team => team.teamName.toLowerCase());

            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (!row[0]) continue;

                let teamName = row[0].trim();
                
                // Check if team name already exists in this hackathon
                if (existingTeamNames.includes(teamName.toLowerCase())) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Team '${teamName}' already exists in this hackathon.` 
                    });
                }

                let participants = [];

                for (let j = 1; j < row.length; j += 2) {
                    let participantName = row[j]?.trim();
                    let participantEmail = row[j + 1]?.trim();

                    if (participantName && participantEmail) {
                        participants.push({ name: participantName, email: participantEmail });
                    }
                }

                const newTeam = new Team({ 
                    teamName, 
                    scoringCriteria: hackathon.scoringCriteria,
                    hackathon: hackathonID // Add reference to the hackathon
                });
                await newTeam.save();

                let participantIds = [];

                for (const participant of participants) {
                    const nameParts = participant.name.split(" ");
                    const firstName = nameParts[0];
                    const lastName = nameParts.slice(1).join(" ") || "-";

                    const newParticipant = new Participant({
                        firstName,
                        lastName,
                        email: participant.email,
                        teamId: newTeam._id
                    });

                    await newParticipant.save();
                    participantIds.push(newParticipant._id);
                }

                newTeam.participants = participantIds;
                await newTeam.save();
                
                savedTeams.push(newTeam);
                hackathon.teams.push(newTeam);
                existingTeamNames.push(teamName.toLowerCase()); // Add to check for duplicates in this batch
            }

            await hackathon.save();
            
            return res.status(201).json({
                success: true,
                message: "Teams and Participants uploaded successfully",
                teams: savedTeams
            });
        });
    } catch (err) {
        console.error("Error processing file:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: err.message 
        });
    }
};


// Delete a team
exports.deleteTeam = async(req, res) => {
    try {
        const { teamId, hackathonId } = req.body;

        if (!teamId || !hackathonId) {
            return res.status(400).json({
                success: false,
                message: "Team ID and Hackathon ID are required"
            });
        }

        // Verify the team belongs to the specified hackathon
        const team = await Team.findOne({ _id: teamId, hackathon: hackathonId });
        
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found in the specified hackathon"
            });
        }

        // Delete all participants in this team
        await Participant.deleteMany({ teamId: team._id });

        // Delete the team
        await Team.findByIdAndDelete(teamId);

        // Remove the team reference from the hackathon
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { $pull: { teams: teamId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        });
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error from Delete Team (Teams.controller)",
            error: err.message
        });
    }
};