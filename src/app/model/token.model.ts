export interface OAuthToken {
    access_token: string;
    agent_code: string;
    expires_in: number;
    jti: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}