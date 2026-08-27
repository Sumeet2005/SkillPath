const express = require("express");
const recommendationService = require("../services/recommendationService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { skill } = req.query;
    const courses = await recommendationService.getCoursesBySkill(skill);

    res.json({
      success: true,
      skill: skill ? skill.trim() : "",
      count: courses.length,
      courses,
    });
  })
);

module.exports = router;