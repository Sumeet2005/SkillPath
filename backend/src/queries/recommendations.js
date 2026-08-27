const GET_COURSES_BY_SKILL = `
  MATCH (s:Skill {name: $skill})<-[:TEACHES]-(c:Course)
  RETURN
    c.name AS name,
    c.provider AS provider,
    c.level AS level,
    c.duration_hours AS durationHours
  ORDER BY c.duration_hours ASC
`;

module.exports = {
  GET_COURSES_BY_SKILL,
};
