const express = require("express");
const router = express.Router();

const {
    getTeamList,
    updateTeamScore,
    getTeamScoringCriteria
} = require("../controllers/Panelist.controller");

router.get("/getTeamList/:panelistID", getTeamList);
router.post("/updateTeamScore", updateTeamScore);
router.get("/getCriteria/:teamId", getTeamScoringCriteria);

module.exports = router;