import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UserLogComponent } from './log/user-log/user-log.component';
import { TableControl } from 'src/app/shared/table-control';
import { UserService } from './user.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UserData } from './user.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: UserData;
  dataSource: UserData[];
  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'buName', 'divName', 'roleName', 'posName', 'useYn'];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  loginTypes: Dropdown[];
  statusList: Dropdown[];
  businessUnitList: Dropdown[];
  roleList: Dropdown[];
  posList: Dropdown[];

  selectedFiles: FileList;
  submitted = false;
  imageSrc: string;
  uploadProgress = 0;

  constructor(
    public api: ApiService,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals,
    public dialog: MatDialog
  ) {
    super(router, globals);
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
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
    this.searchForm = this.formBuilder.group({
      userId: [''],
      firstName: [''],
      lastName: [''],
      status: [''],
      buId: [''],
      roleCode: ['']
    });
    this.createForm = this.formBuilder.group({
      id: [''],
      useYn: [''],
      loginType: ['', Validators.required],
      userId: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickname: [''],
      posId: ['', Validators.required],
      buId: ['', Validators.required],
      roleCode: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
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

  create() {
    this.selectedRow = {};
    this.imageSrc = null;
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.submitted = false;
  }

  onSelectRow(row) {
    this.submitted = true;
    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
      , buId: this.selectedRow.buId.toString()
    });
  }

  onSave() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.userService.saveUser({
      data: this.createForm.value
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        this.createForm.patchValue({
          ...this.selectedRow
          , buId: this.selectedRow.buId.toString()
      });
        Utils.alertSuccess({
          title: 'Updated!',
          text: 'User has been updated.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });
  }

  onDelete(row: UserData) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.userService.deleteUser({
          data: row.id
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'User has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
        }, error => {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        });
      }
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = <string>reader.result;

      reader.readAsDataURL(file);
    }
  }

  upload() {
    this.uploadProgress = 0;
    this.api.uploadProfileImage(this.selectedFiles.item(0), this.selectedRow.id, this.selectedRow.userId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        if (event.status === 200) {
          Utils.alertSuccess({
            title: 'Uploaded!',
            text: 'Profile image has been updated.',
          });
          this.selectedRow.pictureUrl = <string>event.body;
        } else {
          Utils.alertError({
            text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          });
        }
        this.uploadProgress = 0;
        this.imageSrc = null;
      }
    });
    this.selectedFiles = null;
  }

  showLog() {
    const dialogRef = this.dialog.open(UserLogComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: { userId: this.selectedRow.userId }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

}
