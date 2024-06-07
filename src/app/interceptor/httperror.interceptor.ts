import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import TokenUtils from '../shared/token-utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private spinner: NgxSpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
    }), catchError(err => {
      this.onEnd();
      if (err.status === 0 || err.status === 401 || err.status === 403) {
        TokenUtils.removeToken();
        this.router.navigate(['/login'], { queryParams: {} });
      }

      // const error = err.error.message || err.statusText;
      // console.log(err.error);
      return throwError(err.error);
    }));
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    setTimeout(() => {
      this.spinner.show();
    }, 1);
  }

  private hideLoader(): void {
    this.spinner.hide();
  }
}
