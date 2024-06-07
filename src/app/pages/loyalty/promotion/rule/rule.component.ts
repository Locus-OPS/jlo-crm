import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { RuleData } from './rule.data';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { RuleService } from './rule.service';
import { Router } from '@angular/router';
import { CriteriaComponent } from './criteria/criteria.component';
import { ActionComponent } from './action/action.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { Subscription } from 'rxjs';
import { PromotionData } from '../promotion.data';
import { PromotionStore } from '../promotion.store';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() promotionId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('crt') crt: CriteriaComponent;
  @ViewChild('act') act: ActionComponent;

  tableControl: TableControl = new TableControl(() => { this.search(this.promotionId); });

  ruleId = 0;
  programId: number;
  selectedRow: RuleData;
  dataSource: RuleData[];
  displayedColumns: string[] = ['seq', 'rule', 'ruleQuery', 'seqControl'];

  promotionSubscription: Subscription;
  promotionData: PromotionData;

  createForm: FormGroup;

  submitted = false;
  created = false;
  deleted = false;
  isShowMoreTab = false;

  maxSeq: number;

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private ruleService: RuleService,
    private promotionStore: PromotionStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    this.promotionSubscription = this.promotionStore.getPromotion().subscribe(promotion => {
      // this.clear(); // Reset form.
      if (promotion) {
        this.promotionData = promotion;
        this.search(this.promotionData.promotionId);
      }
    });
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      rule: [''],
      promotion: [''],
      program: [''],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.search(this.promotionData.promotionId);

    if (this.CAN_WRITE()) {
      this.displayedColumns = ['seq', 'rule', 'ruleQuery', 'seqControl'];
    } else {
      this.displayedColumns = ['seq', 'rule', 'ruleQuery'];
    }
  }

  ngOnDestroy() {
    this.promotionSubscription.unsubscribe();
  }

  search(promotionId: number) {
    this.selectedRow = null;
    this.ruleService.getRuleList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        promotionId: promotionId, sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.maxSeq = result.total;
        this.tableControl.total = result.total;

        // console.log(this.dataSource);
        if(this.dataSource.length > 0 && this.isShowMoreTab){
          this.onSelectRow(this.dataSource[0]);
        }else{
          this.isShowMoreTab = false;
        }
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    new SwalComponent({
      title: 'Rule Name',
      input: 'text',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).show().then(popup => {
      if (popup.value) {
        this.submitted = true;
        this.created = true;
        if (this.createForm.invalid) {
          return;
        }
        this.ruleService.saveRule({
          data: {
            rule: popup.value
            , promotionId: this.promotionId
          }
        }).then(result => {
          if (result.status) {
            if (this.created) {
              this.search(this.promotionData.promotionId);
              this.createForm.reset();
            } else {
              Utils.assign(this.selectedRow, result.data);
              this.createForm.patchValue(result.data);
            }
            Utils.showSuccess(this.created, 'Rule');
          } else {
            Utils.showError(result, null);
          }
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    }).catch();
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.ruleId = this.selectedRow.ruleId;
    this.promotionId = this.selectedRow.promotionId;
    this.programId = this.selectedRow.programId;
    this.isShowMoreTab = true;
   
    if (this.crt !== undefined && this.act !== undefined) {
      this.crt.search(this.ruleId);
      this.act.search(this.ruleId);
    }
  }

  onSave() {

  }

  clear() {
    this.createForm.reset();
  }

  upSeq(element: any) {
    console.log('up', element);
    this.ruleService.updateSeq({
      data: {
        ruleId: element.ruleId
        , promotionId: element.promotionId
        , seq: element.seq
        , newSeq: element.seq - 1
      }
    }).then(result => {
      if (result.status) {
        this.search(this.promotionData.promotionId);
      } else {
        console.log('logic error ==============================>', result);
        Utils.showError(result, null);
      }
    }, error => {
      console.log('error ==============================>', error);
    });

  }

  downSeq(element: any) {
    this.ruleService.updateSeq({
      data: {
        ruleId: element.ruleId
        , promotionId: element.promotionId
        , seq: element.seq
        , newSeq: element.seq + 1
      }
    }).then(result => {
      if (result.status) {
        this.search(this.promotionId);
      } else {
        console.log('logic error ==============================>', result);
        Utils.showError(result, null);
      }
    }, error => {
      console.log('error ==============================>', error);
    });
  }

  showMoreTab() {
    console.log(this.isShowMoreTab);
    this.isShowMoreTab = !this.isShowMoreTab;
    console.log(this.isShowMoreTab);
  }

  onDelete(element: RuleData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.ruleService.deleteRule({
          data: {
            ruleId: element.ruleId,
            promotionId : element.promotionId,
            seq : element.seq
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Rule', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search(this.promotionData.promotionId);
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

}
