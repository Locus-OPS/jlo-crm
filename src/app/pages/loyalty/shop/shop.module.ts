import { NgModule } from '@angular/core';
import { ShopComponent } from './shop.component';
import { ShopTypeComponent } from './shop-type/shop-type.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    ShopComponent,
    ShopTypeComponent
  ],
  exports: [
    ShopComponent,
    ShopTypeComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class ShopModule { }
