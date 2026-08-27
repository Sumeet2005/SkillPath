require('dotenv').config();
const driver = require('./src/db/driver');

async function testPath(targetJob, currentSkills) {
  const session = driver.session();
  console.log('\n========================================');
  console.log('TEST Target Job:', targetJob, '| Known Skills:', currentSkills);
  console.log('========================================');

  const query = `
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

  try {
    const result = await session.run(query, { targetJob, currentSkills });
    if (result.records.length === 0) {
      console.log('No missing target skills or job not found!');
      return;
    }

    result.records.forEach(r => {
      const targetSkill = r.get('targetSkill');
      const hasPrereqs = r.get('hasPrereqs');
      const learningChain = r.get('learningChain');
      const hops = r.get('hops').toNumber ? r.get('hops').toNumber() : r.get('hops');
      const courses = r.get('courses').map(c => c.name).filter(Boolean);
      const prerequisites = learningChain.filter(s => s !== targetSkill);
      const hasValidPath = !hasPrereqs || learningChain.length > 1 || hops === 0;

      console.log({
        targetSkill,
        prerequisites,
        learningChain,
        hops,
        hasValidPath,
        coursesCount: courses.length
      });
    });
  } catch(err) {
    console.error('Query Error:', err);
  } finally {
    await session.close();
  }
}

async function run() {
  try {
    console.log('--- GENERATIVE AI ENGINEER ---');
    await testPath('Generative AI Engineer', ['Python']);
    await testPath('Generative AI Engineer', ['Python', 'Machine Learning']);
    await testPath('Generative AI Engineer', ['Python', 'Machine Learning', 'Deep Learning']);

    console.log('--- BACKEND DEVELOPER ---');
    await testPath('Backend Developer', ['Python']);
    await testPath('Backend Developer', ['Python', 'Git']);
    await testPath('Backend Developer', ['Python', 'Git', 'SQL']);

    console.log('--- FRONTEND DEVELOPER ---');
    await testPath('Frontend Developer', ['HTML', 'CSS']);
    await testPath('Frontend Developer', ['HTML', 'CSS', 'JavaScript']);
  } finally {
    await driver.close();
  }
}

run();
