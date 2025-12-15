import { API } from './sn_api';
import {
	APICredentials,
	APIResponse,
	SNTableAPIDeleteParams,
	SNTableAPIPatchParams,
	SNTableAPIGetParams,
	SNTableAPIRecordsParams,
	SNTableAPIPostParams,
	SNTableAPIPutParams,
	SNRecord
} from '../types';

export const DEFAULT_TABLE_URL = '/api/now/table';

/**
 * A wrapper for interacting with the ServiceNow Table API.
 * Provides methods for CRUD operations on ServiceNow tables.
 */
export class TableAPI {
	#api: API;

	/**
	 * Constructs a new TableAPI instance.
	 * @param credentials The API credentials for authentication.
	 * @param baseUrl Optional base URL for the ServiceNow instance.
	 */
	constructor(credentials: APICredentials, baseUrl: string | undefined = undefined) {
		this.#api = new API(DEFAULT_TABLE_URL, baseUrl);
		this.#api.setAuth(credentials);
	}

	/**
	 * Deletes a record from a ServiceNow table by sys_id.
	 * @param tableName The name of the table.
	 * @param sysId The sys_id of the record to delete.
	 * @param params Optional parameters for the delete request.
	 * @returns A promise resolving to the API response.
	 */
	deleteRecord(
		tableName: string,
		sysId: string,
		params: SNTableAPIDeleteParams | undefined = undefined
	): Promise<APIResponse<null>> {
		return this.#api.delete<null>(`/${tableName}/${sysId}`, {
			params: params
		});
	}

	/**
	 * Retrieves a single record from a ServiceNow table by sys_id.
	 * @param tableName The name of the table.
	 * @param sysId The sys_id of the record to retrieve.
	 * @param params Optional parameters for the get request.
	 * @returns A promise resolving to the API response.
	 */
	getRecord(
		tableName: string,
		sysId: string,
		params: SNTableAPIGetParams | undefined = undefined
	): Promise<APIResponse<SNRecord>> {
		return this.#api.get<SNRecord>(`/${tableName}/${sysId}`, {
			params: params
		});
	}

	/**
	 * Retrieves multiple records from a ServiceNow table.
	 * @param tableName The name of the table.
	 * @param params Optional parameters for filtering, sorting, or limiting results.
	 * @returns A promise resolving to the API response.
	 */
	getRecords(
		tableName: string,
		params: SNTableAPIRecordsParams | undefined = undefined
	): Promise<APIResponse<SNRecord[]>> {
		return this.#api.get<SNRecord[]>(`/${tableName}`, {
			params: params
		});
	}

	/**
	 * Updates a record in a ServiceNow table by sys_id using PATCH.
	 * @param tableName The name of the table.
	 * @param sysId The sys_id of the record to update.
	 * @param body The fields and values to update.
	 * @param params Optional parameters for the patch request.
	 * @returns A promise resolving to the API response.
	 */
	patchRecord(
		tableName: string,
		sysId: string,
		body: object,
		params: SNTableAPIPatchParams | undefined = undefined
	): Promise<APIResponse<SNRecord>> {
		return this.#api.patch<SNRecord>(`/${tableName}/${sysId}`, body, {
			params: params
		});
	}

	/**
	 * Creates a new record in a ServiceNow table using POST.
	 * @param tableName The name of the table.
	 * @param body The fields and values for the new record.
	 * @param params Optional parameters for the post request.
	 * @returns A promise resolving to the API response.
	 */
	postRecord(
		tableName: string,
		body: object,
		params: SNTableAPIPostParams | undefined = undefined
	): Promise<APIResponse<SNRecord>> {
		return this.#api.post<SNRecord>(`/${tableName}`, body, {
			params: params
		});
	}

	/**
	 * Replaces a record in a ServiceNow table by sys_id using PUT.
	 * @param tableName The name of the table.
	 * @param sysId The sys_id of the record to replace.
	 * @param body The fields and values for the updated record.
	 * @param params Optional parameters for the put request.
	 * @returns A promise resolving to the API response.
	 */
	putRecord(
		tableName: string,
		sysId: string,
		body: object,
		params: SNTableAPIPutParams | undefined = undefined
	): Promise<APIResponse<SNRecord>> {
		return this.#api.put<SNRecord>(`/${tableName}/${sysId}`, body, {
			params: params
		});
	}
}
