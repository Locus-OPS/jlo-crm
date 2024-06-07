import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class MenuModule { }
