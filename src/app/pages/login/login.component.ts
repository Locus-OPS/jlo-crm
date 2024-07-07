import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import TokenUtils from 'src/app/shared/token-utils';
import { TranslateService } from '@ngx-translate/core';
import { TabManageService } from 'src/app/layouts/admin/tab-manage.service';
import { SharedModule } from 'src/app/shared/module/shared.module';

declare var $: any;

@Component({
  selector: 'app-login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule]
})

export class LoginComponent implements OnInit, OnDestroy {

  currentDate: Date = new Date();

  username: string;
  password: string;
  usernameVal: string;
  passwordVal: string;
  error_description: string;

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private translate: TranslateService,
    private tabManageService: TabManageService
  ) {

  }

  ngOnInit() {
    if (TokenUtils.getToken()) {
      if (!this.jwtHelper.isTokenExpired(TokenUtils.getToken())) {
        this.redirectToMainPage();
      }
    } else {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('login-page');
      body.classList.add('off-canvas-sidebar');
      const card = document.getElementsByClassName('card')[0];
      // setTimeout(function () {
      //   card.classList.remove('card-hidden');
      // }, 700);
    }
  }

  onLogin() {
    if (this.username == null || this.username === undefined || this.username.length < 5) {
      return;
    }
    if (this.password == null || this.password === undefined || this.password.length < 5) {
      return;
    }

    this.authService.login(this.username, this.password).then(result => {

      this.tabManageService.removeTabs();
      this.translate.use('th').subscribe(() => {
        this.redirectToMainPage();
      });
    }, error => {
      this.error_description = 'Wrong username or password-x';
    });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }

  redirectToMainPage() {
    console.log("redirectToMainPage");
    this.router.navigate(['dashboard']);
  }
}
