import { NgModule } from '@angular/core';
import { TransactionComponent } from './transaction.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { EarnItemComponent } from './show-more/earn-item/earn-item.component';
import { BurnItemComponent } from './show-more/burn-item/burn-item.component';
import { PromotionAttrComponent } from './show-more/promotion-attr/promotion-attr.component';
import { ShowMoreComponent } from './show-more/show-more.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { ProductComponent } from './show-product/product/product.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [
    TransactionComponent, EarnItemComponent,
    BurnItemComponent, PromotionAttrComponent, ShowMoreComponent,
    ShowProductComponent, ProductComponent
  ],
  exports: [
    TransactionComponent, EarnItemComponent,
    BurnItemComponent, PromotionAttrComponent, ShowMoreComponent,
    ShowProductComponent, ProductComponent
  ]
})
export class TransactionModule { }
