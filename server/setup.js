const downloadMMS = require('./download-mongo-memory-server');
module.exports = async () => {
	await downloadMMS();

	process.env.NODE_ENV = 'test';

	process.env.AUTH0_AUDIENCE = 'test_AUTH0_AUDIENCE';
	process.env.AUTH0_CLIENT_ID = 'test_auth0_client_id';
	process.env.AUTH0_CONNECTION = 'test_auth0_connection';
	process.env.AUTH0_DOMAIN = 'test_auth0_domain';
	process.env.APP_HOST = 'test_app_host';
	process.env.APP_NAME = 'test_app_name';
	process.env.npm_package_version = 'test_npm_package_version';
};
