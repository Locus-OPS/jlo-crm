import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { RewardOnHandData } from './reward-on-hand-data';
import { RewardOnHandService } from './reward-on-hand.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { RewardData } from '../../reward-model';
import { RewardStore } from '../../reward.store';

@Component({
  selector: 'app-reward-on-hand',
  templateUrl: './reward-on-hand.component.html',
  styleUrls: ['./reward-on-hand.component.scss'],
  encapsulation: ViewEncapsulation.None //- for the center alignment of reward number, adjust this.
})
export class RewardOnHandComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  rewardSubscription: Subscription;
  rewardData: RewardData;

  dataSource: RewardOnHandData[];
  displayedColumns: string[] = ['onhandType', 'amount', 'remark', 'createdDate', 'createdBy'];
  createForm: FormGroup;
  created: boolean;
  submitted: boolean;
  rewardOnHandTypeList: Dropdown[];

  rewardBalance = 0;
  rewardRedemptionTransaction = 0;

  constructor(
    private rewardOnHandService: RewardOnHandService,
    private rewardStore: RewardStore,
    private formBuilder: FormBuilder,
    public api: ApiService,
    public router: Router,
    public globals: Globals
    ) {
      super(router, globals);
    api.getCodebookByCodeType({ data: 'REWARD_ON_HAND_TYPE' }).then(result => { this.rewardOnHandTypeList = result.data; });
    
    this.rewardSubscription = this.rewardStore.getReward().subscribe(reward => {
      if (reward) {
        this.rewardData = reward;
        this.displaySummaryValue();
        this.search();
      }
    });
  }
  ngOnDestroy(): void {
    this.rewardSubscription.unsubscribe();
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      productOnhandId: [''],
      onhandType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      remark: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  displaySummaryValue() {
    this.rewardOnHandService.getRewardBalance({ data: this.rewardData.productId }).then(
      result => { this.rewardBalance = result.data.result; });
      this.rewardOnHandService.getRewardRedemptionTransaction({ data: this.rewardData.productId }).then(
      result => { this.rewardRedemptionTransaction = result.data.result; });
  }

  search() {
    const param = {
        productId: this.rewardData.productId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.rewardOnHandService.getRewardOnHandList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = 'Created!';
    const msgText = 'Reward On-Hand has been created.!';
    const param = {
      ...this.createForm.value,
      productId: this.rewardData.productId
    };

    if (this.createForm.invalid) {
      return;
    }

    this.rewardOnHandService.saveRewardOnHand({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
        if (this.createFormDirective) {
          this.createFormDirective.resetForm();
        }
        
        this.displaySummaryValue();
        this.search();
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

}
