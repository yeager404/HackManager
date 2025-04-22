const Hackathon = require("../models/hackathon.model.js");
const scoringCriteria = require("../models/scoringCriteria.model.js");
const Panelist = require("../models/panelist.model.js");
const Team = require("../models/teams.model.js");
const User = require("../models/user.model.js");

const mailSender = require("../utils/mailSender.js");
const panelistRegistrationMail = require("../utils/mailTemplates/panelistRegistrationMail.js");


// Creating the Hackathon

exports.createHackathon = async (req, res) => {
    try {
        const { userID, hackathonName, panelists, scoringCriteria, teams, teamMaxSize, teamMinSize } = req.body;

        // Validate User ID
        if (!userID) {
            return res.status(400).json({
                success: false, 
                message: "User ID not found (createHackathon)"
            });
        }

        // Find User
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User not found, Hackathon cannot be created"
            });
        }

        // Validate Hackathon Name
        if (!hackathonName) {
            return res.status(400).json({
                success: false,
                message: "Hackathon name is required",
            });
        }

        // Validate Team Size Constraints
        if(teamMinSize && teamMaxSize){
            if (teamMinSize > teamMaxSize) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum team size cannot be greater than maximum team size."
                });
            }
        }

        // Create Hackathon
        const HackathonDetails = await Hackathon.create({
            hackathonName,
            panelists: panelists || [],
            scoringCriteria: scoringCriteria || [],
            teams: teams || [],
            teamMaxSize: teamMaxSize ?? 4, // Default to 10 if not provided
            teamMinSize: teamMinSize ?? 1  // Default to 1 if not provided
        });

        console.log("Hackathon Created: ", HackathonDetails);

        // Add Hackathon to User's List
        user.hackathons.push(HackathonDetails._id);
        await user.save(); // Ensure changes are saved

        return res.status(201).json({
            success: true,
            message: "Hackathon Created Successfully",
            hackathon: HackathonDetails
        });

    } catch (err) {
        console.error("Error creating hackathon:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
// Editing the Hackathon

exports.editHackathon = async (req, res) => {
    try {
        const { hackathonId, hackathonName, panelists, scoringCriteria, teams, teamMaxSize, teamMinSize } = req.body;

        if (!hackathonId) {
            return res.status(400).json({
                success: false,
                message: "Hackathon ID is required",
            });
        }

        const hackathon = await Hackathon.findById(hackathonId);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found",
            });
        }

        // Update fields if provided
        if (hackathonName) hackathon.hackathonName = hackathonName;
        if (panelists) hackathon.panelists = panelists;
        if (scoringCriteria) hackathon.scoringCriteria = scoringCriteria;
        if (teams) hackathon.teams = teams;
        if (teamMaxSize !== undefined) hackathon.teamMaxSize = teamMaxSize;
        if (teamMinSize !== undefined) hackathon.teamMinSize = teamMinSize;

        // Save updated hackathon
        await hackathon.save();

        return res.status(200).json({
            success: true,
            message: "Hackathon updated successfully",
            hackathon,
        });

    } catch (err) {
        console.error("Error editing hackathon:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error at editHackathon",
            error: err.message
        });
    }
};

// Get Hackathon List
exports.getHackathonsList = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Verify if the requesting user matches the userId parameter
        if (req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const user = await User.findById(userId).populate("hackathons"); // Populate hackathons list

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hackathons retrieved successfully",
            hackathons: user.hackathons
        });

    } catch (err) {
        console.error("Error retrieving hackathons list:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Delete Hackathon
exports.deleteHackathon = async (req, res) => {
    try {
        const { hackathonId, userId } = req.body;

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if hackathon exists
        let hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        // Delete hackathon
        let hackDeleted = await Hackathon.findByIdAndDelete(hackathonId);
        if (hackDeleted) {
            // Remove hackathon from user's list
            user.hackathons = user.hackathons.filter(
                (hack) => hack._id.toString() !== hackathonId
            );
            await user.save(); // ✅ Save updated user data

            return res.status(200).json({
                success: true,
                message: "Hackathon deleted and removed from user list"
            });
        }

        return res.status(404).json({
            success: false,
            message: "Hackathon not found"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while deleting Hackathon",
            error: err?.message
        });
    }
};

// get Hackathon details
exports.getHackathon = async (req, res) => {
    try {
        const { hackathonId } = req.params;

        // Validate ID format
        if (!hackathonId) {
            return res.status(400).json({
                success: false,
                message: "Hackathon Id not found"
            });
        }

        // Simply find the hackathon without populating anything
        const hackathon = await Hackathon.findById(hackathonId);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        // Return the raw hackathon document
        res.status(200).json({
            success: true,
            hackathon
        });

    } catch (error) {
        console.error("Error fetching hackathon:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch hackathon",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// ************************** CRITERIA ************************************

// Creating Criteria By Hackathon Organizer
exports.createCriteria = async(req, res) => {
    try{
        const {criteria, maxPoints, hackathonId} = req.body;
        
        if(!criteria){
            return res.status(400).json({
                success: false,
                message: "Criteria should have some name"
            })
        }

        if(!maxPoints){
            return res.status(400).json({
                success: false,
                message: "Criteria should have a Maximum Point Asssigned to it"
            })
        }

        const newCriteria = await scoringCriteria.create({
            criteria: criteria,
            maxPoints: maxPoints
        })

        const hackathon = await Hackathon.findById(hackathonId);
        hackathon.scoringCriteria.push(newCriteria._id);
        hackathon.save();

        console.log("Criteria Created and Added Successfully ");

        return res.status(200).json({
            success: true,
            message: "Criteria Created Successfully",
            criteria: newCriteria
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error at Criteria Creation",
            error: err
        })
    }
}

// Edit the criteria
exports.editCriteria = async(req, res) => {
    try{
        const {criteriaId, criteria, maxPoints} = req.body;
        
        if(!criteriaId){
            return res.status(404).json({
                success: false,
                message: "Criteria not found"
            })
        }

        const oldCriteria = await scoringCriteria.findById(criteriaId);
        if(!oldCriteria){
            return res.status(404).json({
                success: false, 
                message: "Criteria not found"
            })
        }

        if(criteria !== undefined) oldCriteria.criteria = criteria;
        if(maxPoints !== undefined) oldCriteria.maxPoints = maxPoints;

        await oldCriteria.save();

        return res.status(200).json({
            success: true,
            message: "Criteria Updated Successfully",
            criteria: oldCriteria
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Error at editCriteria",
            error: err.message
        })
    }
}

// Get all criterias
exports.getCriteriaList = async (req, res) => {
    try {
        const { hackathonId } = req.params;

        if (!hackathonId) {
            return res.status(400).json({
                success: false,
                message: "Hackathon ID is required"
            });
        }

        const hackathon = await Hackathon.findById(hackathonId).populate('scoringCriteria');

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Criteria list retrieved successfully",
            criteriaList: hackathon.scoringCriteria
        });

    } catch (err) {
        console.error("Error retrieving criteria list:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};



// ********************************* PANELIST **********************************

// Create the Panelist


exports.createPanelist = async(req, res) => {
  try {
    const { firstName, lastName, email, speciality, hackathonId } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Full Name required"
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email should be provided that will be used by Panelist to login later"
      });
    }

    const panelist = await Panelist.create({
      firstName,
      lastName,
      email,
      speciality: speciality || ""
    });

    if (!panelist) {
      return res.status(400).json({
        success: false,
        message: "Panelist Creation Failed. Try Again later"
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    hackathon.panelists.push(panelist);
    await hackathon.save();

    // Send Mail after successful creation
    const mailResponse = await mailSender(
      email,
      "Welcome Panelist! Hackathon Details Inside",
      panelistRegistrationMail(firstName, hackathonId)
    );

    console.log("Mail response:", mailResponse);

    return res.status(200).json({
      success: true,
      message: "Panelist Created, Added Successfully, and Email Sent",
      panelist
    });

  } catch (err) {
    console.log("Error while creating panelist:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error at Panelist Creation"
    });
  }
};


exports.editPanelist = async(req, res) => {
    try{
        const {panelistId, firstName, lastName, email, speciality} = req.body;
    
        const panelist = await Panelist.findById(panelistId);
    
        if(!panelist){
            return res.status(404).json({
                success: false,
                message: "Panelist not found"
            })
        }
    
        if(firstName !== undefined) panelist.firstName = firstName;
        if(lastName !== undefined) panelist.lastName = lastName;
        if(email !== undefined) panelist.email = email;
        if(speciality !== undefined) panelist.speciality = speciality;
        
        await panelist.save();
    
        console.log(panelist);
    
        return res.status(200).json({
            success: true,
            message: "Edit Saved",
            panelist: panelist
        })

    }catch(err){
        console.log("Error in Edit Panelist at Hackathon ");
        return res.status(200).json({
            success: false, 
            message: "Error at edit panelist"
        })
    }
    
}

exports.getPanelistList = async(req, res) => {
    try {
        const { hackathonId } = req.params;

        if(!hackathonId) {
            return res.status(400).json({
                success: false,
                message: "Hackathon ID is required"
            });
        }

        const hackathon = await Hackathon.findById(hackathonId).populate('panelists');
        
        if(!hackathon) {
            return res.status(404).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Panelist list fetched successfully",
            panelistList: hackathon.panelists
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while fetching panelist list",
            error: err.message
        });
    }
}


// ************************************  TEAM TO PANELISTSS *******************************************

exports.assignTeam = async (req, res) => {
    try {
        let { teamID, panelistID } = req.body;

        if (!teamID) {
            return res.status(400).json({
                success: false,
                message: "Team Not Found"
            });
        }

        if (!Array.isArray(teamID)) {
            teamID = [teamID];
        }

        if (!panelistID) {
            return res.status(400).json({
                success: false,
                message: "Panelist ID not provided"
            });
        }

        const panelist = await Panelist.findById(panelistID);
        if (!panelist) {
            return res.status(404).json({
                success: false,
                message: "Panelist not found"
            });
        }

        // Ensure no duplicate team assignments
        const newTeams = teamID.filter(id => !panelist.teams.some(tid => tid.toString() === id.toString()));

        if (newTeams.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All provided teams are already assigned to this panelist",
            });
        }

        // Assign teams to panelist
        panelist.teams.push(...newTeams);
        await panelist.save();

        // Assign panelist to each team
        for (const id of newTeams) {
            const team = await Team.findById(id);
            if (team) {
                if (!team.assignedPanelist.includes(panelistID)) {
                    team.assignedPanelist.push(panelistID); // Fix push issue
                }
                team.assignedStatus = team.assignedPanelist.length !== 0;
                await team.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Team(s) assigned successfully",
            panelist: panelist
        });

    } catch (err) {
        console.error("Error in assignTeam:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

exports.unassignTeam = async (req, res) => {
    try {
        let { teamID, panelistID } = req.body;

        if (!teamID || !panelistID) {
            return res.status(400).json({
                success: false,
                message: "Team ID or Panelist ID not provided"
            });
        }

        // Convert to array if single teamID is passed
        if (!Array.isArray(teamID)) {
            teamID = [teamID];
        }

        const panelist = await Panelist.findById(panelistID);
        if (!panelist) {
            return res.status(404).json({
                success: false,
                message: "Panelist not found"
            });
        }

        // Convert teamID array to string array for comparison
        const teamIDsAsStrings = teamID.map(id => id.toString());

        // Filter out the teams that need to be removed
        panelist.teams = panelist.teams.filter(id => !teamIDsAsStrings.includes(id.toString()));

        await panelist.save();

        // Remove panelistID from each team's assignedPanelist list
        for (const id of teamID) {
            const team = await Team.findById(id);
            if (team) {
                team.assignedPanelist = team.assignedPanelist.filter(pid => pid.toString() !== panelistID.toString());
                await team.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Team(s) unassigned successfully"
        });

    } catch (err) {
        console.error("Error in unassigning team:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

exports.getTeams = async(req, res) => {
    try {
        const { hackathonID } = req.params;
        if (!hackathonID) {
            return res.status(400).json({
                success: false,
                message: "Hackathon Id not provided"
            });
        }

        const hackathon = await Hackathon.findById(hackathonID).populate('teams');
        if (!hackathon) {
            return res.status(400).json({
                success: false,
                message: "Hackathon not found"
            });
        }

        return res.status(200).json({
            success: true, 
            message: "Teams found",
            teams: hackathon.teams || []
        });
        
    } catch (err) {
        console.error("Error in getTeams:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
}
