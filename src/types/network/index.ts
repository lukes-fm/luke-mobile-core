import type { AxiosBasicCredentials, AxiosError, AxiosHeaderValue, AxiosRequestConfig, HeadersDefaults } from 'axios';
import type { OAuthCredentials } from './oauth';

export type { OAuthClient, OAuthCredentials, OAuthToken } from './oauth';

export type RESTMethods = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export type APIResponse<T> = {
	data?: T;
	error?: APIError;
	status: number;
	statusText: string;
};

export type APIError = {
	message: string;
	detail: string | null;
};

export type AxiosAPIError = {
	errno: number;
} & AxiosError<APIError>;

export interface APIBase {
	delete<T>(path: string, options: APIRequestOptions): Promise<APIResponse<T>>;
	get<T>(path: string, options: APIRequestOptions): Promise<APIResponse<T>>;
	patch<T>(path: string, body: object, options: APIRequestOptions): Promise<APIResponse<T>>;
	post<T>(path: string, body: object, options: APIRequestOptions): Promise<APIResponse<T>>;
	put<T>(path: string, body: object, options: APIRequestOptions): Promise<APIResponse<T>>;

	setDefaultHeaders(headers: APIRequestHeaders): void;
	setAuth(authentication: APICredentials): void;
	setRequestTimeout(lengthMS: number): void;
}

export type APICredentials = OAuthCredentials | AxiosBasicCredentials;

export type APIRequestOptions = AxiosRequestConfig & { config?: APIAdditionalOptions };

export type APIAdditionalOptions = {
	omitApiPath?: boolean;
};

export type APIRequestHeaders = HeadersDefaults & {
	[key: string]: AxiosHeaderValue;
};
