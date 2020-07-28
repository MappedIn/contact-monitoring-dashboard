const supertest = require('supertest');
const express = require('express');
const staticRoutes = require('./static');

describe('/static', () => {
	let app;
	beforeAll(() => {
		app = express();
		staticRoutes(app, __dirname);
	});

	test('returns 200', async () => {
		const response = await supertest(app)
			.get('/__dist__/static.js')
			.expect(200);

		expect(response.status).toBe(200);
	});
});
