const { MongoClient } = require('mongodb');

exports = module.exports = {};

exports.getClient = async (connectionString) => {
	const client = new MongoClient(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	await client.connect();
	return client;
};

exports.resetDB = async (connectionString, data = {}, dbName) => {
	const client = await exports.getClient(connectionString);
	const db = client.db(dbName);

	// drop our test data before creating initial data state
	await db.dropDatabase();
	for (const name in data) {
		const rows = data[name];
		await db.collection(name).insertMany(rows);
	}

	await client.close();
};
