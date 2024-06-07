import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';
import { MatDialog } from '@angular/material/dialog';
import { RedeemSummaryDialogComponent } from './redeem-summary-dialog/redeem-summary-dialog.component';
import { TableControl } from 'src/app/shared/table-control';
import { RedemptionMemberInfo, RedemptionReward } from './member-redeem.model';
import { MemberRedeemService } from './member-redeem.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-member-redeem',
  templateUrl: './member-redeem.component.html',
  styleUrls: ['./member-redeem.component.scss']
})
export class MemberRedeemComponent extends BaseComponent implements OnInit {

  tableControl: TableControl = new TableControl(() => { this.search(); });
  dataSource: RedemptionReward[];
  displayedColumns: string[] = ['productName', 'point', 'cash', 'quantity', 'action'];

  searchForm: UntypedFormGroup;

  memberId: number;

  redemptionMemberInfo: RedemptionMemberInfo;
  rewardCart: RedemptionReward[] = [];

  redeemMethodList: Dropdown[] = [];

  overInventoryBalance = '';

  constructor(
    public router: Router,
    public globals: Globals,
    private tabParam: TabParam,
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    private memberRedeemService: MemberRedeemService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {
    super(router, globals);

    this.api.getMultipleCodebookByCodeType({
      data: ['REWARD_REDEEM_METHOD']
    }).then(result => {
      this.redeemMethodList = result.data['REWARD_REDEEM_METHOD'];
    });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      displayType: ['A'],
      redeemMethod: [''],
      rewardName: [''],
      minPoint: [''],
      maxPoint: ['']
    });

    this.memberId = this.tabParam.params['memberId'];
    if (this.memberId) {
      this.loadMemberInfo();
    }
  }

  loadMemberInfo() {
    if (this.memberId) {
      this.memberRedeemService.getMemberInfo({
        data: this.memberId
      }).then(result => {
        this.redemptionMemberInfo = result.data;
        this.search();
      });
    }
  }

  onSearch() {
    this.search();
  }

  search() {
    this.memberRedeemService.searchReward({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        memberId: this.memberId
        , programId: this.redemptionMemberInfo.programId
        , ...this.searchForm.value
      }
    }).then(result => {
      this.dataSource = this.setDefaultData(result.data);
      this.tableControl.total = result.total;
    });
  }

  setDefaultData(data: RedemptionReward[]) {
    data.forEach(item => {
      item.usePoint = 0;
      item.useCash = 0;
      item.quantity = 0;
      item.displayInventoryBalance = item.inventoryBalance;
      item.displayRedeemCount = item.redeemCount;
    });
    return data;
  }

  openSummaryDialog(): void {
    const dialogRef = this.dialog.open(RedeemSummaryDialogComponent, {
      width: '70%',
      height: '80%',
      disableClose: true,
      panelClass: 'my-dialog',
      data: {
        memberId: this.memberId
        , rewardCart: this.rewardCart
        , redemptionMemberInfo: this.redemptionMemberInfo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.isSubmit) {
        this.rewardCart = [];
        this.loadMemberInfo();
      } else {
        this.rewardCart = result.rewardCart;

        if (this.rewardCart.length > 0) {
          this.rewardCart.forEach(item => {
            const index = this.dataSource.findIndex(i => i.productId === item.productId);
            if (index !== -1) {
              this.dataSource[index].displayInventoryBalance = item.displayInventoryBalance;
              this.dataSource[index].displayRedeemCount = item.displayRedeemCount;
            }
          });
        }

        if (result.deletedRewardCart.length > 0) {
          result.deletedRewardCart.forEach(item => {
            const index = this.dataSource.findIndex(i => i.productId === item.productId);
            if (index !== -1) {
              this.dataSource[index].displayInventoryBalance = this.dataSource[index].inventoryBalance;
              this.dataSource[index].displayRedeemCount = this.dataSource[index].redeemCount;
            }
          });
        }
      }
    });
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
    this.updateRewardRow(row, qty, -1);
  }

  minus(row: RedemptionReward) {
    let qty = row.quantity - 1;
    if (qty < 0) {
      qty = 0;
    } else {
      this.updateRewardRow(row, qty, 1);
    }
  }

  addRewardToCart(row: RedemptionReward) {
    const index = this.rewardCart.findIndex(item => item.productCode === row.productCode);
    if (index === -1) {
      this.rewardCart.push({
        ...row
      });
    } else {
      this.rewardCart[index].quantity += row.quantity;
      this.rewardCart[index].useCash += row.useCash;
      this.rewardCart[index].usePoint += row.usePoint;
      this.rewardCart[index].displayInventoryBalance = row.displayInventoryBalance;
      this.rewardCart[index].displayRedeemCount = row.displayRedeemCount;
    }
    this.translateService.get('redeem.addToCart', {
      'NAME': row.productName
      , 'QUANTITY': row.quantity
    }).subscribe((result: string) => {
      this.snackBar.open(result, '', {
        duration: 2000
      });
    });

    this.resetRewardRow(row);
  }

  resetRewardRow(row) {
    row.useCash = 0;
    row.usePoint = 0;
    row.quantity = 0;
  }

  updateRewardRow(row, qty, diff) {
    row.usePoint = row.point * qty;
    row.useCash = row.cash * qty;
    row.quantity = qty;

    row.displayInventoryBalance += diff;
    row.displayRedeemCount += diff;
  }

}
