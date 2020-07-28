require('dotenv-safe').config();
const concurrently = require('concurrently');

concurrently(
	[
		{
			name: 'client',
			prefixColor: 'blue',
			command: 'yarn client dev',
		},
		{
			name: 'server',
			prefixColor: 'green',
			command: 'yarn server dev',
		},
	],
	{
		prefix: 'name',
		restartTries: 3,
	},
);
