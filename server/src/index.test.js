jest.mock('./app', () => ({
	startApp: jest.fn(async () => {}),
	stopApp: jest.fn(async () => {}),
}));

jest.mock('http', () => {
	const listen = jest.fn((port, cb) => cb());
	const close = jest.fn((cb) => cb());

	return {
		listen,
		close,
		createServer: jest.fn(() => ({
			listen,
			close,
		})),
	};
});

const http = require('http');

const { startApp, stopApp } = require('./app');

const { onStart, onExit } = require('./index');

describe('index', () => {
	let mockExit;
	beforeAll(() => {
		mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
	});

	afterAll(() => {
		if (mockExit) {
			mockExit.mockRestore();
		}
	});

	describe('onStart', () => {
		test('calls startApp and creates server with it', async () => {
			await onStart();
			expect(startApp).toHaveBeenCalled();
			expect(http.createServer).toHaveBeenCalled();
			expect(http.listen).toHaveBeenCalled();
		});
	});

	describe('onExit', () => {
		test('calls stopApp and process.exit(0)', async () => {
			await onExit();
			expect(stopApp).toHaveBeenCalled();
			expect(process.exit).toHaveBeenCalledWith(0);
		});

		test('calls server close if it was started', async () => {
			// await onStart();
			await onExit();
			expect(stopApp).toHaveBeenCalled();
			expect(process.exit).toHaveBeenCalledWith(0);
			expect(http.close).toHaveBeenCalled();
		});
	});
});
