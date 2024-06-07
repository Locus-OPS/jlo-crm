import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import Utils from 'src/app/shared/utils';
import { RedeemTransactionService } from './redeem-transaction.service';
import { RedeemTransactionData } from './redeemp-transaction-data';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { RewardData } from '../../reward-model';
import { RewardStore } from '../../reward.store';

@Component({
  selector: 'app-redeem-transaction',
  templateUrl: './redeem-transaction.component.html',
  styleUrls: ['./redeem-transaction.component.scss']
})
export class RedeemTransactionComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  rewardSubscription: Subscription;
  rewardData: RewardData;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  dataSource: RedeemTransactionData[];

  displayedColumns: string[] = ['txnId', 'memberId', 'firstName', 'lastName', 'memberTierName', 'channelName', 'redeemMethodName'
    , 'quantity', 'requestPoint', 'requestCash', 'processedDate'];

  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private redeemTransactionService: RedeemTransactionService,
    private rewardStore: RewardStore,
    public router: Router,
    public globals: Globals) {
      super(router, globals);
  }
  ngOnDestroy(): void {
    this.rewardSubscription.unsubscribe();
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      txnId: [''],
      firstName: [''],
      lastName: [''],
      memberId: [''],
      startDate: [''],
      endDate: [''],
    });

      this.rewardSubscription = this.rewardStore.getReward().subscribe(reward => {
        if (reward) {
          this.rewardData = reward;
          this.search();
        }
      });
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search(){
    this.redeemTransactionService.getRedemptionTransactionList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value,
        productId: this.rewardData.productId,
        startDate: Utils.getDateString(this.searchForm.value['startDate']),
        endDate: Utils.getDateString(this.searchForm.value['endDate']),
        sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  clear() {
    this.searchForm.reset();
    // this.clearSort();
  }

  onStartDateChange(e) {
    if (this.searchForm.controls['endDate'].value < e.value) {
      this.searchForm.patchValue({endDate: e.value});
    }
  }

  onEndDateChange(e) {
    if (this.searchForm.controls['startDate'].value > e.value) {
      this.searchForm.patchValue({startDate: e.value});
    }
  }

}
