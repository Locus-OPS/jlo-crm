import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RoleService } from '../role/role.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { DepartmentModel } from './department.model';
import { TableControl } from 'src/app/shared/table-control';
import { DepartmentService } from './department.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
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
  createDeptTeamForm: FormGroup;


  searchFormTeamDept: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private deptService: DepartmentService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
  }

  ngOnInit() {

    this.searchFormDept = this.formBuilder.group({
      departmentName: [''],
      statusCd: ['']
    });

    this.createDeptForm = this.formBuilder.group({
      id: [''],
      departmentName: ['', Validators.required],
      description: ['', Validators.required],
      statusCd: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: ['']
    });

    this.createDeptTeamForm = this.formBuilder.group({
      id: [''],
      teamName: [''],
      departmentId: ['', Validators.required],
      description: ['', Validators.required],
      statusCd: ['', Validators.required],
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

  onSelectRow(row) {
    this.selectedRow = row;
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

}
