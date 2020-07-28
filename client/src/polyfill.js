import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

if (!window.location.origin) {
	const { protocol, hostname, port } = window.location;
	window.location.origin = `${protocol}//${hostname}${
		port ? `:${port}` : ''
	}`;
}
