const GET_ALL_SKILLS = `
  MATCH (s:Skill)
  RETURN
    s.name AS name,
    s.category AS category,
    s.level AS level
  ORDER BY s.category, s.name
`;

module.exports = {
  GET_ALL_SKILLS
};