import { Component, OnInit } from '@angular/core';
import { LineService } from '../line.service';
import { LineUserProfile } from '../liff.model';
import { LiffService } from '../liff.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ModalConfirmComponent } from '../../common/modal-confirm/modal-confirm.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { LineMemberInfo, LineRedemptionReward } from '../line.model';

@Component({
  selector: 'app-line-member-redeem',
  templateUrl: './line-member-redeem.component.html',
  styleUrls: ['./line-member-redeem.component.scss']
})
export class LineMemberRedeemComponent implements OnInit {

  liffId = '1653967605-lOo3J4GK';
  userProfile: LineUserProfile;

  memberId: number;
  memberInfo: LineMemberInfo;
  rewardList: LineRedemptionReward[];

  isRegister = null;
  isInitial = false;

  xcash: LineRedemptionReward = {
    productId: 99999
    , productCode: 'XCASH01'
    , productName: 'Convert to xCash point'
    , productDetail: 'Convert to xCash point'
    , rewardUnitPerson: 100
    , point: 1000
    , cash: 0
    , redeemCount: 0
    , inventoryBalance: 100
    , productImgPath: 'assets/img/xcash.png'
    , isXcash: true
  };

  constructor(
    private lineService: LineService,
    private liffService: LiffService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.initLineLiff();

    // this.isRegister = false;
    // this.initRedeemPage();
    // for test only
    // this.isRegister = true;
    // this.memberId = 111;
    // this.initRedeemPage();
  }

  async initLineLiff() {
    try {
      this.userProfile = await this.liffService.initLineLiff(this.liffId);
      this.checkMemberRegister();
    } catch (err) {
      // alert(err);
    }
  }

  initRedeemPage() {
    this.lineService.getMemberInfo({
      data: this.memberId
    }).then(result => {
      this.isInitial = true;
      if (result.status) {
        this.memberInfo = result.data;
        this.searchReward();
      }
    });
  }

  searchReward() {
    this.lineService.searchReward({
      data: this.memberId,
      pageNo: 0,
      pageSize: 100
    }).then(result => {
      if (result.status) {
        this.rewardList = result.data;
      }
    });
  }

  onRedeem(reward: LineRedemptionReward) {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      maxWidth: '80%',
      data: {
        title: 'Confirm',
        message: `Use ${reward.point} points to get ${reward.productName}`
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        reward.useCash = reward.cash;
        reward.usePoint = reward.point;
        reward.quantity = 1;
        this.lineService.submitRedeem({
          data: {
            memberId: this.memberId
            , rewardList: [
              reward
            ]
          }
        }).then(result => {
          if (result.status) {
            this.initRedeemPage();
            this.snackBar.open('Successfully', '', {
              duration: 2000,
            });
          } else {
            this.snackBar.open('Failed', '', {
              duration: 2000,
            });
          }
        });
      }
    });
  }

  onRegister(memberId) {
    this.isInitial = false;
    this.isRegister = true;
    this.memberId = memberId;
    this.initRedeemPage();
  }

  checkMemberRegister() {
    this.lineService.checkMemberRegister({
      data: this.userProfile.userId
    }).then(result => {
      if (result.status && result.data) {
        this.isRegister = true;
        this.memberId = result.data;
        this.initRedeemPage();
      } else {
        this.isRegister = false;
        this.isInitial = true;
      }
    });
  }

  goRewardDetail(reward) {
    this.lineService.setReward(reward);
    this.router.navigate(['/line-liff/reward-detail']);
  }

}
