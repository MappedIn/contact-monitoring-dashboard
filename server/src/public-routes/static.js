const express = require('express');
const path = require('path');

const DEFAULT_STATIC_DIR = path.resolve(__dirname, '../../client/dist');
function staticRoutes(app, staticDir = DEFAULT_STATIC_DIR) {
	const staticOptions = {
		maxAge: 7 * 24 * 60 * 60 * 1000, // one week,
		immutable: true,
	};

	app.use('/__dist__', express.static(staticDir, staticOptions));

	const index = path.resolve(staticDir, 'index.html');

	app.get('*', (req, res) => {
		res.set('Cache-Control', 'private, must-revalidate');
		res.sendFile(index);
	});
}

module.exports = staticRoutes;
