const express = require("express");
const router = express.Router();

const {auth} = require("../middleware/auth.middleware.js");

const {
    uploadExcelAndSaveTeams,
    deleteTeam
} = require("../controllers/Teams.controller");

router.post("/uploadTeams/:hackathonID", auth, uploadExcelAndSaveTeams);
router.post("/deleteTeam", deleteTeam);

module.exports = router;