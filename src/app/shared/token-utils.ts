import { OAuthToken } from '../model/token.model';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export default class TokenUtils {
  static setToken(token: OAuthToken) {
    sessionStorage.setItem(TOKEN_KEY, token.accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
  }
  static getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  static getRefreshToken(): string {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
  static removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
