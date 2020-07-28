module.exports = {
	projects: [
		{
			displayName: 'e2e',
			testEnvironment: 'node',
			testRegex: ['./e2e-tests/tests/.*\\.(test)\\.js$'],
			globalSetup: './setup.js',
		},
		{
			displayName: 'unit',
			testEnvironment: 'node',
			testRegex: ['./src/.*\\.(test)\\.js$'],
			globalSetup: './download-mongo-memory-server.js',
		},
	],

	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.js', '!**/*.test.js'],
	coverageDirectory: './coverage',
	coverageReporters: ['lcov'],

	testPathIgnorePatterns: ['/node-modules/'],
	testTimeout: 10000,

	maxConcurrency: 3,

	rootDir: __dirname,
};
