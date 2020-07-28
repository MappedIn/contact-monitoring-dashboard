const { celebrate, Joi } = require('celebrate');
const ClientError = require('../middleware/error-middleware/client-error');

const Device = require('../models/device');

const ENDPOINT = 'device';

function deviceRoutes(app) {
	app.get(
		`/api/${ENDPOINT}/venue/:venue/search`,
		celebrate({
			params: {
				venue: Joi.string().required(),
			},
			query: {
				search: Joi.string().required(),
			},
		}),
		async (req, res, next) => {
			const { venue } = req.params;
			const { search } = req.query;
			try {
				const query = { venue, $text: { $search: search } };
				const data = await Device()
					.find(query)
					.project({ score: { $meta: 'textScore' } })
					.sort({ score: { $meta: 'textScore' } })
					.limit(10)
					.toArray();

				return res.status(200).send(data);
			} catch (err) {
				return next(err);
			}
		},
	);

	app.get(
		`/api/${ENDPOINT}/venue/:venue/count`,
		celebrate({
			params: {
				venue: Joi.string().required(),
			},
		}),
		async (req, res, next) => {
			const { venue } = req.params;

			try {
				const count = await Device().count({ venue });
				return res.status(200).send({ count });
			} catch (err) {
				return next(err);
			}
		},
	);

	app.get(
		`/api/${ENDPOINT}/venue/:venue`,
		celebrate({
			params: {
				venue: Joi.string().required(),
			},
			query: {
				sort: Joi.string(),
				sortAsc: Joi.boolean(),
				pageSize: Joi.number()
					.min(10)
					.max(100)
					.required(),
				page: Joi.number().required(),
			},
		}),
		async (req, res, next) => {
			const { sort, sortAsc, pageSize, page } = req.query;

			const { venue } = req.params;

			try {
				// get devices
				let cursor = Device().find({ venue });
				if (sort) {
					cursor = cursor.sort(sort, sortAsc ? 1 : -1);
				}

				cursor.skip(pageSize * page);
				cursor.limit(pageSize);
				const devices = await cursor.toArray();
				return res.status(200).send(devices);
			} catch (err) {
				return next(err);
			}
		},
	);

	app.get(
		`/api/${ENDPOINT}/id/:id`,
		celebrate({
			query: {},
			params: {
				id: Joi.string().required(),
			},
		}),
		async (req, res, next) => {
			const { id } = req.params;

			try {
				// get device
				const device = await Device().findOne({ _id: id });
				if (!device) {
					throw new ClientError({
						code: ClientError.Types.NOT_FOUND,
						message: `Could not find device with id: ${id}`,
					});
				}

				return res.status(200).send(device);
			} catch (err) {
				return next(err);
			}
		},
	);

	app.post(
		`/api/${ENDPOINT}/id/:id`,
		// need to use body parser here
		async (req, res, next) => {
			try {
				// do things
				const body = req.body;
				// validate that body is good
				const result = await Device().insertOne(body);
				// result might be different than we expect, need to
				// include option in insert statement to return the
				// newly created object
				return res.status(200).send(result);
			} catch (err) {
				next(err);
			}
		},
	);
}

module.exports = deviceRoutes;
