import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RedemptionReward, RedemptionMemberInfo } from '../member-redeem.model';
import Utils from 'src/app/shared/utils';
import { MemberRedeemService } from '../member-redeem.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-redeem-summary-dialog',
  templateUrl: './redeem-summary-dialog.component.html',
  styleUrls: ['./redeem-summary-dialog.component.scss']
})
export class RedeemSummaryDialogComponent extends BaseComponent implements OnInit {

  memberId: number;
  rewardCart: RedemptionReward[] = [];
  deletedRewardCart: RedemptionReward[] = [];
  displayedColumns: string[] = ['productName', 'point', 'cash', 'quantity', 'action'];

  redemptionMemberInfo: RedemptionMemberInfo;

  constructor(
    public dialogRef: MatDialogRef<RedeemSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public globals: Globals,
    private translateService: TranslateService,
    private memberRedeemService: MemberRedeemService
  ) {
    super(router, globals);
    this.rewardCart = data.rewardCart;
    this.memberId = data.memberId;
    this.redemptionMemberInfo = data.redemptionMemberInfo;
  }

  ngOnInit() {

  }

  submitRedeem() {
    Utils.confirm('Warning', 'Are you sure ?', 'Confirm').then(confirm => {
      this.memberRedeemService.submitRedeem({
        data: {
          memberId: this.memberId
          , rewardList: this.rewardCart
        }
      }).then(result => {
        if (result.status) {
          // Trigger Member detail form to reload new point information.
          this.memberRedeemService.submitRedeemMemberId(this.memberId);
          this.closeDialog(true);
        } else {
          Utils.alertError({
            text: result.message,
          });
        }
      }, error => {
        Utils.alertError({
          text: 'Please try again later.',
        });
      });
    });
  }

  onDelete(row: RedemptionReward) {
    Utils.confirm('Warning', 'Are you sure ?', 'Confirm').then(confirm => {
      if (confirm.value) {
        const index = this.rewardCart.findIndex(item => item.productId === row.productId);
        if (index !== -1) {
          this.deletedRewardCart.push({ ...this.rewardCart[index] });
          this.rewardCart.splice(index, 1);
          this.rewardCart = [...this.rewardCart];
        }
      }
    });
  }

  closeDialog(isSubmit: boolean) {
    this.dialogRef.close({
      rewardCart: this.rewardCart
      , deletedRewardCart: this.deletedRewardCart
      , isSubmit
    });
  }

  get calSumUsePoint() {
    if (this.rewardCart.length > 0) {
      return this.rewardCart.map(item => item.usePoint).reduce((sum, number) => sum + number);
    } else {
      return 0;
    }
  }

  get calSumQuantity() {
    if (this.rewardCart.length > 0) {
      return this.rewardCart.map(item => item.quantity).reduce((sum, number) => sum + number);
    } else {
      return 0;
    }
  }

  get calSumUseCash() {
    if (this.rewardCart.length > 0) {
      return this.rewardCart.map(item => item.useCash).reduce((sum, number) => sum + number);
    } else {
      return 0;
    }
  }

  plus(row: RedemptionReward) {
    const qty = row.quantity + 1;
    if (qty > row.redeemCount) {
      this.translateService.get('redeem.overUnit').subscribe((result: string) => {
        Utils.alertError({
          text: result
        });
      });
      return;
    }
    if (row.displayInventoryBalance === 0) {
      this.translateService.get('redeem.overInventoryBalance').subscribe((result: string) => {
        Utils.alertError({
          text: result
        });
      });
      return;
    }
    this.updateRewardRow(row, qty);
  }

  minus(row: RedemptionReward) {
    let qty = row.quantity - 1;
    if (qty < 0) {
      qty = 0;
    }
    this.updateRewardRow(row, qty);
  }

  updateRewardRow(row, qty) {
    row.usePoint = row.point * qty;
    row.useCash = row.cash * qty;
    row.quantity = qty;

    row.displayInventoryBalance = row.inventoryBalance - row.quantity;
    row.displayRedeemCount = row.redeemCount - row.quantity;
  }

}
