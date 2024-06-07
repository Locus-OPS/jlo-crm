import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { ProductData } from './product-data';
import { ProductService } from './product.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  sortColumn: string;
  sortDirection: string;
  selectedRow: ProductData;
  dataSource: ProductData[];
  displayedColumns: string[] = ['productCode', 'product', 'loyProductType', 'campaign',
    'productCategory', 'productSubCategory', 'program', 'startDate', 'endDate', 'productActiveFlag'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  productCategoryList: Dropdown[];
  productSubCategoryList: Dropdown[];
  allProductSubCategoryList: Dropdown[];
  campaignList: Dropdown[];
  activeCampaignList: Dropdown[];
  programList: Dropdown[];
  loyProductTypeList: Dropdown[];
  productActiveFlagList: Dropdown[];

  submitted = false;
  isReadOnly = false;
  created = false;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private productService: ProductService,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['LOYALTY_PRODUCT_TYPE', 'LOY_PRODUCT_CATEGORY', 'LOY_PRODUCT_SUB_CATEGORY', 'ACTIVE_FLAG']
    }).then(
      result => {
        this.loyProductTypeList = result.data['LOYALTY_PRODUCT_TYPE'];
        this.productCategoryList = result.data['LOY_PRODUCT_CATEGORY'];
        this.allProductSubCategoryList = result.data['LOY_PRODUCT_SUB_CATEGORY'];
        this.productActiveFlagList = result.data['ACTIVE_FLAG'];
      }
    );

    api.getProgram().then(result => { this.programList = result.data; });
    api.getCampaign().then(result => {
      this.campaignList = result.data;
      this.activeCampaignList = result.data.filter((item) => item.activeFlag === "Y");
    });
  }

  ngOnInit() {
    this.productSubCategoryList = [];

    this.searchForm = this.formBuilder.group({
      productCode: [''],
      product: [''],
      productActiveFlag: [''],
      productCategoryId: [''],
      campaignId: [''],
      programId: [''],
      loyProductTypeId: [''],
    });

    this.createForm = this.formBuilder.group({
      programId: ['', Validators.required],
      productCode: ['', Validators.required],
      product: ['', Validators.required],
      loyProductTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      activeFlag: [''],
      campaignId: [''],
      productCategoryId: [''],
      productSubCategoryId: [''],
      productPrice: [''],
      productPointUse: [''],
      productDetail: [''],
      productActiveFlag: [''],
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

    this.productService.getProductList({
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

  sortData(e) {
    this.tableControl.sortColumn = e.active;
    this.tableControl.sortDirection = e.direction;
    this.search();
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.productSubCategoryList = [];
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.createForm.patchValue({ productPrice: '0', productPointUse: '0' });
  }

  onSelectRow(row: ProductData) {
    //console.log(row);
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.setDatePicker(this.createForm);
    this.productSubCategoryList = this.allProductSubCategoryList.filter((subCategory) => subCategory.parentId === this.selectedRow.productCategoryId);
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Product has been created.!' : 'Product has been updated.';
    const param = {
      ...this.createForm.value
      , productId: this.selectedRow.productId
      , startDate: Utils.getDateString(this.createForm.value['startDate'])
      , endDate: Utils.getDateString(this.createForm.value['endDate'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.productService.saveProduct({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.setDatePicker(this.createForm);
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

  onChangeParentCategory(parentValue) {
    this.createForm.patchValue({ productSubCategoryList: '' });
    this.productSubCategoryList = this.allProductSubCategoryList.filter((subCategory) => subCategory.parentId === parentValue);
  }

}
