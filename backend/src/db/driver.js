const neo4j = require('neo4j-driver');
const config = require('../config/env');

const driver = neo4j.driver(
  config.neo4jUri,
  neo4j.auth.basic(
    config.neo4jUser,
    config.neo4jPassword
  )
);

async function checkDatabaseConnection() {
  const session = driver.session();
  try {
    const result = await session.run('RETURN 1 AS connected');
    return result.records.length > 0;
  } catch (err) {
    console.error('Database connection error:', err.message);
    return false;
  } finally {
    await session.close();
  }
}

module.exports = {
  driver,
  checkDatabaseConnection,
};