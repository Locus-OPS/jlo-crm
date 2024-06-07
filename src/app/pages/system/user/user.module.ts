import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { UserLogComponent } from './log/user-log/user-log.component';
import { LoginLogComponent } from './log/login-log/login-log.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    UserComponent,
    UserLogComponent,
    LoginLogComponent
  ],
  exports: [
    UserComponent,
    UserLogComponent,
    LoginLogComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class UserModule { }
