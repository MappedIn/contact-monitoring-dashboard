import ApiClient from './ApiClient';
import authClient from './authInstance';

const apiSingleton = new ApiClient({
	authClient,
});

export default apiSingleton;

global.api = apiSingleton;
