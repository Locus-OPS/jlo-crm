import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ShopTypeComponent } from './shop-type/shop-type.component';
import { TableControl } from 'src/app/shared/table-control';
import { ShopService } from './shop.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ShopData } from './shop.model';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  sortColumn: string;
  sortDirection: string;
  selectedRow: ShopData;
  dataSource: ShopData[];
  displayedColumns: string[] = ['shopNo', 'shopName', 'shopType', 'location', 'activeFlag'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  shopTypeList: Dropdown[];
  locationList: Dropdown[];
  activeFlagList: Dropdown[];
  submitted = false;
  editable = false;
  created = false;
  searched = false;


  constructor(
    public api: ApiService,
    private shopService: ShopService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['LOCATION_CD', 'ACTIVE_FLAG']
    }).then(
      result => {
        this.locationList = result.data['LOCATION_CD'];
        this.activeFlagList = result.data['ACTIVE_FLAG'];
      }
    );
    api.getShopType().then(result => { this.shopTypeList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      locationId: [''],
      shopTypeId: [''],
      shopName: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      shopId: [''],
      shopNo: ['', Validators.required],
      shopName: ['', Validators.required],
      shopTypeId: ['', Validators.required],
      locationId: ['', Validators.required],
      activeFlag: [''],
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
    this.searched = true;

    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.shopService.getShopList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ...this.searchForm.value,
        sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection
      }
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
    this.searched = false;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.editable = false;
    this.created = true;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.submitted = false;

  }

  onSelectRow(row: ShopData) {
    this.selectedRow = row;
    this.created = false;
    this.editable = this.selectedRow.activeFlag === 'Y' ? true : false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onCheckBoxChange(event: any) {
    event.checked === true ? this.editable = true : this.editable = false;
  }

  onSave(e) {
    //const msgTitle = this.created ? 'Created!' : 'Updated!';
    //const msgText = this.created ? 'Shop has been created.!' : 'Shop has been updated.';
    const param = {
      ...this.createForm.value
      , activeFlag: this.createForm.value['activeFlag'] === true ? 'Y' : 'N'
    };

    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.shopService.saveShop({
      data: param
    }).then(result => {
      if (result.status) {
        if (result.status) {
          Utils.assign(this.selectedRow, result.data);
          this.createForm.patchValue(result.data);
          Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
          Utils.showSuccess(this.created, 'Shop');
        } else {
          Utils.showError(result, null);
        }
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

  /*   onPage(event) {
      this.pageNo = event.pageIndex;
      this.pageSize = event.pageSize;
      this.search();
    } */

  openModal(): void {
    const dialogRef = this.dialog.open(ShopTypeComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      // Need to send any data to modal?
      // data: { name: 'max', animal: 'dog'}
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The modal was closed');
      // Need any data from modal?
      // this.animal = result;
    });
  }

}
