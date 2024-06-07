import { NgModule } from '@angular/core';
import { RoleComponent } from './role.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ResponsibilityComponent } from './responsibility/responsibility.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    RoleComponent,
    ResponsibilityComponent
  ],
  exports: [
    RoleComponent,
    ResponsibilityComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class RoleModule { }
