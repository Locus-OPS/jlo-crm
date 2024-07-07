import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UserService } from '../../system/user/user.service';
import { UserData } from './modal-user'
import { TableControl } from 'src/app/shared/table-control';
import { SharedModule } from 'src/app/shared/module/shared.module';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ModalUserComponent extends BaseComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: UserData;
  dataSource: UserData[];
  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'buName', 'divName', 'roleName', 'posName', 'useYn'];

  searchForm: UntypedFormGroup;

  loginTypes: Dropdown[];
  statusList: Dropdown[];
  businessUnitList: Dropdown[];
  roleList: Dropdown[];
  posList: Dropdown[];

  selectedFiles: FileList;
  imageSrc: string;
  uploadProgress = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userInfo: any,
    private dialogRef: MatDialogRef<ModalUserComponent>,
    public api: ApiService,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    // api.getCodebookByCodeType({ data: 'LOGIN_TYPE' }).then(result => { this.loginTypes = result.data; });
    // api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.statusList = result.data; });
    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG', 'LOGIN_TYPE']
    }).then(
      result => {
        this.loginTypes = result.data['LOGIN_TYPE'];
        this.statusList = result.data['ACTIVE_FLAG'];
      }
    );
    api.getBusinessUnit().then(result => { this.businessUnitList = result.data; });
    api.getRole().then(result => { this.roleList = result.data; });
    api.getPosition().then(result => { this.posList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      userId: [''],
      firstName: [''],
      lastName: [''],
      status: [''],
      buId: [''],
      roleCode: ['']
    });

    this.search();
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.userService.getUserList({
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

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  onSelectRow(row) {
    this.userInfo = row;
    this.selectedRow = row;
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

