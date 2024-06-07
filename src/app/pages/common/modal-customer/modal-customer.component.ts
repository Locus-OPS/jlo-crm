import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroupDirective, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UserService } from '../../system/user/user.service';
import { TableControl } from 'src/app/shared/table-control';
import { CustomerData } from '../../customer/customer-data'
import { CustomerModalService } from './customer-modal-service.service';

@Component({
  selector: 'app-modal-customer',
  templateUrl: './modal-customer.component.html',
  styleUrls: ['./modal-customer.component.scss']
})
export class ModalCustomerComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['customerStatus', 'fullName', 'citizenId', 'memberCardNo', 'customerType', 'approvedDate', 'approvedBy'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  loginTypes: Dropdown[];
  statusList: Dropdown[];
  businessUnitList: Dropdown[];
  roleList: Dropdown[];
  posList: Dropdown[];

  selectedFiles: FileList;
  imageSrc: string;
  uploadProgress = 0;

  searchForm: FormGroup;

  dataSource: CustomerData[];
  selectedRow: CustomerData;

  customerStatusList = [];
  titleNameList = [];
  nationalityList = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public customerInfo: any,
    private dialogRef: MatDialogRef<ModalCustomerComponent>,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private customerModalService: CustomerModalService,
    private el: ElementRef,
    public router: Router,
    public globals: Globals) {
    super(router, globals);
    this.api.getMultipleCodebookByCodeType({
      data: ['CUSTOMER_STATUS', 'TITLE_NAME', 'NATIONALITY']
    }).then(
      result => {
        this.customerStatusList = result.data['CUSTOMER_STATUS'];
        this.titleNameList = result.data['TITLE_NAME'];
        this.nationalityList = result.data['NATIONALITY'];
      }
    );
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      citizenId: [''],
      passportNo: [''],
      memberCardNo: [''],
    });

    //this.onSearch();
  }

  onSearch() {
    this.selectedRow = null;
    this.search();
  }

  search() {
    console.log(this.searchForm.value);
    this.customerModalService.getCustomerList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      this.dataSource = result.data;
      console.log(this.dataSource);
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  selectCustomer(row) {
    this.selectedRow = row;
    this.customerInfo = row;
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
