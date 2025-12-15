import { test, expect } from '@jest/globals';
import { TableAPI } from '../../src';

const testBasicUser = {
	username: process.env.TEST_USER_USERNAME ?? '',
	password: process.env.TEST_USER_PASSWORD ?? ''
};

/*
 ** Table API Class Tests
 */

const testTable = process.env.TEST_DEV_TABLE || '';
const testSysId = process.env.TEST_DEV_SYS_ID || '';

test('TableAPI: getRecords returns records array', async () => {
	const tableApi = new TableAPI(testBasicUser);
	const response = await tableApi.getRecords(testTable, { sysparm_limit: 2 });

	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
	expect(response.data).toBeInstanceOf(Array);

	if (!response.data || !Array.isArray(response.data)) {
		return;
	}

	expect(response.data.length).toBe(2);
});

test('TableAPI: getRecord returns a single record', async () => {
	const tableApi = new TableAPI(testBasicUser);
	const response = await tableApi.getRecord(testTable, testSysId);

	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();

	if (!response.data) {
		return;
	}

	expect(response.data.sys_id).toBe(testSysId);
});

describe('TableAPI: Perform an patch then put', () => {
	const tableApi = new TableAPI(testBasicUser);

	it('TableAPI: patchRecord updates a record', async () => {
		const update = { time_zone: 'Europe/Paris' };
		const response = await tableApi.patchRecord(testTable, testSysId, update);

		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();

		if (!response.data) {
			return;
		}

		expect(response.data['time_zone']).toBe(update.time_zone);
	});

	it('TableAPI: putRecord replaces a record', async () => {
		const update = { time_zone: 'Europe/London' };
		const response = await tableApi.putRecord(testTable, testSysId, update);

		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();

		if (!response.data) {
			return;
		}

		expect(response.data['time_zone']).toBe(update.time_zone);
	});
});

describe('TableAPI: Perform Post then Delete', () => {
	let newlyCreatedRecord = '';
	const creationTable = process.env.TEST_CREATION_TABLE || '';
	const tableApi = new TableAPI(testBasicUser);

	it('TableAPI: postRecord creates a new record', async () => {
		const response = await tableApi.postRecord(creationTable, {});
		expect([200, 201]).toContain(response.status);
		expect(response.data).toBeDefined();

		if (!response.data) {
			return;
		}

		newlyCreatedRecord = response.data.sys_id;
	});

	it('TableAPI: deleteRecord deletes a record', async () => {
		const response = await tableApi.deleteRecord(creationTable, newlyCreatedRecord);
		expect([200, 204]).toContain(response.status);
		expect(response.data).toBeUndefined();
	});
});
