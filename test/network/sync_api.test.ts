import { test, expect } from '@jest/globals';
import { DEFAULT_DEV_BASE_URL, DEFAULT_SYNC_URL, SyncAPI } from '../../src';

const testBasicUser = {
	username: process.env.TEST_USER_USERNAME ?? '',
	password: process.env.TEST_USER_PASSWORD ?? ''
};

/*
 ** Table API Class Tests
 */

const testApplication = process.env.TEST_DEV_APPLICATION || '';

test('Get the Sync API endpoint generated from the construction arguments', () => {
	const syncApi = new SyncAPI(testBasicUser);
	expect(syncApi.route()).toBe(DEFAULT_DEV_BASE_URL + DEFAULT_SYNC_URL);
});

test('Perform an example Application Config request to flowmotiondev', async () => {
	const syncApi = new SyncAPI(testBasicUser);
	const response = await syncApi.getConfig(testApplication);
	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
	expect(response.data).toHaveProperty('checksum');
	expect(response.data).toHaveProperty('data');
});

test('Perform an example Application Config Checksum request to flowmotiondev', async () => {
	const syncApi = new SyncAPI(testBasicUser);
	const response = await syncApi.getConfigChecksum(testApplication);
	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
	expect(response.data).toHaveProperty('checksum');
});

test('Perform an example Application Data request to flowmotiondev', async () => {
	const syncApi = new SyncAPI(testBasicUser);
	const configResponse = await syncApi.getConfig(testApplication);
	expect(configResponse.status).toBe(200);
	expect(configResponse.data).toBeDefined();

	if (!configResponse.data) {
		return;
	}

	const config = configResponse.data.data;
	const response = await syncApi.getData(config);
	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
});

test('Perform an example Application Data Checksum request to flowmotiondev', async () => {
	const syncApi = new SyncAPI(testBasicUser);
	const response = await syncApi.getDataChecksum(testApplication);
	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
});
