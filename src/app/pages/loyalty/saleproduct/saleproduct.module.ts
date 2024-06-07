import { NgModule } from '@angular/core';
import { SaleproductComponent } from './saleproduct.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    SaleproductComponent
  ],
  exports: [
    SaleproductComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class SaleproductModule { }
