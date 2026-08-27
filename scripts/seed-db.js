require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
const fs = require('fs');
const path = require('path');
const neo4j = require('neo4j-driver');

async function seedDatabase() {
  const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
  const user = process.env.COGNODB_USER || process.env.COGNODB_USERNAME || process.env.NEO4J_USER;
  const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;

  if (!uri || !user || !password) {
    console.error('Missing CognoDB / Neo4j connection environment variables (COGNODB_URI / NEO4J_URI, etc.).');
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  try {
    console.log('Connecting to CognoDB instance:', uri);
    console.log('Reading seed.cypher script...');
    const cypherContent = fs.readFileSync(path.join(__dirname, 'seed.cypher'), 'utf-8');
    
    // Clean comments and split by semicolon
    const cleanContent = cypherContent
      .split('\n')
      .filter(line => !line.trim().startsWith('//'))
      .join('\n');

    const statements = cleanContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} Cypher statements against CognoDB...`);
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt) {
        await session.run(stmt);
      }
    }
    console.log('✓ CognoDB graph database successfully populated/seeded!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
