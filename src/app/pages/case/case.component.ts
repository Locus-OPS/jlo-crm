import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { CaseService } from './case.service';
import { Case } from './case.model';

import { Dropdown } from 'src/app/model/dropdown.model';
import { Globals } from 'src/app/shared/globals';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from '../common/modal-user/modal-user.component';
import { ModalCustomerComponent } from '../common/modal-customer/modal-customer.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
    selector: 'app-case',
    templateUrl: './case.component.html',
    styleUrls: ['./case.component.scss'],
    imports: [SharedModule, CreatedByComponent]
})
export class CaseComponent extends BaseComponent implements OnInit {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;
  customerForm: UntypedFormGroup;

  divisionList: Dropdown[];
  categoryList: Dropdown[];
  typeList: Dropdown[];
  subTypeList: Dropdown[];
  priorityList: Dropdown[];
  caseChannelList: Dropdown[];
  caseStatuslList: Dropdown[];
  titleNameList: Dropdown[];



  submitted = false;

  isUpdate = false;
  selectedRow: Case;
  dataSource: Case[];
  displayedColumns: string[] = ['caseNumber', 'typeName', 'fullName', 'subTypeName', 'priorityName', 'channelName', 'customerId'];
  custParam: Object = {};
  owner: Object = {};

  maxDate: Date;

  constructor(
    public api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private caseService: CaseService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType(
      { data: ['CASE_DIVISION', 'CASE_CATEGORY', 'CASE_TYPE', 'CASE_PRIORITY', 'CASE_CHANNEL', 'CASE_STATUS', 'TITLE_NAME', 'CASE_SUBTYPE'] }
    ).then(result => {

      this.divisionList = result.data['CASE_DIVISION'];
      this.categoryList = result.data['CASE_CATEGORY'];

      this.typeList = result.data['CASE_TYPE'];
      this.priorityList = result.data['CASE_PRIORITY'];

      this.caseChannelList = result.data['CASE_CHANNEL'];
      this.caseStatuslList = result.data['CASE_STATUS'];
      this.titleNameList = result.data['TITLE_NAME'];
      this.subTypeList = result.data['CASE_SUBTYPE'];

    });
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      caseNumber: [''],
      division: [''],
      type: [''],
      subType: [''],
      customerId: [''],
      customerDisplay: [''],
      ownerId: [''],
      ownerDisplay: [''],
      status: [''],
      channel: [''],
      openedDateStart: [''],
      openedDateEnd: [''],
      closedDateStart: [''],
      closedDateEnd: [''],
    });


    this.createForm = this.formBuilder.group({
      caseNumber: [''],
      division: [''],
      type: [''],
      subType: [''],
      subject: [''],
      detail: [''],
      priority: [''],
      channel: [''],
      status: [''],
      createdBy: [''],
      createdByName: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedByName: [''],
      updatedDate: [''],
      dueDate: [''],
      openedDate: [''],
      closedDate: [''],
      customerId: [''],
      displayName: [''],
    });

    this.customerForm = this.formBuilder.group({
      customerId: [''],
      title: [''],
      firstName: [''],
      lastName: [''],
      customerType: [''],
      businessName: [''],
      phoneNo: [''],
      email: [''],
    });

    this.search();
  }

  search() {
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
      , openedDateStart: Utils.getDateTimeString(this.searchForm.value['openedDateStart'], '')
      , openedDateEnd: Utils.getDateTimeString(this.searchForm.value['openedDateEnd'], '')
      , closedDateStart: Utils.getDateTimeString(this.searchForm.value['closedDateStart'], '')
      , closedDateEnd: Utils.getDateTimeString(this.searchForm.value['closedDateEnd'], '')

    };
    //return;
    this.caseService.getCaseList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'กรุณาลองใหม่ภายหลัง',
      });
    });
  }

  create() {
    this.isUpdate = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onCaseEdit(e) {
    this.gotoCaseDetail(e);
  }

  gotoCaseDetail(element) {
    this.router.navigate([
      "/casedetails", { caseNumber: element.caseNumber }
    ]);
  }

  onCaseCreate() {
    this.router.navigate([
      "/casedetails"
    ]);
  }

  onSelectRow(row: Case) {
    this.selectedRow = row;
    this.customerForm.patchValue(row);
    this.createForm.patchValue(row);
  }

  onSave() {

  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  getCaseTypeId(caseTypeId: Event) {
    const data = `CASE_SUBTYPE,${caseTypeId}`;
    this.api.getCodebookByCodeTypeAndParentId({ data: data }).then(result => { this.subTypeList = result.data; });
  }


  showOwner() {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchForm.patchValue({ ownerId: result.id, ownerDisplay: result.displayName });
      }
    });
  }

  removeOwner() {
    this.searchForm.patchValue({ ownerId: '', ownerDisplay: '' });
  }

  searchCustomer() {
    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      height: '85%',
      width: '90%',
      panelClass: 'my-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let fullname: String;
        if (result.customerType) {
          fullname = result.firstName + ' ' + result.lastName;
        }
        else {
          fullname = result.businessName;
        }
        this.searchForm.patchValue({ customerId: result.customerId, customerDisplay: fullname });
      }
    });
  }

  removeCustomer() {
    this.searchForm.patchValue({ customerId: '', customerDisplay: '' });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

    if (this.searchForm.value['openedDateEnd']) {
      if (this.searchForm.value['openedDateEnd'] < this.searchForm.value['openedDateStart']) {
        this.searchForm.get('openedDateEnd').setValue(this.searchForm.value['openedDateStart']);
      }
    }
    if (this.searchForm.value['openedDateStart']) {
      if (!this.searchForm.value['openedDateEnd']) {
        this.searchForm.get('openedDateEnd').setValue(this.searchForm.value['openedDateStart']);
      }
    }

    if (this.searchForm.value['closedDateEnd']) {
      if (this.searchForm.value['openedDateEnd'] < this.searchForm.value['closedDateEnd']) {
        this.searchForm.get('closedDateEnd').setValue(this.searchForm.value['openedDateEnd']);
        this.searchForm.get('closedDateStart').setValue(this.searchForm.value['openedDateEnd']);
      }
      else if (this.searchForm.value['closedDateEnd'] < this.searchForm.value['closedDateStart']) {
        this.searchForm.get('closedDateEnd').setValue(this.searchForm.value['closedDateStart']);
      }
    }
    if (this.searchForm.value['closedDateStart']) {
      if (this.searchForm.value['openedDateEnd'] > this.searchForm.value['closedDateStart']) {
        this.searchForm.get('closedDateEnd').setValue(this.searchForm.value['openedDateEnd']);
        this.searchForm.get('closedDateStart').setValue(this.searchForm.value['openedDateEnd']);
      }
      else if (!this.searchForm.value['closedDateEnd']) {
        this.searchForm.get('closedDateEnd').setValue(this.searchForm.value['closedDateStart']);
      }
    }
  }

}
