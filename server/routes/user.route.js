const express = require("express");
const router = express.Router();

const {
    signup,
    creatorLogin,
    panelistLogin
} = require("../controllers/Auth.controller");

router.post("/signup", signup);
router.post("/creatorLogin", creatorLogin);
router.post("/panelistLogin", panelistLogin);

module.exports = router;