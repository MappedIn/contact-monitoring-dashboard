function environmentRoute(app) {
	const environment = `window.MI = ${JSON.stringify({
		auth: {
			auth0Aud: process.env.AUTH0_AUDIENCE,
			auth0ClientId: process.env.AUTH0_CLIENT_ID,
			auth0Domain: process.env.AUTH0_DOMAIN,
		},
		hosts: {
			web: process.env.APP_HOST,
		},
		appName: process.env.APP_NAME,
		version: process.env.npm_package_version,
		mappedinVenueSlug: process.env.MAPPEDIN_VENUE_SLUG,
		mappedinVenueSlugs:
			process.env.MAPPEDIN_VENUE_SLUGS &&
			process.env.MAPPEDIN_VENUE_SLUGS.split(','),
	})};`;

	app.get('/environment', (req, res) => {
		res.set('Cache-Control', 'private, must-revalidate');
		res.set('Content-Type', 'application/javascript; charset=utf-8');
		res.status(200).send(environment);
	});
}

module.exports = environmentRoute;
