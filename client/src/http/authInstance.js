import config from 'config';
import AuthClient from './AuthClient';

const { origin } = window.location;
const SSL = config.hosts.web.indexOf('https') !== -1;

const authSingleton = new AuthClient({
	audience: config.auth.auth0Aud,
	clientID: config.auth.auth0ClientId,
	domain: config.auth.auth0Domain,
	redirectOrigin: SSL ? origin.replace('http://', 'https://') : origin,
});

export default authSingleton;
