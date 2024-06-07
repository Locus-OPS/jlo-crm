import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown, DropdownModel } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { SaleProductCategory } from './saleproductcategory.model';
import { SaleproductcategoryService } from './saleproductcategory.service';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';

@Component({
  selector: 'app-saleproductcategory',
  templateUrl: './saleproductcategory.component.html',
  styleUrls: ['./saleproductcategory.component.scss']
})
export class SaleproductcategoryComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  sortColumn: string;
  sortDirection: string;
  selectedRow: SaleProductCategory;
  dataSource: SaleProductCategory[];

  displayedColumns: string[] = ['categoryCode', 'categoryName', 'level',
    'categoryStatusName', 'remark'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  saleProductCategoryStatusList: Dropdown[];
  productCategoryLevelList: Dropdown[];
  parentSaleProductCategoryList: DropdownModel[];
  allSaleProductCategoryList = [];

  submitted = false;
  isReadOnly = false;
  created = false;

  constructor(
    public api: ApiService
    , private formBuilder: UntypedFormBuilder
    , private saleproductcategoryService: SaleproductcategoryService
    , public router: Router
    , public globals: Globals
  ) {
    super(router, globals);
    api.getSaleProductCategory().then(result => { this.allSaleProductCategoryList = result.data; });
    api.getMultipleCodebookByCodeType({
      data: ['CATEGORY_STATUS', 'PRODUCT_CATEGORY_LEVEL']
    }).then(
      result => {
        this.saleProductCategoryStatusList = result.data['CATEGORY_STATUS'];
        this.productCategoryLevelList = result.data['PRODUCT_CATEGORY_LEVEL'];
      }
    );
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      categoryCode: [''],
      categoryName: [''],
      level: [''],
      categoryStatus: [''],
      remark: ['']
    });

    this.createForm = this.formBuilder.group({
      categoryCode: [''],
      categoryName: ['', Validators.required],
      parentCategoryCode: [''],
      level: ['', Validators.required],
      categoryStatus: ['', Validators.required],
      categoryStatusName: [''],
      remark: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    // this.CHECK_FORM_PERMISSION(this.createForm);
    this.search();
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
    this.saleproductcategoryService.getSaleProductCategoryList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.parentSaleProductCategoryList = this.allSaleProductCategoryList.filter((cat) => cat.codeId != row.categoryCode);
    this.createForm.patchValue(this.selectedRow);
  }

  sortData(e) {
    this.tableControl.sortColumn = e.active;
    this.tableControl.sortDirection = e.direction;
    this.search();
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Product has been created.!' : 'Product has been updated.';
    const param = {
      ...this.createForm.value
      , categoryCode: this.selectedRow.categoryCode
    };

    if (this.createForm.invalid) {
      return;
    }

    this.saleproductcategoryService.saveSaleProductCategory({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.parentSaleProductCategoryList = this.allSaleProductCategoryList;
    this.createForm.patchValue({ categoryStatus: '01' });
  }
}
