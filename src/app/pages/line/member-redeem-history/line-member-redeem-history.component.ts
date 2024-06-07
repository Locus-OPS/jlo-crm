import { Component, OnInit } from '@angular/core';
import { LineService } from '../line.service';
import { LineUserProfile } from '../liff.model';
import { LiffService } from '../liff.service';

export interface LineRedeemHistory {
  txnId: number;
  productType: string;
  productName: string;
  pointBefore: number;
  burnPoint: number;
  balancePoint: number;
  processedDate: string;
}

@Component({
  selector: 'app-line-member-redeem-history',
  templateUrl: './line-member-redeem-history.component.html',
  styleUrls: ['./line-member-redeem-history.component.scss']
})
export class LineMemberRedeemHistoryComponent implements OnInit {

  liffId = '1653967605-W2G9mK4Y';
  userProfile: LineUserProfile;

  memberId: number;
  redeemHistoryList: LineRedeemHistory[];

  isRegister = null;
  isInitial = false;

  constructor(
    private lineService: LineService,
    private liffService: LiffService
  ) {

  }

  ngOnInit() {
    this.initLineLiff();

    // for test only
    // this.isRegister = true;
    // this.isInitial = true;
    // this.memberId = 55;
    // this.initRedeemHistoryPage();
  }

  async initLineLiff() {
    try {
      this.userProfile = await this.liffService.initLineLiff(this.liffId);
      this.checkMemberRegister();
    } catch (err) {
      // alert(err);
    }
  }

  initRedeemHistoryPage() {
    this.lineService.getRedeemHistory({
      data: this.memberId
    }).then(result => {
      this.isInitial = true;
      if (result.status) {
        this.redeemHistoryList = result.data;
      }
    });
  }

  onRegister(memberId) {
    this.isInitial = false;
    this.isRegister = true;
    this.memberId = memberId;
    this.initRedeemHistoryPage();
  }

  checkMemberRegister() {
    this.lineService.checkMemberRegister({
      data: this.userProfile.userId
    }).then(result => {
      if (result.status && result.data) {
        this.isRegister = true;
        this.memberId = result.data;
        this.initRedeemHistoryPage();
      } else {
        this.isRegister = false;
        this.isInitial = true;
      }
    });
  }

}
