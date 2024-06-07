import { NgModule } from '@angular/core';
import { BusinessUnitComponent } from './business-unit.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    BusinessUnitComponent
  ],
  exports: [
    BusinessUnitComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class BusinessUnitModule { }
