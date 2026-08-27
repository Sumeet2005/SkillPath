require('dotenv').config();

const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
const user = process.env.COGNODB_USER || process.env.COGNODB_USERNAME || process.env.NEO4J_USER;
const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  throw new Error('Missing required environment variables for CognoDB/Neo4j database connection (COGNODB_URI / NEO4J_URI, COGNODB_USER / NEO4J_USER, COGNODB_PASSWORD / NEO4J_PASSWORD).');
}

module.exports = {
  neo4jUri: uri,
  neo4jUser: user,
  neo4jPassword: password,
  port: Number(process.env.PORT || 5000),
};