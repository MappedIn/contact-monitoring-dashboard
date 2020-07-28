import Url from 'url';
import HttpError from './HttpError';

export class Request {
	constructor(client, method, path, query = {}, body) {
		this.client = client;
		this.method = method;
		this.path = path;
		this.query = query;
		this.body = body;
	}

	exec() {
		const url = this.client.formatUrl(this.path, this.query);

		return this.client.exec(this.method, url, this.body);
	}
}

class ApiClient {
	constructor({ authClient } = {}) {
		this.authClient = authClient;
	}

	formatUrl(pathname, query) {
		return Url.format({ pathname, query });
	}

	async filterSuccess(res) {
		if (res.status >= 200 && res.status < 300) {
			return res;
		}

		const body = await this.parseJSON(res);
		throw new HttpError(res.status, res.statusText, body);
	}

	parseJSON(res) {
		return res.status === 204 ? null : res.json();
	}

	async exec(method, url, body) {
		const res = await this.getReq(method, url, body);
		return this.parseJSON(res);
	}

	getAuthorizationHeader() {
		return `Bearer ${this.authClient.getAccessToken()}`;
	}

	async getReq(method, url, body, triedOnce) {
		if (!this.authClient.isAuthenticated()) {
			try {
				await this.authClient.checkSession();
			} catch (err) {
				await this.authClient.popupAuthorize();
			}
		}

		const options = {
			method,
			headers: {
				Accept: 'application/json',
				Authorization: this.getAuthorizationHeader(),
			},
		};

		if (body instanceof FormData) {
			options.body = body;
		} else if (body != null) {
			options.headers['Content-Type'] = 'application/json';
			options.body = JSON.stringify(body);
		}

		const res = await fetch(url, options);

		if (res.status !== 401 || triedOnce) {
			return this.filterSuccess(res);
		}
	}

	get(path, query) {
		return new Request(this, 'get', path, query);
	}

	post(path, body) {
		return new Request(this, 'post', path, undefined, body);
	}

	put(path, body) {
		return new Request(this, 'put', path, undefined, body);
	}

	del(path, body) {
		return new Request(this, 'delete', path, undefined, body);
	}

	options(path, args) {
		return new Request(this, 'options', path, args);
	}
}

export default ApiClient;
