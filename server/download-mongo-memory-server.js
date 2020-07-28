const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
	/**
	 * We are starting and stopping a mongodb memory server
	 * because we want to force it to download the version
	 * of mongodb that it is supposed to run. If we don't
	 * create a new MongoMemoryServer here before running the
	 * tests, the tests will fail as they attempt to run tests
	 * and wait for parallel mongo memory server binaries to
	 * download.
	 */
	const mongod = new MongoMemoryServer();
	await mongod.getConnectionString();
	await mongod.stop();
};
