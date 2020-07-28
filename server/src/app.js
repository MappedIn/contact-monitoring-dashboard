const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./logger');
const errorMiddleware = require('./middleware/error-middleware/error-middleware');
const protectedRoutes = require('./protected-routes');
const publicRoutes = require('./public-routes');
const mongo = require('./lib/mongo');

/**
 * startApp is called when the service is starting. put all
 * initialization logic in here to connect to other services
 * or resources like databases in here.
 *
 * @return {Express app instance} - an instance of an express app
 */
async function startApp({ connectionString } = {}) {
	const app = express();
	await mongo.init({
		connectionString: connectionString || process.env.MONGO_CONNECTION_URL,
	});

	app.set('trust proxy', true);
	app.use(compression());
	app.use(helmet());
	app.use(morgan('combined', { stream: logger.stream }));

	protectedRoutes(app);
	publicRoutes(app);

	app.use(errorMiddleware);

	return app;
}

/**
 * stopApp is called when the server is quitting. Put all logic
 * to close connections with other services or resources here.
 *
 * @return {Promise<>} - a promise that resolves once the app has stopped
 */
async function stopApp() {
	await Promise.all([mongo.close()]);
}

exports.startApp = startApp;
exports.stopApp = stopApp;
