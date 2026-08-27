const express = require("express");
const pathService = require("../services/pathService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { currentSkills, targetJob } = req.body;
    const result = await pathService.calculatePath(currentSkills, targetJob);
    res.json(result);
  })
);

module.exports = router;