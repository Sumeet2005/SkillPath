const RECOMMEND_COURSES = `
  MATCH (j:Job {title: $targetJob})-[:REQUIRES]->(required:Skill)
  WHERE NOT required.name IN $currentSkills

  MATCH (c:Course)-[:TEACHES]->(required)

  WITH
    c,
    collect(DISTINCT required.name) AS skillsCovered,
    count(DISTINCT required) AS skillsCoveredCount

  RETURN
    c.name AS course,
    c.provider AS provider,
    c.level AS level,
    c.duration_hours AS durationHours,
    skillsCovered,
    skillsCoveredCount

  ORDER BY skillsCoveredCount DESC, durationHours ASC
`;

module.exports = {
  RECOMMEND_COURSES
};