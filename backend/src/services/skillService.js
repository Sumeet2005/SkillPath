const { driver } = require("../db/driver");
const { GET_ALL_SKILLS } = require("../queries/skills");

async function getAllSkills() {
  const session = driver.session();
  try {
    const result = await session.run(GET_ALL_SKILLS);
    return result.records.map((record) => ({
      name: record.get("name"),
      category: record.get("category"),
      level: record.get("level"),
    }));
  } finally {
    await session.close();
  }
}

module.exports = {
  getAllSkills,
};
