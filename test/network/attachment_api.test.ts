import { test, expect } from '@jest/globals';
import { AttachmentAPI } from '../../src';

const testBasicUser = {
	username: process.env.TEST_USER_USERNAME ?? '',
	password: process.env.TEST_USER_PASSWORD ?? ''
};

/*
 ** Attachment API Class Tests
 */

const testSysId = 'a11589fd2b8a7650be32f1bece91bf6e';
const testTable = process.env.TEST_DEV_TABLE || '';
const testAttachSysId = '59a2f54f2b713610be32f1bece91bf73';

test('AttachmentAPI: getRecords returns a single record', async () => {
	const attachmentApi = new AttachmentAPI(testBasicUser);
	const response = await attachmentApi.getRecord(testSysId);

	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();

	if (!response.data) {
		return;
	}

	expect(response.data.sys_id).toBe(testSysId);
});

test('AttachmentAPI: getRecords returns an attachments array', async () => {
	const limit = 2;
	const attachmentApi = new AttachmentAPI(testBasicUser);
	const response = await attachmentApi.getRecords({ sysparm_limit: limit });

	expect(response.status).toBe(200);
	expect(response.data).toBeDefined();
	expect(response.data).toBeInstanceOf(Array);

	if (!response.data || !Array.isArray(response.data)) {
		return;
	}

	expect(response.data.length).toBe(limit);
});

describe('AttachmentAPI: Perform Post then Delete', () => {
	let newlyCreatedRecord = '';
	const attachmentApi = new AttachmentAPI(testBasicUser);

	it('AttachmentAPI: postAttachment uploads a file successfully', async () => {
		const fileContent = 'Hello World!';
		const fileName = `attachment_api_post_test_${Date.now()}.txt`;
		const blob = new Blob([fileContent], { type: 'text/plain' });

		const response = await attachmentApi.postAttachment(testTable, testAttachSysId, fileName, blob);

		expect(response.status).toBe(201);
		expect(response.data).toBeDefined();

		if (!response.data) {
			return;
		}

		expect(response.data.file_name).toBe(fileName);
		expect(response.data.table_name).toBe('sys_user');

		newlyCreatedRecord = response.data.sys_id;
	});

	it('AttachmentAPI: deleteRecord deletes a record', async () => {
		const response = await attachmentApi.deleteRecord(newlyCreatedRecord);

		expect([200, 204]).toContain(response.status);
		expect(response.data).toBeUndefined();
	});
});
