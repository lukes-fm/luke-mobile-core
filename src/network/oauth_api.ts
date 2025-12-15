import { generateCharacters } from '../utils';
import { CharacterSet } from '../constants';
import type { OAuthClient, OAuthToken } from '../types';
import { DEFAULT_DEV_BASE_URL, type API } from './sn_api';

export const DEFAULT_OAUTH_RELAY = '/api/x_flowm_mobile/fmm_oauth/oauth_relay';
export const DEFAULT_REDIRECT_URL = 'http://localhost:8100/login';

export class OAuthAPI {
	#api: API;
	#path: string;
	#client_id: string | undefined;
	#client_secret: string | undefined;
	#state: string;
	#usable: boolean = false;

	/**
	 * Default OAuthAPI constructor.
	 * @param api The base api used for authentication.
	 */
	constructor(api: API, path: string = DEFAULT_OAUTH_RELAY) {
		this.#api = api;
		this.#path = path;
		this.#state = generateCharacters(32, CharacterSet.az09);
	}

	/**
	 * Sets client information for requesting and refreshing tokens.
	 * @param client Client ID and Client Secret used for OAuth.
	 */
	setClientDetails = (client: OAuthClient) => {
		this.#client_id = client.client_id;
		this.#client_secret = client.client_secret;
		this.#usable = true;
	};

	/**
	 * Generates the URL required to authenticate an OAuth request.
	 * @returns The OAuth authorization URL.
	 */
	authorize = (): string => {
		if (!this.#usable) throw 'No Client Details Added';

		let url = this.#api.BASE_URL + '/oauth_auth.do';
		url += '?client_id=' + this.#client_id;
		url += '&client_secret=' + this.#client_secret;
		url += '&state=' + this.#state;
		url += '&grant_type=authorization_code';
		url += '&response_type=code';

		return url;
	};

	/**
	 * Performs an OAuth Token request once authorization is successful.
	 * @param auth_key The OAuth key generated from authorization.
	 * @param redirect_uri The redirection URL. This shouldn't be used within a mobile context.
	 * @returns The OAuth token information.
	 */
	generate = async (
		auth_key: string,
		redirect_uri: string = DEFAULT_REDIRECT_URL
	): Promise<OAuthToken | undefined> => {
		if (!this.#usable) throw 'No Client Details Added';

		const params = {
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
			client_id: this.#client_id,
			client_secret: this.#client_secret,
			code: auth_key
		};

		return (await this.#api.post<OAuthToken>(this.#path, params, { config: { omitApiPath: true } })).data;
	};

	/**
	 * generate() uses an incorrect OAUTH API URL path, this is a temp fix
	 * @param auth_key 
	 * @param redirect_uri 
	 * @returns 
	 */
	generateRaw = async (
		auth_key: string,
		redirect_uri: string = DEFAULT_REDIRECT_URL
	): Promise<OAuthToken | undefined> => {
		if (!this.#usable) throw 'No Client Details Added';

		const params = {
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
			client_id: this.#client_id,
			client_secret: this.#client_secret,
			code: auth_key
		}
		
		return (await this.#api.postToken<OAuthToken>(params, { config: { omitApiPath: false } })).data;
	}

	/**
	 * Performs an OAuth Token refresh after a token has been generated.
	 * @param refresh_token The OAuth refresh token from token generation.
	 * @param redirect_uri The redirection URL. This shouldn't be used within a mobile context.
	 * @returns The refreshed OAuth token information.
	 */
	refresh = async (
		refresh_token: string,
		redirect_uri: string = DEFAULT_REDIRECT_URL
	): Promise<OAuthToken | undefined> => {
		if (!this.#usable) throw 'No Client Details Added';

		const params = {
			grant_type: 'refresh_token',
			redirect_uri: redirect_uri,
			client_id: this.#client_id,
			client_secret: this.#client_secret,
			refresh_token: refresh_token
		};

		return (await this.#api.post<OAuthToken>(this.#path, params, { config: { omitApiPath: true } })).data;
	};
}
