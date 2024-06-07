import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthToken } from '../model/token.model';
import TokenUtils from '../shared/token-utils';
import { environment } from 'src/environments/environment';
import { Globals } from '../shared/globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private rootPath = environment.endpoint;
  private clientId = 'locus';
  private clientSecret = 'locus123';
  private grantType = 'password';

  constructor(
    private http: HttpClient,
    private globals: Globals
  ) { }

  login(username: string, password: string) {
    const options = {
      headers: {
        Authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const param = 'username=' + username + '&password=' + password + '&grant_type=' + this.grantType;

    return new Promise<any>((resolve, reject) => {
      this.http.post(this.rootPath + '/oauth/token', param, options).subscribe((response: OAuthToken) => {
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
