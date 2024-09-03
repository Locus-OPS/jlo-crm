import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';

import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup, FormGroupDirective, UntypedFormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../role/role.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { DepartmentModel } from './department.model';
import { TableControl } from 'src/app/shared/table-control';
import { DepartmentService } from './department.service';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { CreatedByComponent } from '../../common/created-by/created-by.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],

})
export class DepartmentComponent extends BaseComponent implements OnInit {
  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  selectedRow: DepartmentModel;
  dataSource: DepartmentModel[];
  displayedColumns: string[] = ['id', 'departmentName', 'statusName', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchFormDept: FormGroup;
  createDeptForm: FormGroup;


  deptStatusList: Dropdown[];

  constructor(
    private formBuilder: FormBuilder,
    private deptService: DepartmentService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public api: ApiService,
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG']
    }).then(
      result => {

        this.deptStatusList = result.data['ACTIVE_FLAG'];
      }
    );
  }

  ngOnInit() {

    this.searchFormDept = this.formBuilder.group({
      departmentName: [''],
      statusCd: ['']
    });

    this.createDeptForm = this.formBuilder.group({
      id: [''],
      departmentName: ['', Validators.required],
      statusCd: ['', Validators.required],
      description: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: ['']
    });



    this.search();

  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchFormDept.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.deptService.getDepartmentList({
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





  createDept() {
    this.selectedRow = {};
    this.createDeptForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }


  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.deptService.deleteDepartment({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Department has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            });
          }
        });
      }
    });
  }

  onSelectRow(row: DepartmentModel) {
    this.selectedRow = row;
    console.log(this.selectedRow);
    this.createDeptForm.patchValue(this.selectedRow);
  }


  onSave() {
    if (this.createDeptForm.invalid) {
      return;
    }

    this.deptService.saveDepartment({
      data: {
        ...this.createDeptForm.value
      }
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createDeptForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Department has been saved.',
        });
        this.search();
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });
  }

  gotoDepartmentTeamPage() {
    this.router.navigate([
      "/system/department-team",
      {
        departmentId: this.createDeptForm.controls['id'].value,
      },
    ]);


  }

}
