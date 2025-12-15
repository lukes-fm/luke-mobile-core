import axios, { AxiosBasicCredentials, AxiosInstance } from 'axios';
import { OAuthAPI } from './oauth_api';

import type {
	APIBase,
	APICredentials,
	APIRequestHeaders,
	APIRequestOptions,
	APIResponse,
	AxiosAPIError,
	OAuthCredentials,
	RESTMethods
} from '../types';

// TODO: Change this back to a production api route once this is set.
export const DEFAULT_BASE_URL = 'https://flowmotion.service-now.com';
export const DEFAULT_DEV_BASE_URL = 'https://flowmotiondev.service-now.com';
export const DEFAULT_TIMEOUT = 5000;

/**
 * API is a wrapper class for making authenticated HTTP requests to ServiceNow Scripted REST APIs.
 * It supports both Basic Auth and OAuth authentication, and provides methods for all standard REST operations.
 * Handles automatic token refresh for OAuth, error handling, and allows configuration of headers and timeouts.
 */
export class API implements APIBase {
	readonly BASE_URL: string;
	readonly API_PATH: string;

	readonly #api: AxiosInstance;
	readonly oAuthApi: OAuthAPI;

	#isOAuth: boolean = false;
	#credentials: OAuthCredentials | undefined;

	/**
	 * Default API constructor.
	 * @param apiPath Scripted REST API endpoint.
	 * @param baseUrl The instance URL.
	 */
	constructor(
		apiPath: string,
		baseUrl: string = process.env.NODE_ENV !== 'production' ? DEFAULT_DEV_BASE_URL : DEFAULT_BASE_URL
	) {
		this.BASE_URL = baseUrl;
		this.API_PATH = apiPath;

		this.#api = axios.create({
			baseURL: baseUrl,
			timeout: DEFAULT_TIMEOUT
		});

		this.oAuthApi = new OAuthAPI(this);
		this.#credentials = undefined;
	}

	#errorHandler<T>(err: AxiosAPIError): APIResponse<T> {
		if (err.response) {
			return {
				status: err.response.status,
				statusText: err.response.statusText,
				error: err.response.data
			};
		}

		return {
			status: err.errno,
			statusText: err.name,
			error: {
				message: err.message,
				detail: 'Request Error'
			}
		};
	}

	async #request<T>(options: APIRequestOptions, retry: boolean = false): Promise<APIResponse<T>> {
		try {
			const response = await this.#api.request({ ...options });
			return {
				data: response.data.result,
				status: response.status,
				statusText: response.statusText
			};
		} catch (err) {
			if (!axios.isAxiosError(err)) {
				throw err;
			}

			const knownError = err as AxiosAPIError;
			if (
				retry ||
				!this.#credentials ||
				!this.#isOAuth ||
				!knownError.response ||
				knownError.response.status !== 401
			) {
				return Promise.resolve(this.#errorHandler(knownError));
			}

			// When the request is unauthorized and using OAuth, refresh token and try again.
			this.oAuthApi.setClientDetails(this.#credentials);
			const newToken = await this.oAuthApi.refresh(this.#credentials.refresh_token);

			if (!newToken) {
				return Promise.resolve(this.#errorHandler(knownError));
			}

			const newCredentials = {
				client_id: this.#credentials.client_id,
				client_secret: this.#credentials.client_secret,
				...newToken
			};

			this.setAuth(newCredentials);
			return await this.#request<T>(options, true);
		}
	}

	/**
	 * Sets the api authentication details.
	 * This can either be Basic Auth or OAuth details.
	 * @param credentials The credential information.
	 */
	setAuth(credentials: APICredentials): void {
		if (!Object.hasOwn(credentials, 'access_token')) {
			this.#api.defaults.auth = credentials as AxiosBasicCredentials;
			this.#isOAuth = false;
			return;
		}

		this.#isOAuth = true;

		const authToken = credentials as OAuthCredentials;
		this.#credentials = authToken;
		this.oAuthApi.setClientDetails(authToken);
		this.#api.defaults.headers.common.Authorization = `${authToken.token_type} ${authToken.access_token}`;
	}

	/**
	 * Checks if an OAuth access token is present.
	 * @returns Boolean indicating whether access token is present or not.
	 */

	isAuthenticated(): boolean {
		if (this.#isOAuth && this.#credentials && Object.hasOwn(this.#credentials, 'access_token')) {
			return true;
		}

		if (!this.#isOAuth && this.#api.defaults.auth) {
			return true;
		}

		return false;
	}

	/**
	 * Sets the default API headers.
	 * @param headers API headers.
	 */
	setDefaultHeaders(headers: APIRequestHeaders): void {
		this.#api.defaults.headers = headers;
	}

	/**
	 * Sets the timeout length to cancel the network request.
	 * @param lengthMS Timeout length (ms).
	 */
	setRequestTimeout(lengthMS: number): void {
		this.#api.defaults.timeout = lengthMS;
	}

	/**
	 * Performs a REST API Delete request.
	 * @param path The endpoint's local path.
	 * @param body The request body object.
	 * @param options The API options. Such as headers, or parameters.
	 * @returns An API response, a successful response includes the response body,
	 * an errored response includes an error code and message.
	 */
	delete<T>(path: string, options: APIRequestOptions = {}): Promise<APIResponse<T>> {
		const method: RESTMethods = 'DELETE';
		const url = options.config?.omitApiPath ? path : `${this.API_PATH}${path}`;
		const opts: APIRequestOptions = { url, method, ...options };
		return this.#request<T>(opts);
	}

	/**
	 * Performs a REST API Get request.
	 * @param path The endpoint's local path.
	 * @param options The API options. Such as headers, or parameters.
	 * @returns An API response, a successful response includes the response body,
	 * an errored response includes an error code and message.
	 */
	get<T>(path: string, options: APIRequestOptions = {}): Promise<APIResponse<T>> {
		const method: RESTMethods = 'GET';
		const url = options.config?.omitApiPath ? path : `${this.API_PATH}${path}`;
		const opts: APIRequestOptions = { url, method, ...options };
		return this.#request<T>(opts);
	}

	/**
	 * Performs a REST API Patch request.
	 * @param path The endpoint's local path.
	 * @param body The request body object
	 * @param options The API options. Such as headers, or parameters.
	 * @returns An API response, a successful response includes the response body,
	 * an errored response includes an error code and message.
	 */
	patch<T>(path: string, body: object, options: APIRequestOptions): Promise<APIResponse<T>> {
		const method: RESTMethods = 'PATCH';
		const url = options.config?.omitApiPath ? path : `${this.API_PATH}${path}`;
		const opts: APIRequestOptions = { url, method, data: body, ...options };
		return this.#request<T>(opts);
	}

	/**
	 * Performs a REST API Post request.
	 * @param path The endpoint's local path.
	 * @param body The request body object.
	 * @param options The API options. Such as headers, or parameters.
	 * @returns An API response, a successful response includes the response body,
	 * an errored response includes an error code and message.
	 */
	post<T>(path: string, body: object, options: APIRequestOptions = {}): Promise<APIResponse<T>> {
		const method: RESTMethods = 'POST';
		const url = options.config?.omitApiPath ? path : `${this.API_PATH}${path}`;
		const opts: APIRequestOptions = { url, method, data: body, ...options };
		return this.#request<T>(opts);
	}

	postToken<T>(body: object, options: APIRequestOptions = {}): Promise<APIResponse<T>> {
		const method: RESTMethods = 'POST';
		const url = `${DEFAULT_DEV_BASE_URL}/api/x_flowm_mobile/oauth/relay`;
		const opts: APIRequestOptions = { url, method, data: body, ...options };
		return this.#request<T>(opts);
	}

	/**
	 * Performs a REST API Put request.
	 * @param path The endpoint's local path.
	 * @param body The request body object.
	 * @param options The API options. Such as headers, or parameters.
	 * @returns An API response, a successful response includes the response body,
	 * an errored response includes an error code and message.
	 */
	put<T>(path: string, body: object, options: APIRequestOptions = {}): Promise<APIResponse<T>> {
		const method: RESTMethods = 'PUT';
		const url = options.config?.omitApiPath ? path : `${this.API_PATH}${path}`;
		const opts: APIRequestOptions = { url, method, data: body, ...options };
		return this.#request<T>(opts);
	}

	/**
	 * The current api URL being used by the REST API.
	 * @returns The root URL.
	 */
	route(): string {
		return `${this.BASE_URL}${this.API_PATH}`;
	}
}
