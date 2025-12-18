import { test, expect } from '@jest/globals';
import { API, DEFAULT_DEV_BASE_URL } from '../../src';

const testBasicUser = {
	username: process.env.TEST_USER_USERNAME ?? '',
	password: process.env.TEST_USER_PASSWORD ?? ''
};

/*
 ** API Class Tests
 */

test('Get the API endpoint generated from the construction arguments', () => {
	const path = '/api/x_flowm_mobile/oauth';
	const api = new API(path);
	expect(api.route()).toBe(DEFAULT_DEV_BASE_URL + path);
});

test('Perform an example unauthorized GET request to an incorrect URL', async () => {
	const incorrectUrl = 'https://random_servicenow_address.service-now.com';
	const api = new API('/api/x_flowm_mobile/oauth', incorrectUrl);

	const response = await api.get('/login');
	expect(response.status).toBe(-3008);
	expect(response.statusText).toBe('ENOTFOUND');
});

test('Perform an example POST request to a 405 address', async () => {
	const api = new API('/api/x_flowm_mobile/core');
	const response = await api.post('/ping', {});
	expect(response.status).toBe(405);
});

test('Perform an example GET request to FlowMotionDev', async () => {
	const api = new API('/api/x_flowm_mobile/core');
	const response = await api.get('/ping');
	expect(response.status).toBe(200);
});

test('Perform an example unauthorized GET request to FlowMotionDev', async () => {
	const api = new API('/api/x_flowm_mobile/oauth');
	const response = await api.get('/login');
	expect(response.status).toBe(401);
});

test('Perform an example authorized GET request to FlowMotionDev with Basic Auth', async () => {
	const api = new API('/api/x_flowm_mobile/oauth');
	api.setAuth(testBasicUser);

	const response = await api.get('/login');
	expect(response.status).toBe(200);
});
