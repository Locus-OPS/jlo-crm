import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Dropdown, DropdownModel } from 'src/app/model/dropdown.model';
import { DepartmentService } from '../department/department.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Globals } from 'src/app/shared/globals';
import { DepartmentTeamService } from './department-team.service';
import { DepartmentTeamModel } from './departmentTeam.model';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { TabParam } from 'src/app/layouts/admin/tab-manage.service';

@Component({
  selector: 'app-department-team',
  standalone: true,
  imports: [SharedModule, CreatedByComponent],
  templateUrl: './department-team.component.html',
  styleUrl: './department-team.component.scss'
})
export class DepartmentTeamComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  departmentId: string;

  selectedRow: DepartmentTeamModel;
  dataSource: DepartmentTeamModel[];
  displayedColumns: string[] = ['id', 'teamName', 'statusName', 'departmentName', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });


  createDeptTeamForm: FormGroup;
  searchFormTeamDept: FormGroup;


  deptStatusList: Dropdown[];
  departmentList: Dropdown[];

  constructor(
    private formBuilder: FormBuilder,
    private deptTeamService: DepartmentTeamService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public api: ApiService,
    private tabParam: TabParam,
  ) {
    super(router, globals);

    api.getDepartment().then(result => { this.departmentList = result.data; });

    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG']
    }).then(
      result => {

        this.deptStatusList = result.data['ACTIVE_FLAG'];
      }
    );
  }

  ngOnInit() {

    this.searchFormTeamDept = this.formBuilder.group({
      departmentId: [''],
      teamName: [''],
      statusCd: ['']
    });

    this.createDeptTeamForm = this.formBuilder.group({
      id: [''],
      teamName: ['', Validators.required],
      departmentId: ['', Validators.required],
      statusCd: ['', Validators.required],
      description: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: ['']
    });


    if (this.tabParam.params['departmentId']) {
      this.departmentId = this.tabParam.params['departmentId'];
      this.searchFormTeamDept.patchValue({ departmentId: this.departmentId });
    }

    this.search();
  }






  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchFormTeamDept.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.deptTeamService.getDepartmentTeamList({
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
    this.createDeptTeamForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }


  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.deptTeamService.deleteDepartmentTeam({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Team has been deleted.',
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

  onSelectRow(row: DepartmentTeamModel) {
    this.selectedRow = row;
    console.log(this.selectedRow);
    this.createDeptTeamForm.patchValue(this.selectedRow);
  }


  onSave() {

    if (this.createDeptTeamForm.invalid) {
      return;
    }


    this.deptTeamService.saveDepartmentTeam({
      data: {
        ...this.createDeptTeamForm.value
      }
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createDeptTeamForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Team has been saved.',
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
