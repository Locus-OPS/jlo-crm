import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { LineMemberRegisterComponent } from './member-register/line-member-register.component';
import { LineRegisterSelectionComponent } from './member-register/register-selection/register-selection.component';
import { LineLiffComponent } from './liff.component';
import { LineMemberRedeemComponent } from './member-redeem/line-member-redeem.component';
import { LineMemberRedeemHistoryComponent } from './member-redeem-history/line-member-redeem-history.component';
import { LineRegisterFormComponent } from './member-register/register-form/register-form.component';
import { LineRegisterOTPComponent } from './member-register/register-otp/retister-otp.component';
import { LineRegisterTermComponent } from './member-register/register-term/register-term.component';
import { LineRewardDetailComponent } from './reward-detail/reward-detail.component';
import { LineReceiptUploadComponent } from './receipt-upload/receipt-upload.component';
import { LineReceiptApproveComponent } from './receipt-approve/receipt-approve.component';
import { LineXcashDetailComponent } from './xcash-detail/xcash-detail.component';
import { LineRewardAddressComponent } from './reward-address/reward-address.component';

@NgModule({
  declarations: [
    LineLiffComponent,
    LineMemberRegisterComponent,
    LineMemberRedeemComponent,
    LineMemberRedeemHistoryComponent,
    LineRegisterSelectionComponent,
    LineRegisterFormComponent,
    LineRegisterOTPComponent,
    LineRegisterTermComponent,
    LineRewardDetailComponent,
    LineReceiptUploadComponent,
    LineReceiptApproveComponent,
    LineXcashDetailComponent,
    LineRewardAddressComponent
  ],
  imports: [
    SharedModule
  ],
})
export class LineModule { }
