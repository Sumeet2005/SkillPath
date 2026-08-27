const { driver } = require("../db/driver");
const { FIND_LEARNING_PATH, CHECK_JOB_EXISTS, GET_JOB_REQUIREMENTS } = require("../queries/learningPath");

/**
 * Helper to extract integer from Neo4j Integer object or primitive number
 */
function toInt(val) {
  if (typeof val === "number") return val;
  if (val && typeof val.toNumber === "function") return val.toNumber();
  if (val && typeof val.low === "number") return val.low;
  return 0;
}

/**
 * Service to validate input and calculate dynamic learning path from Neo4j graph
 */
async function calculatePath(currentSkillsInput, targetJob) {
  if (!targetJob || typeof targetJob !== "string" || !targetJob.trim()) {
    const err = new Error("targetJob is required and must be a valid string.");
    err.statusCode = 400;
    throw err;
  }

  if (!Array.isArray(currentSkillsInput)) {
    const err = new Error("currentSkills must be an array of skill names.");
    err.statusCode = 400;
    throw err;
  }

  // Sanitize current skills (remove duplicates & empty strings)
  const currentSkills = Array.from(
    new Set(
      currentSkillsInput
        .filter((s) => typeof s === "string" && s.trim())
        .map((s) => s.trim())
    )
  );

  const session = driver.session();

  try {
    // 1. Check target job existence
    const jobResult = await session.run(CHECK_JOB_EXISTS, { targetJob });
    if (jobResult.records.length === 0) {
      const err = new Error(`Target job '${targetJob}' does not exist in the database.`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Fetch actual required skills from Neo4j (Job-[:REQUIRES]->Skill)
    const reqResult = await session.run(GET_JOB_REQUIREMENTS, { targetJob });
    const requiredSkills = reqResult.records[0]?.get("requiredSkills") || [];

    const masteredRequiredSkills = requiredSkills.filter((s) => currentSkills.includes(s));
    const missingRequiredSkills = requiredSkills.filter((s) => !currentSkills.includes(s));
    const readinessScore = requiredSkills.length > 0
      ? Math.round((masteredRequiredSkills.length / requiredSkills.length) * 100)
      : 0;

    // 3. Execute dynamic path calculation Cypher query
    const result = await session.run(FIND_LEARNING_PATH, {
      currentSkills,
      targetJob,
    });

    if (result.records.length === 0) {
      return {
        success: true,
        targetJob,
        currentSkills,
        readinessScore,
        requiredSkillCount: requiredSkills.length,
        masteredRequiredSkills,
        missingRequiredSkills: [],
        missingSkills: [],
        totalSkills: 0,
        totalHops: 0,
        totalDurationHours: 0,
        uniqueCourseCount: 0,
        totalCourseRecommendations: 0,
        path: [],
        message: "All requirements for this target job are already satisfied by your current skills.",
      };
    }

    let totalHops = 0;
    let totalCourseRecommendations = 0;
    const uniqueCoursesMap = new Map();

    const path = result.records.map((record) => {
      const targetSkill = record.get("targetSkill");
      const hasPrereqs = record.get("hasPrereqs");
      const rawChain = record.get("learningChain") || [];
      const hops = toInt(record.get("hops"));

      // Distinguish prerequisites from targetSkill
      const prerequisites = rawChain.filter((s) => s !== targetSkill);

      // A valid path exists if there were no prerequisites needed, or if a chain was found
      const hasValidPath = !hasPrereqs || rawChain.length > 1 || hops === 0;

      // Extract & format course recommendations
      const rawCourses = record.get("courses") || [];
      const courses = rawCourses
        .filter((c) => c && c.name)
        .map((c) => {
          const hours = toInt(c.durationHours);
          const courseObj = {
            name: c.name,
            provider: c.provider || "Partner Course",
            durationHours: hours,
            level: c.level || "Intermediate",
          };

          totalCourseRecommendations++;
          if (!uniqueCoursesMap.has(c.name)) {
            uniqueCoursesMap.set(c.name, courseObj);
          }

          return courseObj;
        });

      totalHops += hops;

      return {
        targetSkill,
        prerequisites,
        learningChain: rawChain,
        hops,
        hasValidPath,
        courses,
      };
    });

    // Calculate total duration counting each unique course only once
    let totalDurationHours = 0;
    uniqueCoursesMap.forEach((c) => {
      totalDurationHours += c.durationHours || 0;
    });

    const missingSkills = path.map((p) => p.targetSkill);

    return {
      success: true,
      targetJob,
      currentSkills,
      readinessScore,
      requiredSkillCount: requiredSkills.length,
      masteredRequiredSkills,
      missingRequiredSkills,
      missingSkills,
      totalSkills: missingSkills.length,
      totalHops,
      totalDurationHours,
      uniqueCourseCount: uniqueCoursesMap.size,
      totalCourseRecommendations,
      path,
    };
  } finally {
    await session.close();
  }
}

module.exports = {
  calculatePath,
};
