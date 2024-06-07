import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import TokenUtils from '../shared/token-utils';
import { Globals } from '../shared/globals';
import Utils from 'src/app/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private globals: Globals
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const accessToken = TokenUtils.getToken();
    if (accessToken && !this.jwtHelper.isTokenExpired(accessToken)) {
      let url = state.url;
      if (url.indexOf(';') !== -1) {
        url = url.split(';')[0];
      }
      const index = this.globals.profile.menuRespList.findIndex(menu => menu.link === url && menu.respFlag.indexOf('R') > -1);
      if (index !== -1) {
        return true;
      } else {
        Utils.alertError({
          text: 'Unauthorized Access',
        });
        return false;
      }
    }

    TokenUtils.removeToken();

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

}
