function healthRoutes(app) {
	app.get('/health', (req, res) => {
		res.sendStatus(200);
	});
}

module.exports = healthRoutes;
