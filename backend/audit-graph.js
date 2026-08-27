require('dotenv').config();
const driver = require('./src/db/driver');

async function auditGraph() {
  const session = driver.session();
  console.log('========================================');
  console.log('RUNNING NEO4J GRAPH INTEGRITY AUDIT');
  console.log('========================================\n');

  try {
    // 1. Check for Duplicate Relationships
    const dupes = await session.run(`
      MATCH (a:Skill)-[r:PREREQUISITE_OF]->(b:Skill)
      WITH a.name AS from, b.name AS to, count(r) AS relCount
      WHERE relCount > 1
      RETURN from, to, relCount
    `);
    console.log(`[Audit 1] Duplicate Relationships: ${dupes.records.length}`);
    dupes.records.forEach(r => console.log(`  DUPLICATE: ${r.get('from')} -> ${r.get('to')} (count: ${r.get('relCount')})`));

    // 2. Check for Cycles
    const cycles = await session.run(`
      MATCH p = (s:Skill)-[:PREREQUISITE_OF*1..10]->(s:Skill)
      RETURN [n IN nodes(p) | n.name] AS cycle
    `);
    console.log(`\n[Audit 2] Graph Cycles: ${cycles.records.length}`);
    cycles.records.forEach(r => console.log(`  CYCLE DETECTED: ${r.get('cycle').join(' -> ')}`));

    // 3. Check Course Coverage for All Skills
    const unmappedSkills = await session.run(`
      MATCH (s:Skill)
      OPTIONAL MATCH (c:Course)-[:TEACHES]->(s)
      WITH s, collect(c) AS courses
      WHERE size(courses) = 0
      RETURN s.name AS skillName, s.category AS category
    `);
    console.log(`\n[Audit 3] Skills Without Courses: ${unmappedSkills.records.length}`);
    unmappedSkills.records.forEach(r => console.log(`  MISSING COURSE: ${r.get('skillName')} (${r.get('category')})`));

    // 4. Check Job Skills & Requirements
    const jobs = await session.run(`
      MATCH (j:Job)
      OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
      WITH j, collect(s) AS requiredSkills
      RETURN j.title AS job, size(requiredSkills) AS skillCount, [s IN requiredSkills | s.name] AS skills
    `);
    console.log(`\n[Audit 4] Job Requirements Audit (${jobs.records.length} Jobs):`);
    jobs.records.forEach(r => {
      console.log(`  ${r.get('job')} (${r.get('skillCount')} skills): [${r.get('skills').join(', ')}]`);
    });

  } catch(e) {
    console.error('Audit Error:', e);
  } finally {
    await session.close();
    await driver.close();
  }
}

auditGraph();
