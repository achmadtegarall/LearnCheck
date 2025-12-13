const express = require("express");
const router = express.Router();
const { generateAssessment, resetAssessment, resetOneQuestion, submitAssessment } = require("../controllers/assessment.controller");

router.post("/generate", generateAssessment);
router.post("/reset", resetAssessment);
router.post("/reset-one", resetOneQuestion);
router.post("/submit", submitAssessment);

module.exports = router;
