const express = require("express");
const router = express.Router();
const { getUserPreferences } = require("../controllers/user.controller");

router.get("/:userId/preferences", getUserPreferences);

module.exports = router;