import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { PromotionData } from '../promotion.data';
import { PromotionStore } from '../promotion.store';
import { AttrData } from './attr.data';
import { AttrService } from './attr.service';

@Component({
  selector: 'app-attr',
  templateUrl: './attr.component.html',
  styleUrls: ['./attr.component.scss']
})
export class AttrComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() promotionId: number;
  @Input() programId: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(this.promotionId); });

  selectedRow: AttrData;
  dataSource: AttrData[];
  displayedColumns: string[] = ['promotionAttr', 'promotionAttrInitValue', 'activeFlag'];

  promotionSubscription: Subscription;
  promotionData: PromotionData;

  searchForm: FormGroup;
  createForm: FormGroup;

  promotionAttrDataTypeList: Dropdown[];

  submitted = false;
  created = false;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private attrService: AttrService,
    private promotionStore: PromotionStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'PROGRAM_DATA_TYPE_ATTRIBUTE' }).then(result => {
      this.promotionAttrDataTypeList = result.data.filter(item => item.codeId !== 'Date');
    });

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
      promotionAttr: ['', Validators.required],
      promotionAttrDataTypeId: ['', Validators.required],
      promotionAttrInitValue: [''],
      activeFlag: ['']

    });
    this.search(this.promotionData.promotionId);

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  ngOnDestroy() {
    this.promotionSubscription.unsubscribe();
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.search(this.promotionData.promotionId);
  }

  search(promotionId: number) {
    // console.log("promotionId : "+promotionId);
    this.attrService.getPromotionAttributeList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        sortColumn: this.tableControl.sortColumn,
        sortDirection: this.tableControl.sortDirection,
        promotionId: promotionId
      }
    }).then(result => {
      if (result.status) {
        // console.log(result.data);
        this.dataSource = result.data;
        this.tableControl.total = result.total;
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
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onSave(e) {
    this.submitted = true;
    const param = {
      ...this.createForm.value,
      createdDate: this.selectedRow.createdDate,
      createdBy: this.selectedRow.createdBy,
      updatedDate: this.selectedRow.updatedDate,
      updatedBy: this.selectedRow.updatedBy,
      promotionAttrId: this.selectedRow.promotionAttrId,
      promotionId: this.promotionId,
      programId: this.programId,
      activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.attrService.savePromotionAttribute({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
        Utils.showSuccess(this.created, 'Promotion Attribute');
        this.search(this.promotionData.promotionId);
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clear() {
    // this.searchForm.reset();
    // this.clearSort();
    this.selectedRow = null;
  }

}

