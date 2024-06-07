import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { MemberCardPipe } from './member-detail/member-card-pipe';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerComponent } from './customer.component';
import { VerifyCustomerDialogComponent } from './customer-detail/verify-customer-dialog/verify-customer-dialog.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReIssuesCardComponent } from './member-detail/re-issues-card/re-issues-card.component';
import { BlockCardComponent } from './member-detail/block-card/block-card.component';
import { MemberRedeemComponent } from './member-redeem/member-redeem.component';
import { RedeemSummaryDialogComponent } from './member-redeem/redeem-summary-dialog/redeem-summary-dialog.component';
import { CommonModule } from '../common/common.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    CustomerComponent,
    CustomerDetailComponent,
    MemberDetailComponent,
    MemberCardPipe,
    VerifyCustomerDialogComponent,
    ReIssuesCardComponent,
    BlockCardComponent,
    MemberRedeemComponent,
    RedeemSummaryDialogComponent
  ],
  exports: [
    CustomerComponent,
    CustomerDetailComponent,
    MemberDetailComponent,
    MemberCardPipe,
    VerifyCustomerDialogComponent,
    ReIssuesCardComponent,
    BlockCardComponent,
    MemberRedeemComponent,
    RedeemSummaryDialogComponent
  ],
})
export class CustomerModule { }
