export type OAuthToken = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	token_type: string;

	scope?: string;
};

export type OAuthClient = {
	client_id: string;
	client_secret: string;
};

export type OAuthCredentials = OAuthClient & OAuthToken;
