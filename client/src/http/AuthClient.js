import auth0 from 'auth0-js';
import nanoid from 'nanoid';

class AuthClient {
	accessToken;
	idToken;
	expiresAt;

	constructor({
		audience,
		clientID,
		domain,
		redirectOrigin = window.location.origin,
		redirectPath = '/redirect',
		popupRedirectPath = '/refresh-token',
		checkAuthInterval = 30 * 1000,
	}) {
		this.popupRedirectPath = popupRedirectPath;
		this.redirectPath = redirectPath;
		this.redirectOrigin = redirectOrigin;

		this.popupRedirectUri = `${redirectOrigin}${popupRedirectPath}`;
		this.redirectUri = `${redirectOrigin}${redirectPath}`;

		this.checkAuthInterval = checkAuthInterval;

		this.auth0 = new auth0.WebAuth({
			audience,
			clientID,
			domain,
			redirectUri: this.redirectUri,
			responseType: 'id_token token',
			scope: 'openid profile email',
		});
	}

	getAccessToken() {
		return this.accessToken;
	}

	getExpiresAt() {
		return this.expiresAt;
	}

	getIdToken() {
		return this.idToken;
	}

	async login() {
		try {
			if (window.location.pathname === this.redirectPath) {
				this.handleAuthentication();
			} else if (window.location.pathname === this.popupRedirectPath) {
				this.auth0.popup.callback();
			} else if (!this.isAuthenticated()) {
				await this.checkSession();
			}
		} catch (err) {
			await this.authorize();
		}
	}

	authorize() {
		const [currentUrl] = window.location.href.split('#');
		const stateNonce = nanoid();
		const state = JSON.stringify([
			currentUrl.replace(origin, ''),
			stateNonce,
		]);
		this.auth0.authorize({ state });
	}

	popupAuthorize() {
		return new Promise((resolve, reject) => {
			this.auth0.popup.authorize(
				{
					redirectUri: this.popupRedirectUri,
				},
				(err, authResult) => {
					if (err) {
						return reject(err);
					}

					this.setSession(authResult);
					resolve(authResult);
				},
			);
		});
	}

	checkSession() {
		return new Promise((resolve, reject) => {
			this.auth0.checkSession({}, (err, authResult) => {
				if (err) {
					return reject(err);
				}
				this.setSession(authResult);
				resolve(authResult);
			});
		});
	}

	handleAuthentication() {
		this.auth0.parseHash((err, authResult) => {
			if (err) {
				alert(
					`Error: ${err.error}. Check the console for further details.`,
				);
				return;
			}

			this.setSession(authResult);

			const appState = authResult.state;
			let redirect = JSON.parse(appState);
			redirect = redirect && redirect[0];
			if (redirect) {
				window.history.replaceState('', '', redirect);
			}
		});
	}

	setSession(authResult) {
		// Set the time that the access token will expire at
		const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
		this.accessToken = authResult.accessToken;
		this.idToken = authResult.idToken;
		this.expiresAt = expiresAt;
	}

	logout() {
		// Remove tokens and expiry time
		this.accessToken = null;
		this.idToken = null;
		this.expiresAt = 0;

		this.auth0.logout({ returnTo: this.redirectOrigin });
	}

	async checkAuth() {
		try {
			await this.checkSession();
			this.setTimeout(this.checkAuth, this.checkAuthInterval);
		} catch (err) {
			this.logout();
		}
	}

	isAuthenticated() {
		// Check whether the current time is past the
		// access token's expiry time
		const expiresAt = this.expiresAt;
		return new Date().getTime() < expiresAt;
	}
}

export default AuthClient;
