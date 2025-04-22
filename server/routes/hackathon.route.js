const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth.middleware.js");

const {createHackathon, 
    editHackathon, 
    getHackathonsList,
    deleteHackathon,
    getHackathon,
    createCriteria, 
    editCriteria, 
    getCriteriaList,
    createPanelist, 
    editPanelist, 
    getPanelistList,
    assignTeam, 
    unassignTeam, 
    getTeams
} = require("../controllers/Hackathon.controller");

router.post("/createHackathon", auth, createHackathon);
router.post("/editHackathon",auth, editHackathon);
router.get("/getHackathonsList/:userId", auth, getHackathonsList);
router.get('/getHackathon/:hackathonId', auth, getHackathon);
router.delete("/deleteHackathon",auth, deleteHackathon);
router.post("/createCriteria/:hackathonId", auth, createCriteria);
router.post("/editCriteria", auth, editCriteria);
router.get("/getCriteriaList/:hackathonId", auth, getCriteriaList);
router.post("/createPanelist", auth, createPanelist);
router.post("/editPanelist", auth, editPanelist);
router.get("/getPanelistList/:hackathonId", auth, getPanelistList);
router.post("/assignTeam", auth, assignTeam);
router.post("/unassignTeam", auth, unassignTeam);
router.get("/getTeams/:hackathonID", auth, getTeams);

module.exports = router;