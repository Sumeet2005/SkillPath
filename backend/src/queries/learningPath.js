const FIND_LEARNING_PATH = `
  MATCH (j:Job {title: $targetJob})-[:REQUIRES]->(target:Skill)
  WHERE NOT target.name IN $currentSkills

  OPTIONAL MATCH pKnown = shortestPath((start:Skill)-[:PREREQUISITE_OF*1..10]->(target))
  WHERE start.name IN $currentSkills

  OPTIONAL MATCH pRoot = shortestPath((root:Skill)-[:PREREQUISITE_OF*1..10]->(target))
  WHERE NOT ()-[:PREREQUISITE_OF]->(root) AND NOT root.name IN $currentSkills

  OPTIONAL MATCH (anyPrereq:Skill)-[:PREREQUISITE_OF]->(target)

  WITH target,
       anyPrereq IS NOT NULL AS hasPrereqs,
       CASE 
         WHEN pKnown IS NOT NULL THEN pKnown 
         WHEN pRoot IS NOT NULL THEN pRoot
         ELSE NULL 
       END AS path

  WITH target, hasPrereqs, path
  ORDER BY CASE WHEN path IS NOT NULL THEN length(path) ELSE 999 END ASC

  WITH target, hasPrereqs, head(collect(path)) AS bestPath

  OPTIONAL MATCH (course:Course)-[:TEACHES]->(target)

  RETURN
    target.name AS targetSkill,
    hasPrereqs,
    CASE 
      WHEN bestPath IS NOT NULL THEN [n IN nodes(bestPath) | n.name]
      ELSE [target.name]
    END AS learningChain,
    CASE 
      WHEN bestPath IS NOT NULL THEN length(bestPath)
      ELSE 0
    END AS hops,
    collect(DISTINCT {
      name: course.name,
      provider: course.provider,
      durationHours: course.duration_hours,
      level: course.level
    }) AS courses
  ORDER BY hops ASC, targetSkill
`;

const CHECK_JOB_EXISTS = `
  MATCH (j:Job {title: $targetJob})
  RETURN j.title AS title
`;

const GET_JOB_REQUIREMENTS = `
  MATCH (j:Job {title: $targetJob})-[:REQUIRES]->(s:Skill)
  RETURN collect(s.name) AS requiredSkills
`;

const CHECK_SKILLS_EXIST = `
  MATCH (s:Skill)
  WHERE s.name IN $currentSkills
  RETURN collect(s.name) AS existingSkills
`;

module.exports = {
  FIND_LEARNING_PATH,
  CHECK_JOB_EXISTS,
  GET_JOB_REQUIREMENTS,
  CHECK_SKILLS_EXIST
};