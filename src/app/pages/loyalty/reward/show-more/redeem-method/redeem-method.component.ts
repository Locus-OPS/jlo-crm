import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { TableControl } from 'src/app/shared/table-control';
import { RedeemMethodData } from './redeem-method-data';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { RedeemMethodService } from './redeem-method.service';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { RewardStore } from '../../reward.store';
import { RewardData } from '../../reward-model';

@Component({
  selector: 'app-redeem-method',
  templateUrl: './redeem-method.component.html',
  styleUrls: ['./redeem-method.component.scss']
})
export class RedeemMethodComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  rewardSubscription: Subscription;
  rewardData: RewardData;

  selectedRow: RedeemMethodData;
  dataSource: RedeemMethodData[];
  displayedColumns: string[] = ['redeemMethodTypeName', 'point', 'cash', 'createdDate', 'createdBy', 'updatedDate', 'updatedBy'];
  createForm: UntypedFormGroup;

  submitted = false;
  isPointReadonly = true;
  isCashReadonly = true;
  created = false;
  deleted = false;

  redeemMethodTypeList: Dropdown[];

  constructor(
    private redeemMethodService: RedeemMethodService,
    private rewardStore: RewardStore,
    private formBuilder: UntypedFormBuilder,
    public api: ApiService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'REWARD_REDEEM_METHOD' }).then(result => { this.redeemMethodTypeList = result.data; });
    
    this.rewardSubscription = this.rewardStore.getReward().subscribe(reward => {
      if (reward) {
        this.rewardData = reward;
        this.search();
      }
    });
  }
  ngOnDestroy(): void {
    this.rewardSubscription.unsubscribe();
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      productRedeemMethodId: [''],
      redeemMethodType: ['', Validators.required],
      point: ['', Validators.min(0)],
      cash: ['', Validators.min(0)]
    });
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  search() {
    const param = {
      productId: this.rewardData.productId
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.redeemMethodService.getRedeemMethodList({
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

    let redeemMethodType = this.createForm.value['redeemMethodType'];
    this.setValidator(redeemMethodType);

    this.submitted = true;
    const msgTitle = 'Created!';
    const msgText = 'Redeem Method has been created.!';
    const param = {
      ...this.createForm.value,
      productId: this.rewardData.productId
    };

    if (this.createForm.invalid) {
      return;
    }

    this.redeemMethodService.saveRedeemMethod({
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
        this.selectedRow = null;
        this.created = false;
        this.search();
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  setValidator(redeemMethodType: string) {
    
    switch (redeemMethodType) {
      case 'C': {
        this.createForm.controls['cash'].setValidators([Validators.required, Validators.min(0)]);
        this.createForm.controls['point'].setValidators([Validators.min(0)]);
        this.createForm.patchValue({ point: null});
        break;
      }
      case 'P': {
        this.createForm.controls['cash'].setValidators([Validators.min(0)]);
        this.createForm.patchValue({ cash: null});
        this.createForm.controls['point'].setValidators([Validators.required, Validators.min(0)]);
        break;
      }
      case 'PC': {
        this.createForm.controls['cash'].setValidators([Validators.required, Validators.min(0)]);
        this.createForm.controls['point'].setValidators([Validators.required, Validators.min(0)]);
        break;
      }
      default: {
        this.createForm.controls['cash'].setValidators([Validators.min(0)]);
        this.createForm.controls['point'].setValidators([Validators.min(0)]);
        break;
      }
    }
    this.createForm.controls['cash'].updateValueAndValidity();
    this.createForm.controls['point'].updateValueAndValidity();
  }

  create(el: HTMLElement) {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
    el.scrollIntoView({ behavior: 'smooth' });
  }

  cancel() {
    this.created = false;
    this.selectedRow = null;
  }

  onSelectRow(row) {
    this.created = false;
    this.selectedRow = row;
    this.createForm.patchValue(row);
    this.redeemMethodChange(row.redeemMethodType);
  }

  redeemMethodChange(redeemMethodType) {
    this.setValidator(redeemMethodType);
    switch (redeemMethodType) {
      case 'C': {
        this.isCashReadonly = false;
        this.isPointReadonly = true;
        break;
      }
      case 'P': {
        this.isCashReadonly = true;
        this.isPointReadonly = false;
        break;
      }
      case 'PC': {
        this.isCashReadonly = false;
        this.isPointReadonly = false;
        break;
      }
      default: {
        this.isCashReadonly = true;
        this.isPointReadonly = true;
        break;
      }
    }
  }

  onDelete(element: RedeemMethodData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.redeemMethodService.deleteRedeemMethod({
          data: {
            productRedeemMethodId: element.productRedeemMethodId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Redeem Method', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search();
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }
}
