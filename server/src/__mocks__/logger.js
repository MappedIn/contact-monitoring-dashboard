module.exports = {
	configure: jest.fn(),

	name: jest.fn(),
	exitOnError: jest.fn(),
	level: jest.fn(),

	error: jest.fn(),
	warn: jest.fn(),
	info: jest.fn(),
	verbose: jest.fn(),
	debug: jest.fn(),
};
