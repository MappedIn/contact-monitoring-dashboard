const winston = require('winston');

const options = {
	file: {
		level: 'info',
		filename: `${process.cwd()}/logs/app.log`,
		handleExceptions: true,
		json: false,
		prettyPrint: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true,
	},
};

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(options.console),
		new winston.transports.File(options.file),
	],
});

logger.stream = {
	write: function(message) {
		logger.info(message);
	},
};

module.exports = logger;
