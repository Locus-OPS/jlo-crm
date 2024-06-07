import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    ProductComponent
  ],
  exports: [
    ProductComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class ProductModule { }
