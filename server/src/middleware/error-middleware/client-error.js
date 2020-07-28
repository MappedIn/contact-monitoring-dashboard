const Types = {
	BAD_REQUEST: 400,
	CONFLICT: 409,
	FORBIDDEN: 403,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	NOT_FOUND: 404,
	UNAUTHORIZED: 401,
	UNPROCESSABLE_ENTITY: 422,
};

class ClientError extends Error {
	static get Types() {
		return Types;
	}

	constructor({ code = Types.BAD_REQUEST, message } = {}) {
		super(message);
		this.code = code;
	}
}

exports = module.exports = ClientError;
