import { OAuthToken } from '../model/token.model';

const TOKEN_KEY = 'access_token';

export default class TokenUtils {
  static setToken(token: OAuthToken) {
    sessionStorage.setItem(TOKEN_KEY, token.access_token);
  }
  static getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  static removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
