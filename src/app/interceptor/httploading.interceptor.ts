import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import TokenUtils from '../shared/token-utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

const IGNORE_LOADING = [
  '/api/casenoti/getcasenotilist'
];
const IGNORE_AUTH_LIST = [
  '/common/auth/refreshToken'
];

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.checkToken(request.url)).pipe(
      mergeMap(() => {
        if (!this.checkIgnoreLoading(request.url)) {
          return from(this.spinner.show()).pipe(
            mergeMap(() => {
              return this.handleAccess(request, next);
            })
          );
        } else {
          return this.handleAccess(request, next);
        }
      })
    );
  }

  private handleAccess(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!this.checkIgnoreLoading(request.url)) {
            this.spinner.hide();
          }
        }
      }),
      catchError((err) => {
        this.spinner.hide();
        if (err.status === 401) {
          TokenUtils.removeToken();
          this.router.navigate(['/login'], { queryParams: {} });
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }

  private async checkToken(url: string) {
    const token = TokenUtils.getToken();
    if (!this.checkIgnoreAuth(url)) {
      if (token && this.jwtHelper.isTokenExpired(token, 5)) {
        try {
          await this.authService.syncRefreshToken(TokenUtils.getRefreshToken());
        } catch (e) {
          TokenUtils.removeToken();
          this.router.navigate(['/login'], { queryParams: {} });
        }
      }
    }
  }

  private checkIgnoreAuth(url: string) {
    if (url.indexOf(environment.endpoint) > -1) {
      const path = url.replace(environment.endpoint, "");
      return IGNORE_AUTH_LIST.find((item) => path.indexOf(item) > -1) != null;
    } else {
      return true;
    }
  }

  private checkIgnoreLoading(url: string) {
    if (url.indexOf(environment.endpoint) > -1) {
      const path = url.replace(environment.endpoint, "");
      return IGNORE_LOADING.find((item) => path.indexOf(item) > -1) != null;
    } else {
      return true;
    }
  }

}
