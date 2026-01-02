import { API } from './sn_api';
import { APICredentials, APIResponse, SNAttachmentAPIGetParams, SNAttachmentAPIPostParams, SNRecord } from '../types';

// https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_AttachmentAPI.html

export const DEFAULT_ATTACHMENT_URL = '/api/now/attachment';

/**
 * A wrapper for interacting with the ServiceNow Attachment API.
 * Provides methods for CRUD operations on ServiceNow attachment [sys_attachment] records.
 */
export class AttachmentAPI {
	#api: API;
	#path: string;

	/**
	 * Constructs a new AttachmentAPI instance.
	 * @param credentials The API credentials for authentication.
	 * @param baseUrl Optional base URL for the ServiceNow instance.
	 */
	constructor(
		credentials: APICredentials,
		baseUrl: string | undefined = undefined,
		path: string = DEFAULT_ATTACHMENT_URL
	) {
		this.#api = new API(DEFAULT_ATTACHMENT_URL, baseUrl);
		this.#api.setAuth(credentials);
		this.#path = path;
	}

	/**
	 * Deletes a record from the Attachments table by sys_id.
	 * @param sysId The sys_id of the attachment record to delete.
	 * @returns A promise resolving to the API response.
	 */
	deleteRecord(sysId: string): Promise<APIResponse<null>> {
		return this.#api.delete<null>(`/${sysId}`);
	}

	// ! Would need to modify api.request() to return "data: response.data" instead of "data: response.data.result" if we wanted to use this method
	/**
	 * Retrieves the file content of a single record from the Attachments table by sys_id.
	 * @param sysId The sys_id of the attachment record to retrieve.
	 * @returns A promise resolving to the API response containing attachment file content.
	 */
	getAttachment(sysId: string): Promise<APIResponse<any>> {
		return this.#api.get<any>(`/${sysId}/file`, {
			headers: {
				Accept: '*/*' // Should be default but leaving it for now
			},
			responseType: 'arraybuffer'
		});
	}

	/**
	 * Retrieves a single data record from the Attachments table by sys_id.
	 * @param sysId The sys_id of the attachment record to retrieve.
	 * @returns A promise resolving to the API response containing attachment metadata.
	 */
	getRecord(sysId: string): Promise<APIResponse<SNRecord>> {
		return this.#api.get<SNRecord>(`/${sysId}`);
	}

	/**
	 * Retrieves multiple records from the Attachments table.
	 * @param params Optional parameters for filtering, sorting, or limiting results.
	 * @returns A promise resolving to the API response containing attachment data for multiple records.
	 */
	getRecords(params: SNAttachmentAPIGetParams | undefined = undefined): Promise<APIResponse<SNRecord[]>> {
		return this.#api.get<SNRecord[]>(this.#path, {
			params: params,
			config: { omitApiPath: true }
		});
	}

	// TODO: Method for "Retrieve first attachment by file name (GET)" - check REST API Explorer. Is this even necessary?

	/**
	 * Uploads a specified binary file as an attachment to a specified record.
	 * @param tableName The name of the table.
	 * @param sysId The sys_id of the record to attach the file to.
	 * @param fileName The name to give the attachment.
	 * @param blob Binary file to attach to the specified record.
	 * @param params Optional parameters for the post request.
	 * @returns
	 */
	postAttachment(
		tableName: string,
		sysId: string,
		fileName: string,
		blob: Blob,
		params: SNAttachmentAPIPostParams | undefined = undefined
	): Promise<APIResponse<SNRecord>> {
		return this.#api.post(`/file?table_name=${tableName}&table_sys_id=${sysId}&file_name=${fileName}`, blob, {
			headers: {
				'Content-Type': blob.type
			},
			params: params
		});
	}
}
