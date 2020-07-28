jest.mock('../../logger');

const logger = require('../../logger');
const { celebrate, Joi } = require('celebrate');
const express = require('express');
const supertest = require('supertest');

const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');

describe('error middleware', () => {
	describe('basic cases without express', () => {
		test('calls next when there error is falsey', () => {
			const next = jest.fn();
			errorMiddleware(null, null, null, next);
			expect(next).toHaveBeenCalledWith();
		});
	});

	describe('tests using express', () => {
		let app;
		const clientError = new ClientError({
			code: ClientError.Types.CONFLICT,
			message: 'client error',
		});

		beforeAll(() => {
			app = express();
			app.get(
				'/celebrate-error',
				celebrate({
					query: Joi.object().keys({
						key: Joi.string().required(),
					}),
				}),
				(req, res) => {
					res.sendStatus(204);
				},
			);

			app.get('/client-error', () => {
				throw clientError;
			});

			app.get('/unknown-error', () => {
				throw new Error();
			});

			app.use(errorMiddleware);
		});

		test('calls logger.error with the error', async () => {
			await supertest(app)
				.get('/client-error')
				.expect(ClientError.Types.CONFLICT);

			expect(logger.error).toHaveBeenCalledWith(clientError);
		});

		test('captures ClientError', async () => {
			const response = await supertest(app)
				.get('/client-error')
				.expect(ClientError.Types.CONFLICT);

			expect(response.text).toMatchSnapshot();
		});

		test('captures celebrate error', async () => {
			const response = await supertest(app)
				.get('/celebrate-error')
				.expect(400);

			expect(response.text).toMatchSnapshot();
		});

		test('captures unexpected error', async () => {
			const response = await supertest(app)
				.get('/unknown-error')
				.expect(500);

			expect(response.text).toMatchSnapshot();
		});
	});
});
