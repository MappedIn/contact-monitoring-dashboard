function HttpError(statusCode, statusText, body) {
	this.name = 'HttpError';
	this.code = (body && body.error && body.error.code) || statusCode;
	this.message = (body && body.error && body.error.message) || statusText;
	this.stack = Error().stack;
	this.statusCode = statusCode;
	this.statusText = statusText;
	this.body = body;
}

HttpError.prototype = new Error();
HttpError.prototype.constructor = HttpError;

export default HttpError;
