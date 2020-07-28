process.env.npm_package_version = 'npm_package_version';

const supertest = require('supertest');
const express = require('express');
const environmentRoutes = require('./environment');

describe('/environment', () => {
	let app;
	beforeAll(() => {
		app = express();
		environmentRoutes(app);
	});

	test('returns 200', async () => {
		const response = await supertest(app)
			.get('/environment')
			.expect('Cache-Control', 'private, must-revalidate')
			.expect('Content-Type', 'application/javascript; charset=utf-8')
			.expect(200);

		expect(response.text).toMatchSnapshot();
	});
});
