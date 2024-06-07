import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { PromotionModule } from './promotion/promotion.module';
import { TransactionModule } from './transaction/transaction.module';
import { ProgramModule } from './program/program.module';
import { RewardModule } from './reward/reward.module';
import { ShopModule } from './shop/shop.module';
import { CampaignModule } from './campaign/campaign.module';
import { PartnerModule } from './partner/partner.module';
import { ProductModule } from './product/product.module';
import { SaleproductModule } from './saleproduct/saleproduct.module';
import { SaleproductcategoryModule } from './saleproductcategory/saleproductcategory.module'; 
import { TransactionReceiptModule } from './transaction-receipt/transaction-receipt.module';
import { TransactionManualPointModule } from './transaction-manualpoint/transaction-manualpoint.module';
import { CaseModule } from '../case/case.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    CampaignModule,
    PartnerModule,
    ProductModule,
    SaleproductModule,
    SaleproductcategoryModule,
    ShopModule,
    RewardModule,
    PromotionModule,
    TransactionModule,
    ProgramModule,
    CaseModule,
    TransactionReceiptModule,
    TransactionManualPointModule
  ],
})
export class LoyaltyModule { }
