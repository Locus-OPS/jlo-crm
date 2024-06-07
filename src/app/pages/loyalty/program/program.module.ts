import { NgModule } from '@angular/core';
import { ProgramComponent } from './program.component';
import { AttributeTabComponent } from './show-more-tab/attribute-tab/attribute-tab.component';
import { TierTabComponent } from './show-more-tab/tier-tab/tier-tab.component';
import { TierDetailComponent } from './show-more-tab/tier-detail/tier-detail.component';
import { PointTypeTabComponent } from './show-more-tab/point-type-tab/point-type-tab.component';
import { ShopTabComponent } from './show-more-tab/shop-tab/shop-tab.component';
import { ShowShopComponent } from './show-more-tab/shop-tab/show-shop/show-shop.component';
import { ShopListComponent } from './show-more-tab/shop-tab/show-shop/shop/shop-list.component';
import { CardTierComponent } from './show-more-tab/tier-detail/card-tier/card-tier.component';
import { LocationBasePointComponent } from './show-more-tab/tier-detail/location-base-point/location-base-point.component';
import { TierLocationShopComponent } from './show-more-tab/tier-detail/location-base-point/show-shop/shop/tier-shop.component';
import { TierLocationShowShopComponent } from './show-more-tab/tier-detail/location-base-point/show-shop/tier-show-shop.component';
import { PrivilegeComponent } from './show-more-tab/tier-detail/privilege/privilege.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    ProgramComponent,
    AttributeTabComponent,
    TierTabComponent,
    TierDetailComponent,
    PointTypeTabComponent,
    ShowShopComponent,
    ShopListComponent,
    ShopTabComponent,
    CardTierComponent,
    LocationBasePointComponent,
    TierLocationShowShopComponent,
    TierLocationShopComponent,
    PrivilegeComponent
  ],
  exports: [
    ProgramComponent,
    AttributeTabComponent,
    TierTabComponent,
    TierDetailComponent,
    PointTypeTabComponent,
    ShowShopComponent,
    ShopListComponent,
    ShopTabComponent,
    CardTierComponent,
    LocationBasePointComponent,
    TierLocationShowShopComponent,
    TierLocationShopComponent,
    PrivilegeComponent
  ],
})
export class ProgramModule { }
