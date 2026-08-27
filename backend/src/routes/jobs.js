const express = require("express");
const jobService = require("../services/jobService");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const jobs = await jobService.getAllJobs();
    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  })
);

module.exports = router;