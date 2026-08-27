const { driver } = require("../db/driver");
const { GET_COURSES_BY_SKILL } = require("../queries/recommendations");

async function getCoursesBySkill(skillName) {
  if (!skillName || typeof skillName !== "string" || !skillName.trim()) {
    const err = new Error("skill query parameter is required and must be a non-empty string.");
    err.statusCode = 400;
    throw err;
  }

  const session = driver.session();
  try {
    const result = await session.run(GET_COURSES_BY_SKILL, { skill: skillName.trim() });
    return result.records.map((record) => {
      const dur = record.get("durationHours");
      const hours = dur && typeof dur.toNumber === "function" ? dur.toNumber() : dur || 0;

      return {
        name: record.get("name"),
        provider: record.get("provider"),
        level: record.get("level"),
        durationHours: hours,
      };
    });
  } finally {
    await session.close();
  }
}

module.exports = {
  getCoursesBySkill,
};
