const { celebrate, Joi } = require('celebrate');
const fetch = require('node-fetch');

const ENDPOINT = 'mvf-bundle';
const { MAPPEDIN_API_KEY, MAPPEDIN_API_SECRET } = process.env;

function mvfBundleRoutes(app) {
	app.get(
		`/api/${ENDPOINT}/venue-slug/:venueSlug`,
		celebrate({
			params: {
				venueSlug: Joi.string().required(),
			},
		}),
		async (req, res, next) => {
			const { venueSlug } = req.params;

			try {
				const headers = {
					Authorization:
						'Basic ' +
						Buffer.from(
							MAPPEDIN_API_KEY + ':' + MAPPEDIN_API_SECRET,
						).toString('base64'),
					'Content-Type': 'text/json',
				};

				const MVFBundle = await fetch(
					`https://api-gateway.mappedin.com/exports/mvf/1/bundle?venue=${venueSlug}&version=1.0.0`,
					{
						method: 'GET',
						headers: headers,
					},
				);

				const { url } = await MVFBundle.json();
				return res.status(200).send({ url });
			} catch (err) {
				return next(err);
			}
		},
	);
}

module.exports = mvfBundleRoutes;
