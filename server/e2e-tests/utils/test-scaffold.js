const { MongoMemoryServer } = require('mongodb-memory-server');
const { startApp, stopApp } = require('../../src/app');

const { resetDB, getClient } = require('./reset-db');

module.exports = async () => {
	const mongod = new MongoMemoryServer();
	const connectionString = await mongod.getConnectionString();

	const app = await startApp({ connectionString });

	return {
		app,
		resetDB: (data) => {
			return resetDB(connectionString, data);
		},
		getDBClient: () => {
			return getClient(connectionString);
		},
		getDB: async () => {
			const client = await getClient(connectionString);
			return client.db();
		},
		stop: async () => {
			await stopApp();
			await mongod.stop();
		},
	};
};
