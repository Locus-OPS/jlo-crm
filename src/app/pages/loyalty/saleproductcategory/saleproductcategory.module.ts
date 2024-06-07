import { NgModule } from '@angular/core';
import { SaleproductcategoryComponent } from './saleproductcategory.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    SaleproductcategoryComponent
  ],
  exports: [
    SaleproductcategoryComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class SaleproductcategoryModule { }
