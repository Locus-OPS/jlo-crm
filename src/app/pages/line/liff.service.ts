import { Injectable } from '@angular/core';
import { LineUserProfile, LineContext } from './liff.model';

declare var liff: any;

@Injectable({
  providedIn: 'root'
})
export class LiffService {

  constructor() { }

  initLineLiff(liffId): Promise<LineUserProfile> {
    return new Promise((resolve, reject) => {
      liff.init({
        liffId
      }).then(() => {
        resolve(this.getLineProfile());
      });
    });
  }

  getLineProfile(): Promise<LineUserProfile> {
    return new Promise((resolve, reject) => {
      liff.getProfile().then((profile: LineUserProfile) => {
        resolve(profile);
      });
    });
  }

  getContext(): LineContext {
    return liff.getContext();
  }

  scan(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (liff.scanCode) {
        liff.scanCode().then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject();
      }
    });
  }
}
