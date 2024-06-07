import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseModel } from 'src/app/shared/base.model';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { RoleService } from './role.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponsibilityComponent } from './responsibility/responsibility.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { RoleModel } from './role.model';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends BaseComponent implements OnInit {

  @ViewChild('searchFormDirective')
  searchFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  createForm: FormGroup;

  selectedRow: RoleModel;
  dataSource: RoleModel[];
  displayedColumns: string[] = ['roleName', 'useYn', 'respSetup', 'action'];

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      id: [''],
      roleCode: ['', Validators.required],
      roleName: ['', Validators.required],
      useYn: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['roleName', 'useYn', 'respSetup', 'action'];
    } else {
      this.displayedColumns = ['roleName', 'useYn', 'respSetup'];
    }
  }

  onSelectRow(row: RoleModel) {
    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
      , useYn: this.selectedRow.useYn === 'Y' ? true : false
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }
    this.roleService.saveRole({
      data: {
        ...this.createForm.value
        , useYn: this.createForm.controls['useYn'].value === true ? 'Y' : 'N'
      }
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Role has been saved.',
        });
        this.search();
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });
  }

  onDelete(element) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.roleService.deleteRole({
          data: element
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Role has been deleted.',
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

  create() {
    this.selectedRow = {};
    this.createForm.patchValue({});
    if (this.searchFormDirective) {
      this.searchFormDirective.resetForm();
    }
  }

  search() {
    this.selectedRow = null;
    const param = {
      sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.roleService.getRoleList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
    }).then(result => {
      this.dataSource = result.data;
      this.tableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  showResp(roleCode: string) {
    const dialogRef = this.dialog.open(ResponsibilityComponent, {
      height: '85%',
      width: '80%',
      panelClass: 'my-dialog',
      data: { roleCode: roleCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
