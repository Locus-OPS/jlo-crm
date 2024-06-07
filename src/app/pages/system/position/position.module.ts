import { NgModule } from '@angular/core';
import { PositionComponent } from './position.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    PositionComponent
  ],
  exports: [
    PositionComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class PositionModule { }
