const ClientError = require('./client-error');

describe('client-error', () => {
	test('has expected types enum', () => {
		expect(ClientError.Types).toMatchSnapshot();
	});

	test('client error has default bad request code and is type Error', () => {
		const clientError = new ClientError();
		expect(clientError instanceof Error).toBe(true);
		expect(clientError.code).toBe(ClientError.Types.BAD_REQUEST);
	});

	test('can override error message and code', () => {
		const clientError = new ClientError({
			code: 100,
			message: 'test error',
		});

		expect(clientError.code).toBe(100);
		expect(clientError.message).toBe('test error');
	});
});
