const http = require('http');
const { startApp, stopApp } = require('./app');
const logger = require('./logger');

const mode = process.env.NODE_ENV;
const port = parseInt(process.env.PORT) + (mode === 'development' ? 1 : 0);

let server = null;

async function onExit() {
	if (server) {
		await new Promise((r) => server.close(r));
	}

	await stopApp();
	process.exit(0);
}

async function onStart() {
	try {
		const app = await startApp();

		server = http.createServer(app);

		await new Promise((res, rej) =>
			server.listen(port, (err) => (err ? rej(err) : res())),
		);

		logger.info('Started the Contact Monitoring App server');
		logger.info(`mode: ${mode} - port: ${port}`);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
}

module.exports = {
	onExit,
	onStart,
};

process.on('SIGINT', onExit);
onStart();
