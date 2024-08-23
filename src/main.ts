import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app/app.component';
import { Globals } from './app/shared/globals';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpLoadingInterceptor } from './app/interceptor/httploading.interceptor';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import TokenUtils from './app/shared/token-utils';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import routes from './app/app-routing';
import { RouterModule } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

export function jwtTokenGetter() {
  return TokenUtils.getToken();
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return TokenUtils.getToken();
    },
    allowedDomains: environment.whitelistedDomains,
    disallowedRoutes: [new RegExp('.+\/common\/auth\/login')]
  };
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    environment.endpoint + "/api/internationalization/getTranslation/",
    ".json"
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    Globals,
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule,
      RouterModule.forRoot(routes, {
        useHash: true
      }),
      JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
        },
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
});
