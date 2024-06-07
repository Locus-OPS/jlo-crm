import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { CardTierData } from './card-tier-data';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CardTierService } from './card-tier.service';
import Utils from 'src/app/shared/utils';
import { Subscription } from 'rxjs';
import { TierData } from '../../tier-tab/tier-data';
import { TierStore } from '../../tier-tab/tier.store';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-card-tier',
  templateUrl: './card-tier.component.html',
  styleUrls: ['./card-tier.component.scss']
})
export class CardTierComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tierSubscription: Subscription;
  tierData: TierData;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: CardTierData;
  dataSource: CardTierData[];
  displayedColumns: string[] = ['cardType', 'prefix', 'primaryFlag'];

  createForm: UntypedFormGroup;

  submitted = false;
  created = false;
  deleted = false;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private cardTierService: CardTierService,
    private tierStore: TierStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    this.tierSubscription = this.tierStore.getTier().subscribe(tier => {
      if (tier) {
        this.tierData = tier;
        this.search();
      }
    });
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
    this.createForm = this.formBuilder.group({
      tierId: [],
      tierCardTypeId: [],
      cardType: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      previousPrefix: [],
      primaryFlag: [],
      previousPrimaryFlag: [],
      createdDate: [],
      createdBy: [],
      updatedDate: [],
      updatedBy: []
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  ngOnDestroy() {
    this.tierSubscription.unsubscribe();
  }

  search() {
    this.selectedRow = null;
    this.cardTierService.getCardTierList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        tierId: this.tierData.tierId, sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.tableControl.total = result.total;
        this.created = false;
      } else {
        this.showError(result, null);
      }
    }, error => {
      this.showError(null, error);
    });
  }

  showError(obj1, obj2) {
    if (obj1 !== null) {
      Utils.alertError({
        text: `There is a logical problem.
        errorCode : ${obj1.errorCode}
        message : ${obj1.message}`,
      });
    } else {
      Utils.alertError({
        text: `There is a problem in the server, please, try later.
        errorCode : ${obj2.errorCode}
        message : ${obj2.message}`,
      });
    }
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.createForm.patchValue({ 'previousPrimaryFlag':  false});
  }

  cancel() {
    this.created = false;
    this.onSelectRow(this.selectedRow);
  }

  onSelectRow(row: CardTierData) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'primaryFlag');
    this.createForm.patchValue({ 'previousPrimaryFlag':  this.createForm.value['primaryFlag']});
    this.createForm.patchValue({ 'previousPrefix':  this.createForm.value['prefix']});
  }

  verifyPrimaryFlag() {
    if (this.createForm.invalid) {
      return;
    }
    let primaryFlag = this.createForm.value['primaryFlag'];
    let previousPrimaryFlag = this.createForm.value['previousPrimaryFlag'];
    if (primaryFlag && !previousPrimaryFlag) {
      let tierCardTypeId = this.createForm.value['tierCardTypeId'];
      this.cardTierService.getPrimaryCardTier({
        data: {
          tierId: this.tierData.tierId
        }
      }).then(result => {
        if (result.data) {
          let cardType = result.data.cardType;
          Utils.confirm("Warning", "Save this card tier as a primary will remove primary flag from \"" + cardType + "\" card tier, do you want to save this card tier?", "Save Card Tier").then(confirm => {
            if (confirm.value) {
              this.verifyDuplicatePrefix(result.data.tierCardTypeId);
            }
          });
        } else {
          this.verifyDuplicatePrefix(null);
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later - from Card Tier Service.',
        });
      });
    } else {
      this.verifyDuplicatePrefix(null);
    }
  }

  verifyDuplicatePrefix(removePrimaryCardTierId: number) {

    let previousPrefix = this.createForm.value['previousPrefix'];
    let prefix = this.createForm.value['prefix'];

    if (previousPrefix == prefix) {
      this.save(removePrimaryCardTierId);
    } else {
      const param = {
        prefix : prefix,
        programId: this.tierData.programId
      };
      this.cardTierService.getCardTierListWithoutPaging({
        data: param
      }).then(result => {
        if (result.status) {
          if (result.data.length == 0) {
            this.save(removePrimaryCardTierId);
          } else {
            Utils.alertError({
              text: 'Cannot save this card tier becuse prefix code ' + prefix + " is existed in this program.",
            });
          }
        } else {
          console.log("Error: " + result.message);
          Utils.alertError({
            text: 'Please, try again later',
          });
        }
      }, error => {
        Utils.alertError({
          text: 'Please, try again later',
        });
      });
    }
  }

  save(removePrimaryCardTierId: number) {
    this.submitted = true;
    this.cardTierService.saveCardTier({
      data: {
        ...this.createForm.value
        , tierId: this.tierData.tierId
        , primaryFlag: Utils.convertToYN(this.createForm.value['primaryFlag'])
        , removePrimaryCardTierId: removePrimaryCardTierId
      }
    }).then(result => {
      if (result.status) {
        if (this.created) {
          this.search();
          this.createForm.reset();
          if (this.createFormDirective) {
            this.createFormDirective.resetForm();
          }
        } else {
          Utils.assign(this.selectedRow, result.data);
          this.createForm.patchValue(result.data);
          Utils.convertToBoolean(result.data, this.createForm, 'primaryFlag');
          this.createForm.patchValue({ 'previousPrimaryFlag':  this.createForm.value['primaryFlag']});
          this.createForm.patchValue({ 'previousPrefix':  this.createForm.value['prefix']});
          if (removePrimaryCardTierId) {
            this.search();
          }
        }
        this.showSuccess();
      } else {
        this.showError(result, null);
      }
    }, error => {
      console.log('error ==============================>', error);
      this.showError(null, error);
    });
  }

  showSuccess() {
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Card Tier has been created.!' : 'Card Tier has been updated.';
    Utils.alertSuccess({
      title: msgTitle,
      text: msgText,
    });
  }

  clear() {
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onDelete(element: CardTierData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.cardTierService.deleteCardTier({
          data: {
            tierCardTypeId: element.tierCardTypeId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Card Tier', this.deleted);
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

