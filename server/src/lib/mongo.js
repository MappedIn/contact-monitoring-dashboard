'use strict';

const { MongoClient } = require('mongodb');

const internals = {
	client: null,
};

function getClient() {
	if (internals.client == null) {
		throw new Error('Mongo.init must be invoked before usage');
	}

	return internals.client;
}

function getConnection() {
	if (internals.client == null || internals.client.db == null) {
		throw new Error('Mongo.init must be invoked before usage');
	}

	return internals.client.db();
}

async function insideTransaction(func) {
	const session = getClient().startSession({
		readPreference: { mode: 'primary' },
	});

	session.startTransaction({
		readConcern: { level: 'snapshot' },
		writeConcern: { w: 'majority' },
	});

	try {
		const result = await func(session);
		session.commitTransaction();
		return result;
	} catch (err) {
		session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

async function init({ connectionString }) {
	const client = new MongoClient(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	internals.client = client;
}

async function close() {
	if (internals.client) {
		await internals.client.close();
	}
}

exports = module.exports = {
	close,
	getClient,
	getConnection,
	insideTransaction,
	init,
};
