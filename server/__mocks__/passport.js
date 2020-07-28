module.exports.authenticate = jest.fn().mockImplementation(() => {
	return (req, res, next) => {
		req.user = {
			id: 'user-id',
			apps: [{ id: 'app1', name: 'Application One' }],
			authz: {
				subjectType: 'user',
				subject: {
					name: 'user name',
					email: 'user email',
				},
				roles: [{ role: 'basic' }],
			},
		};

		next();
	};
});

module.exports.use = jest.fn();

module.exports.initialize = jest.fn().mockImplementation(() => {
	return (req, res, next) => {
		next();
	};
});
