const driver = require('./driver');

async function checkDatabase() {
  try {
    await driver.verifyConnectivity();

    const session = driver.session();

    try {
      const result = await session.run(
        'RETURN 1 AS connected'
      );

      const connected = result.records[0]
        .get('connected')
        .toNumber();

      console.log('✅ CognoDB connection successful');
      console.log(`Database response: ${connected}`);
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('❌ CognoDB connection failed');
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    await driver.close();
  }
}

checkDatabase();