import { Injectable } from '@angular/core';
import { Profile, MenuResp } from '../model/profile.model';
import { RouteInfo } from '../model/route.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import TokenUtils from './token-utils';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { ApiResponse } from '../model/api-response.model';

@Injectable()
export class Globals {

  KEY_MENU = 'MENU_LIST';

  profile: Profile;
  menuItems: any[];

  constructor(
    private jwtHelper: JwtHelperService,
    private translate: TranslateService,
    private api: ApiService,
    private http: HttpClient
  ) { }

  init() {
    return new Promise<void>((resolve, reject) => {
      if (TokenUtils.getToken()) {
        this.translate.use('th');
        this.profile = <Profile>(this.jwtHelper.decodeToken(TokenUtils.getToken())['profile']);
        console.log(this.jwtHelper.decodeToken(TokenUtils.getToken())['profile']);

        this.getMenuRespList().then(result => {
          if (result) {
            const tmpMenuList = result; //[...this.profile.menuRespList];
            this.profile.menuRespList = <MenuResp[]>tmpMenuList.map(menu => {
              const tmp = result.filter(item => item.id === menu.id)[0];
              return {
                id: menu.id,
                respFlag: menu.respFlag,
                use: menu.use,
                icon: tmp.icon,
                link: tmp.link,
                name: tmp.name,
                parentMenuId: tmp.parentMenuId,
                type: tmp.type
              };
            });

            this.menuItems = <RouteInfo[]>this.profile.menuRespList.filter(
              item => item.use === 'Y'
                && !item.parentMenuId
                && ((item.respFlag && item.respFlag.indexOf('R') > -1 && item.type === 'link') || item.type === 'sub')
            ).map(item => {
              return {
                link: item.link,
                name: item.name,
                type: item.type,
                icon: item.icon,
                collapse: (item.type === 'sub' ? item.link.substr(1) : ''),
                children: this.profile.menuRespList.filter(
                  main => main.use === 'Y' && main.parentMenuId === item.id && main.respFlag && main.respFlag.indexOf('R') > -1
                ).map(child => {
                  return {
                    link: child.link,
                    name: child.name,
                    icon: child.icon
                  };
                })
              };
            }).filter(item => item.type === 'link' || (item.children && item.children.length > 0));
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  getMenuRespList(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const cacheMenuList = sessionStorage.getItem(this.KEY_MENU);
      if (cacheMenuList) {
        resolve(JSON.parse(cacheMenuList));
      } else {
        this.http.post(this.api.getRootPath() + '/api/menu/getMenuRespList', {}).subscribe(result => {
          sessionStorage.setItem(this.KEY_MENU, JSON.stringify((<any>result).data));
          resolve((<any>result).data);
        });
      }
    });
  }

  clear() {
    sessionStorage.clear();
  }

}
