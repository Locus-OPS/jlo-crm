import { NgModule } from '@angular/core';
import { RewardComponent } from './reward.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ShowMoreComponent } from './show-more/show-more.component';
import { RewardOnHandComponent } from './show-more/reward-on-hand/reward-on-hand.component';
import { RedeemMethodComponent } from './show-more/redeem-method/redeem-method.component';
import { RedeemTransactionComponent } from './show-more/redeem-transaction/redeem-transaction.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  declarations: [
    RewardComponent, ShowMoreComponent, RewardOnHandComponent,
    RedeemMethodComponent, RedeemTransactionComponent
  ],
  exports: [
    RewardComponent, ShowMoreComponent, RewardOnHandComponent,
    RedeemMethodComponent, RedeemTransactionComponent
  ],
  imports: [
    SharedModule,
    CommonModule
  ],
})
export class RewardModule { }
