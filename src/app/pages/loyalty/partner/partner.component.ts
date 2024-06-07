import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { PartnerTypeComponent } from './partner-type/partner-type.component';
import { TableControl } from 'src/app/shared/table-control';
import { PartnerService } from './partner.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { PartnerData } from './partner-data';
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: PartnerData;
  dataSource: PartnerData[];
  displayedColumns: string[] = ['partnerNo', 'partner', 'partnerType', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  partnerTypeList: Dropdown[];
  activeFlagList: Dropdown[];

  submitted = false;
  editable = false;
  created = false;

  constructor(
    public api: ApiService,
    private partnerService: PartnerService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.activeFlagList = result.data; });
    api.getPartnerType().then(result => { this.partnerTypeList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      partnerNo: [''],
      partner: [''],
      partnerTypeId: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      partnerNo: ['', Validators.required],
      partner: ['', Validators.required],
      partnerTypeId: ['', Validators.required],
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
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.partnerService.getPartnerList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
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
    this.selectedRow = {};
    this.createForm.reset();
    this.submitted = false;
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSelectRow(row: PartnerData) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onSave(e) {
    this.submitted = true;
    const param = {
      ...this.createForm.value
      , partnerId: this.selectedRow.partnerId
      , activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.partnerService.savePartner({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
        Utils.showSuccess(this.created, 'Partner');
        //this.search();
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

  openModal(): void {
    const dialogRef = this.dialog.open(PartnerTypeComponent, {
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
