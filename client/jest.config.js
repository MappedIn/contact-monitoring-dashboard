module.exports = {
	name: 'client',
	displayName: 'client',

	collectCoverage: true,

	collectCoverageFrom: ['./src/**/*.js', '!**/*.test.js'],

	coverageDirectory: './coverage',

	coverageReporters: ['text', 'cobertura'],

	moduleDirectories: ['node_modules', 'src'],

	moduleNameMapper: {
		'^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js',
		'^.+\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
	},

	rootDir: __dirname,

	setupFiles: ['./jest.setup.js'],

	testEnvironment: 'jest-environment-jsdom',

	testRegex: ['./src/.*\\.(test)\\.js$'],

	testURL: 'http://localhost',
};
