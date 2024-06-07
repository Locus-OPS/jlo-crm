import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

export interface ShopTypeData {

  shopType?: string;
  shopTypeId?: string;
  activeFlag?: string;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
@Component({
  selector: 'app-shop-type',
  templateUrl: './shop-type.component.html',
  styleUrls: ['./shop-type.component.scss']
})
export class ShopTypeComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  sortColumn: string;
  sortDirection: string;
  selectedRow: ShopTypeData;
  dataSource: ShopTypeData[];
  displayedColumns: string[] = ['shopType', 'activeFlag'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  activeFlagList: Dropdown[];
  shopTypeList: Dropdown[];

  submitted = false;
  editable = false;
  created = false;
  searched = false;


  constructor(
    public dialogRef: MatDialogRef<ShopTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShopTypeData, // DialogData,
    public api: ApiService, private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.activeFlagList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      shopType: [''],
      shopTypeId: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      shopTypeId: [''],
      shopTypeName: ['', Validators.required],
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
    this.search();
  }

  search() {

    /** Need to check - When navigate to other pages and search,
     * the page range is not correctly updated.
     * The total number is updated by this code **/
    if (this.searched) {
      this.tableControl.pageNo = 0;
      this.tableControl.total = 0;
    }

    this.selectedRow = null;
    this.api.getShopTypeList({
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
    this.submitted = false;
  }

  onSelectRow(row) {
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
    //const msgText = this.created ? 'Shop Type has been created.!' : 'Shop Type has been updated.';
    const param = {
      ...this.createForm.value
      , activeFlag: this.createForm.value['activeFlag'] === true ? 'Y' : 'N'
    };

    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.api.saveShopType({
      data: param
    }).then(result => {
      if (result.status) {
        if (result.status) {
          Utils.assign(this.selectedRow, result.data);
          this.createForm.patchValue(result.data);
          Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
          Utils.showSuccess(this.created, 'ShopType');
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

  onClose(): void {
    this.dialogRef.close();
  }

}
