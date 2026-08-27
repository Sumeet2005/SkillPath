const express = require("express");
const skillService = require("../services/skillService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const skills = await skillService.getAllSkills();
    res.json({
      success: true,
      count: skills.length,
      skills,
    });
  })
);

module.exports = router;