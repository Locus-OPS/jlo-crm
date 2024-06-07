import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { FormsModule } from '@angular/forms';

const LoginRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'login',
      component: LoginComponent
    }]
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    RouterModule.forChild(LoginRoutes),
    FormsModule,
    SharedModule,
  ]
})
export class LoginModule { }
