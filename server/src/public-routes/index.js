const healthRoutes = require('./health');
const environmentRoute = require('./environment');
const staticRoutes = require('./static');

function publicRoutes(app) {
	healthRoutes(app);
	environmentRoute(app);
	staticRoutes(app);
}

module.exports = publicRoutes;
