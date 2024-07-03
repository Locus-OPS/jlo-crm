import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthToken } from '../model/token.model';
import TokenUtils from '../shared/token-utils';
import { environment } from 'src/environments/environment';
import { Globals } from '../shared/globals';
import Utils from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private rootPath = environment.endpoint;
  private grantType = 'password';

  syncRefreshToken;

  constructor(
    private http: HttpClient,
    private globals: Globals
  ) {
    this.syncRefreshToken = Utils.asyncDebounce(this.refreshToken, 1000);
  }

  login(username: string, password: string) {
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const param = 'username=' + username + '&password=' + password + '&grant_type=' + this.grantType;

    return new Promise<any>((resolve, reject) => {
      this.http.post(this.rootPath + '/common/auth/login', param, options).subscribe((response: OAuthToken) => {
        TokenUtils.setToken(response);
        this.globals.init().then(result => {
          resolve(response);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  refreshToken(refreshToken: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return new Promise<any>((resolve, reject) => {
      this.http.post(this.rootPath + '/common/auth/refreshToken', { refreshToken }, options).subscribe((response: OAuthToken) => {
        TokenUtils.setToken(response);
        this.globals.init().then(result => {
          resolve(response);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

}
