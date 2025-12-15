import { APICredentials, APIResponse, Checksum, ChecksumData, SNApp, SNAppData } from '../types';
import { API } from './sn_api';

export const DEFAULT_SYNC_URL = '/api/x_flowm_mobile/sync';

/**
 * SyncAPI provides methods for interacting with the mobile sync API.
 * It handles configuration and data synchronization for SNApp instances.
 */
export class SyncAPI {
	#api: API;

	/**
	 * Constructs a new SyncAPI instance.
	 * @param credentials - API credentials for authentication.
	 * @param baseUrl - Optional base URL for the API.
	 */
	constructor(credentials: APICredentials, baseUrl: string | undefined = undefined) {
		this.#api = new API(DEFAULT_SYNC_URL, baseUrl);
		this.#api.setAuth(credentials);
	}

	/**
	 * Fetches the configuration for a given app ID.
	 * @param appId - The ID of the app to fetch configuration for.
	 * @returns A promise resolving to the configuration data with checksum.
	 */
	getConfig(appId: string): Promise<APIResponse<ChecksumData<SNApp>>> {
		return this.#api.get<ChecksumData<SNApp>>('/config', {
			params: { id: appId }
		});
	}

	/**
	 * Fetches the checksum for the configuration of a given app ID.
	 * @param appId - The ID of the app to fetch configuration checksum for.
	 * @returns A promise resolving to the configuration checksum.
	 */
	getConfigChecksum(appId: string): Promise<APIResponse<Checksum>> {
		return this.#api.get<Checksum>('/config/checksum', {
			params: { id: appId }
		});
	}

	/**
	 * Fetches the data for a given app configuration.
	 * @param config - The app configuration to fetch data for.
	 * @returns A promise resolving to the app data with checksum.
	 */
	getData(config: SNApp): Promise<APIResponse<ChecksumData<SNAppData>>> {
		return this.#api.post<ChecksumData<SNAppData>>('/data', config);
	}

	/**
	 * Fetches the checksum for the data of a given app ID.
	 * @param appId - The ID of the app to fetch data checksum for.
	 * @returns A promise resolving to the data checksum.
	 */
	getDataChecksum(appId: string): Promise<APIResponse<Checksum>> {
		return this.#api.get<Checksum>('/data/checksum', {
			params: {
				id: appId
			}
		});
	}

	/**
	 * Synchronizes app data with the server.
	 * @param data - The app data to synchronize.
	 * @returns A promise resolving to a boolean indicating success.
	 */
	syncData(data: SNAppData): Promise<APIResponse<boolean>> {
		return this.#api.post('/data/sync', data);
	}

	/**
	 * Returns the API route used for synchronization.
	 * @returns The sync API route as a string.
	 */
	route(): string {
		return this.#api.route();
	}
}
