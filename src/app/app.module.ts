import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { environment } from "./../environments/environment";

import { AppComponent } from "./app.component";
import { SidebarModule } from "./layouts/template/sidebar/sidebar.module";
import { FooterModule } from "./layouts/template/footer/footer.module";
import { NavbarModule } from "./layouts/template/navbar/navbar.module";
import { FixedpluginModule } from "./layouts/template/fixedplugin/fixedplugin.module";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";

import { JwtModule } from "@auth0/angular-jwt";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import TokenUtils from "./shared/token-utils";
import { HttpErrorInterceptor } from "./interceptor/httperror.interceptor";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "./shared/module/shared.module";
import { BaseComponent } from "./shared/base.component";
import { Globals } from "./shared/globals";
import { NgxSpinnerModule } from "ngx-spinner";

export function jwtTokenGetter() {
  return TokenUtils.getToken();
}

export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  return new TranslateHttpLoader(
    http,
    environment.endpoint + "/api/internationalization/getTranslation/",
    ".json"
  );
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    BaseComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SweetAlert2Module.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: [new RegExp(".+/oauth/token")],
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
  ],
  providers: [
    Globals,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
