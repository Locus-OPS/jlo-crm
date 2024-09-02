import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from 'src/app/shared/base.component';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TableControl } from 'src/app/shared/table-control';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../system/user/user.service';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { Dropdown } from 'src/app/model/dropdown.model';
import { DepartmentModel } from './department.model';
import { DepartmentService } from '../../system/department/department.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-modal-department',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-department.component.html',
  styleUrl: './modal-department.component.scss'
})
export class ModalDepartmentComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selectedRow: DepartmentModel;
  dataSource: DepartmentModel[];
  displayedColumns: string[] = ['id', 'departmentName', 'statusName', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  searchForm: FormGroup;
  statusList: Dropdown[];
  businessUnitList: Dropdown[];

  deptStatusList: Dropdown[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public deptInfo: any,
    private dialogRef: MatDialogRef<ModalUserComponent>,
    public api: ApiService,
    private deptService: DepartmentService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType({
      data: ['ACTIVE_FLAG']
    }).then(
      result => {
        this.statusList = result.data['ACTIVE_FLAG'];
      }
    );
    api.getBusinessUnit().then(result => { this.businessUnitList = result.data; });

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      departmentName: [''],
      statusCd: ['']
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
    const param = {
      ...this.searchForm.value
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

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  onSelectRow(row) {
    this.deptInfo = row;
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
