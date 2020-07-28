const { celebrate, Joi } = require('celebrate');

const ContactEvents = require('../models/contact-event');

const ENDPOINT = 'contact-events';

function contactEventsRoutes(app) {
	app.get(
		`/api/${ENDPOINT}/device/:deviceId/count`,
		celebrate({
			params: {
				deviceId: Joi.string()
					.uuid()
					.required(),
			},
		}),
		async (req, res, next) => {
			const { deviceId } = req.params;

			try {
				const count = await ContactEvents.count({ devices: deviceId });
				return res.status(200).send({ count });
			} catch (err) {
				return next(err);
			}
		},
	);

	app.get(
		`/api/${ENDPOINT}/device/:deviceId`,
		celebrate({
			params: {
				deviceId: Joi.string()
					.uuid()
					.required(),
			},
			query: {
				start: Joi.date().required(),
				end: Joi.date().required(),
				minDuration: Joi.number().default(5),
				sort: Joi.string(),
				sortAsc: Joi.boolean(),
				// pageSize: Joi.number()`
				// 	.min(10)
				// 	.max(100),
				// page: Joi.number(),
			},
		}),
		async (req, res, next) => {
			const {
				sort,
				sortAsc,
				// pageSize,
				// page,
				start,
				end,
				minDuration,
			} = req.query;

			const { deviceId } = req.params;

			try {
				// get devices
				const query = {
					devices: deviceId,
					duration: { $gte: minDuration },
					$and: [
						// we need to make sure start and end are dates
						// then we get the epoch millisecond timestamp from them
						// and devide by 60000 to get the minute bucket
						{
							start: {
								$gte: Math.round(
									new Date(start).valueOf() / 60000,
								),
							},
						},
						{
							end: {
								$lte: Math.round(
									new Date(end).valueOf() / 60000,
								),
							},
						},
					],
				};
				let cursor = ContactEvents()
					.find(query)
					.project({
						_id: 1,
						devices: 1,
						start: 1,
						end: 1,
						duration: 1,
						firstcontact: 1,
						mindistance: 1,
						maxdistance: 1,
					});

				if (sort) {
					cursor = cursor.sort(sort, sortAsc ? 1 : -1);
				}

				// cursor.skip(pageSize * page);
				// cursor.limit(pageSize);
				const devices = await cursor.toArray();
				return res.status(200).send(devices);
			} catch (err) {
				return next(err);
			}
		},
	);
}

module.exports = contactEventsRoutes;
