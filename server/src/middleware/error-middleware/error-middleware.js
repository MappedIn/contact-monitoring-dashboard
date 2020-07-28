const { isCelebrate } = require('celebrate');
const ClientError = require('./client-error');
const logger = require('../../logger');

function errorMiddleware(error, req, res, next) {
	if (error) {
		logger.error(error);

		if (error instanceof ClientError) {
			let statusCode = error.code;
			if (!Number.isInteger(statusCode)) {
				statusCode = 400;
			}

			return res.status(statusCode).json({
				error: {
					code: error.code,
					message: error.message,
				},
			});
		} else if (isCelebrate(error)) {
			return res.status(400).json({
				error,
			});
		} else {
			return res.status(500).json({
				error: {
					code: 500,
					message: 'A server error has occured',
				},
			});
		}
	} else {
		next();
	}
}

exports = module.exports = errorMiddleware;
