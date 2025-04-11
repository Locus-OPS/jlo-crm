import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { TableControl } from 'src/app/shared/table-control';
import { UserService } from './claim-process.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { UserData } from './claim-process.model';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-claim-process',
  templateUrl: './claim-process.component.html',
  styleUrls: ['./claim-process.component.scss'],
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})
export class ClaimProcessComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });
  selectedRow: UserData;
  dataSource: UserData[];
  displayedColumns: string[] = ['userId', 'displayName', 'buName', 'divName', 'teamName', 'roleName', 'posName', 'useYn'];

  uploadForm: UntypedFormGroup;
  file: File;

  loginTypes: Dropdown[];
  statusList: Dropdown[];
  businessUnitList: Dropdown[];
  roleList: Dropdown[];
  posList: Dropdown[];
  departmentList: Dropdown[];
  teamList: Dropdown[];

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
    api.getDepartment().then(result => { this.departmentList = result.data; });

  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
    this.uploadForm = this.formBuilder.group({
      methodCode: [''],// Validators.required],
      fileName: [''],// Validators.required],
    });

    this.search();
    this.CHECK_FORM_PERMISSION(this.uploadForm);
  }

  onSearch() {
    if (this.uploadForm.invalid) {
      return;
    }
    this.submitted = true;
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.userService.getUserList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.uploadForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
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

  selectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      this.uploadForm.patchValue({
        fileName: this.file.name
      });
    }
  }

  onSelectRow(row) {
    this.submitted = true;
    this.selectedRow = row;
  }

  onSave() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }

    this.userService.saveUser({
      data: this.uploadForm.value
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.uploadForm.patchValue(result.data);
        this.uploadForm.patchValue({
          ...this.selectedRow
          , buId: this.selectedRow.buId.toString()
        });

        this.uploadForm.patchValue({
          password: ''
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
    this.uploadForm.reset();
    this.clearSort();
    this.selectedRow = null;
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
}
