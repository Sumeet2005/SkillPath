const { driver } = require("../db/driver");
const { GET_ALL_JOBS } = require("../queries/jobs");

async function getAllJobs() {
  const session = driver.session();
  try {
    const result = await session.run(GET_ALL_JOBS);
    return result.records.map((record) => ({
      title: record.get("title"),
      level: record.get("level"),
      industry: record.get("industry"),
      requiredSkills: record.get("requiredSkills") || [],
    }));
  } finally {
    await session.close();
  }
}

module.exports = {
  getAllJobs,
};
