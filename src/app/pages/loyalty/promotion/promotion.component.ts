import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { PromotionData } from './promotion.data';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { PromotionService } from './promotion.service';
import { Router } from '@angular/router';
import Utils from 'src/app/shared/utils';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { PromotionStore } from './promotion.store';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  selectedRow: PromotionData;
  dataSource: PromotionData[];
  displayedColumns: string[] = ['promotion', 'startDate', 'endDate', 'promotionType', 'program', 'baseFlag', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  programList: Dropdown[];
  promotionTypeList: Dropdown[];
  memberInclusionList: Dropdown[];
  productInclusionList: Dropdown[];
  shopInclusionList: Dropdown[];
  capTypeList: Dropdown[];
  activeFlagList: Dropdown[];

  submitted = false;
  isShowMoreTab = false;
  isReadOnly = false;
  created = false;

  isShowProductTab = false;
  isShowMemberTab = false;
  isShowShopTab = false;

  promotionId: number;
  programId: number;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private promotionService: PromotionService,
    private promotionStore: PromotionStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getProgram().then(result => { this.programList = result.data; });
    api.getMultipleCodebookByCodeType({
      data: ['PROMOTION_TYPE', 'ACTIVE_FLAG', 'MEMBER_INCLUSION', 'PRODUCT_INCLUSION', 'SHOP_INCLUSION', 'CAP_TYPE']
    }).then(
      result => {
        this.promotionTypeList = result.data['PROMOTION_TYPE'];
        this.activeFlagList = result.data['ACTIVE_FLAG'];
        this.memberInclusionList = result.data['MEMBER_INCLUSION'];
        this.productInclusionList = result.data['PRODUCT_INCLUSION'];
        this.shopInclusionList = result.data['SHOP_INCLUSION'];
        this.capTypeList = result.data['CAP_TYPE'];
      }
    );
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      promotion: [''],
      programId: [''],
      promotionTypeId: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      useBasePointFlag: [''],
      baseFlag: [''],
      activeFlag: [''],

      promotionId: [''],
      promotion: ['', Validators.required],
      promotionTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      programId: ['', Validators.required],
      promotionReceiveTimeLimit: [''],
      remark: [''],

      capTypeId: ['', Validators.required],
      minCap: [''],
      maxCap: [''],

      productInclusionId: ['', Validators.required],
      memberInclusionId: ['', Validators.required],
      shopInclusionId: ['', Validators.required],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.promotionService.getPromotionList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      if (result.status) {
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
    this.isShowMoreTab = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.checkCapType('');
  }

  onCapTypeChange(event) {
    this.checkCapType(event.value);
  }

  checkCapType(type: string) {
    switch (type) {
      case '01':  // threshold
      case '03':  // fixed
        this.createForm.get('minCap').setValidators([Validators.required]);
        this.createForm.get('minCap').enable();
        this.createForm.get('maxCap').clearValidators();
        this.createForm.get('maxCap').disable();
        this.createForm.get('maxCap').setValue('');
        break;
      case '02':  // actual
        this.createForm.get('minCap').clearValidators();
        this.createForm.get('minCap').disable();
        this.createForm.get('minCap').setValue('');
        this.createForm.get('maxCap').clearValidators();
        this.createForm.get('maxCap').disable();
        this.createForm.get('maxCap').setValue('');
        break;
      case '04':  // limit
        this.createForm.get('minCap').clearValidators();
        this.createForm.get('minCap').disable();
        this.createForm.get('minCap').setValue('');
        this.createForm.get('maxCap').setValidators([Validators.required]);
        this.createForm.get('maxCap').enable();
        break;
      case '05':  // range
        this.createForm.get('minCap').setValidators([Validators.required]);
        this.createForm.get('minCap').enable();
        this.createForm.get('maxCap').setValidators([Validators.required]);
        this.createForm.get('maxCap').enable();
        break;
      default:
        this.createForm.get('minCap').clearValidators();
        this.createForm.get('minCap').disable();
        this.createForm.get('minCap').setValue('');
        this.createForm.get('maxCap').clearValidators();
        this.createForm.get('maxCap').disable();
        this.createForm.get('maxCap').setValue('');
        break;
    }
    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.promotionId = this.selectedRow.promotionId;
    this.programId = this.selectedRow.programId;
    this.createForm.patchValue(row);
    this.checkCapType(this.selectedRow.capTypeId);
    Utils.setDatePicker(this.createForm);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'baseFlag');

    this.promotionStore.selectPromotion(this.selectedRow);

    this.setTabForShowMoreTab(this.selectedRow);
  }

  setTabForShowMoreTab(data){
      if(data.productInclusionId != '01'){
        this.isShowProductTab = true;
      }else{
        this.isShowProductTab = false;
      }

      if(data.memberInclusionId != '01'){
      this.isShowMemberTab = true;
      }else{
        this.isShowMemberTab = false;
      }

      if(data.shopInclusionId != '01'){
      this.isShowShopTab = true;
      }else{
        this.isShowShopTab = false;
      }
  }

  onSave(e) {
    this.submitted = true;
    const param = {
      ...this.createForm.value
      , startDate: Utils.getDateString(this.createForm.value['startDate'])
      , endDate: Utils.getDateString(this.createForm.value['endDate'])
      , activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
      , baseFlag: Utils.convertToYN(this.createForm.value['baseFlag'])
      , useBasePointFlag: Utils.convertToYN(this.createForm.value['useBasePointFlag'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.promotionService.savePromotion({
      data: param
    }).then(result => {
      if (result.status) {
        this.created = false;
        this.promotionId = result.data.promotionId;
        this.programId = result.data.programId;
        Utils.assign(this.selectedRow, result.data);
        this.setTabForShowMoreTab(this.selectedRow);
        this.isShowMoreTab = false;
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'baseFlag');
        Utils.setDatePicker(this.createForm);
        Utils.showSuccess(this.created, 'Promotion');
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  onStartDateChange(e) {
    if (this.createForm.controls['endDate'].value < e.value) {
      this.createForm.patchValue({ endDate: e.value });
    }
  }

  onEndDateChange(e) {
    if (this.createForm.controls['startDate'].value > e.value) {
      this.createForm.patchValue({ startDate: e.value });
    }
  }

  showMoreTab() {
    this.isShowMoreTab = !this.isShowMoreTab;
    // console.log(this.isShowMoreTab);
  }

}

