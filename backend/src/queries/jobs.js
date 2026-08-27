const GET_ALL_JOBS = `
  MATCH (j:Job)
  OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
  RETURN
    j.title AS title,
    j.level AS level,
    j.industry AS industry,
    collect(s.name) AS requiredSkills
  ORDER BY j.title
`;

module.exports = {
  GET_ALL_JOBS
};