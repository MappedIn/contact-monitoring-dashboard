import './polyfill';
import auth from 'http/authInstance';

async function continueToApp() {
	const main = await import('main');
	main.default();
}

(async () => {
	try {
		await auth.login();
	} catch (err) {
		return auth.logout();
	}

	await continueToApp();
})();
