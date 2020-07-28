import HttpError from './HttpError';

describe('HttpError class', () => {
	it('Has type HttpError', () => {
		expect(() => {
			throw new HttpError();
		}).toThrowError(HttpError);

		expect(() => {
			throw new HttpError();
		}).toThrowError(Error);
	});

	it('Can have status and text set', () => {
		const err = new HttpError('418', "I'm a teapot");
		expect(err.code).toBe('418');
		expect(err.statusCode).toBe('418');
		expect(err.message).toBe("I'm a teapot");
		expect(err.statusText).toBe("I'm a teapot");
	});

	it('Can take a body argument', () => {
		const err = new HttpError('418', "I'm a teapot");

		const newErr = new HttpError(null, null, { error: err });
		expect(newErr.code).toBe('418');
		expect(newErr.message).toBe("I'm a teapot");
	});

	it('contains a stacktrace', () => {
		const error = new HttpError();
		expect(error.stack).toBeDefined();
	});
});
