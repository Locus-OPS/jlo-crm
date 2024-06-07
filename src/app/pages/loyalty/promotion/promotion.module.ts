import { NgModule } from '@angular/core';
import { PromotionComponent } from './promotion.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { RuleComponent } from './rule/rule.component';
import { ProductComponent } from './product/product.component';
import { MemberComponent } from './member/member.component';
import { ShopComponent } from './shop/shop.component';
import { AttrComponent } from './attr/attr.component';
import { ShowProductComponent } from './product/show-product/show-product.component';
import { ProductListComponent } from './product/show-product/product/product-list.component';
import { ShowMemberComponent } from './member/show-member/show-member.component';
import { MemberListComponent } from './member/show-member/member/member-list.component';
import { ShowShopComponent } from './shop/show-shop/show-shop.component';
import { ShopListComponent } from './shop/show-shop/shop/shop-list.component';
import { ActionModule } from './rule/action/action.module';
import { CriteriaModule } from './rule/criteria/criteria.module';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    ActionModule,
    CriteriaModule,
    CommonModule
  ],
  declarations: [
    PromotionComponent, RuleComponent, ProductComponent,
    MemberComponent, ShopComponent, AttrComponent, ShowProductComponent, ProductListComponent,
    ShowMemberComponent, MemberListComponent, ShowShopComponent, ShopListComponent
  ],
  exports: [
    PromotionComponent, RuleComponent, ProductComponent,
    MemberComponent, ShopComponent, AttrComponent, ShowProductComponent, ProductListComponent,
    ShowMemberComponent, MemberListComponent, ShowShopComponent, ShopListComponent,
    ActionModule, CriteriaModule
  ]
})
export class PromotionModule { }
