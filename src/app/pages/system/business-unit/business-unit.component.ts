import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { ApiService } from 'src/app/services/api.service';
import { BusinessUnitService } from './business-unit.service';
import { BusinessUnit } from './business-unit.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Dropdown } from 'src/app/model/dropdown.model';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-business-unit',
  templateUrl: './business-unit.component.html',
  styleUrls: ['./business-unit.component.scss']
})
export class BusinessUnitComponent extends BaseComponent implements OnInit {

  statusList: Dropdown[];

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });


  searchForm: FormGroup;
  createForm: FormGroup;

  isUpdate = false;
  selectedRow: BusinessUnit;
  dataSource: BusinessUnit[];
  displayedColumns: string[] = ['id', 'buName', 'activeYn'];

  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    private businessUnitService: BusinessUnitService,
    public router: Router,
    public globals: Globals
    ) {
      super(router, globals);
      api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' })
        .then(result => { this.statusList = result.data; });
     }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      buName: [''],
      activeYn: [null]
    });
    this.createForm = this.formBuilder.group({
      id: [null],
      buName: ['', [Validators.required, Validators.maxLength(100)]],
      activeYn: ['N'],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
    if (this.CAN_WRITE()) {
      this.displayedColumns = ['id', 'buName', 'activeYn', 'action'];
    } else {
      this.displayedColumns = ['id', 'buName', 'activeYn'];
    }
  }

  search() {
    this.selectedRow = null;
    const param = {
      ...this.searchForm.value
      //, buActive: this.searchForm.controls['activeYn'].value == 'Y' ? 1 : (this.searchForm.controls['activeYn'].value == 'N' ? 0 : null)
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.businessUnitService.getBusinessUnitList({
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

  create() {
    this.isUpdate = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  onDelete(row) {
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.businessUnitService.deleteBusinessUnit({
          data: row
        }).then(result => {
          if (result.status) {
            Utils.alertSuccess({
              text: 'Business Unit has been deleted.',
            });
            this.search();
          } else {
            Utils.alertError({
              text: 'Business Unit has not been deleted.',
            });
          }
        });
      }
    });
  }

  onSelectRow(row: BusinessUnit) {
    this.isUpdate = true;
    this.selectedRow = row;
    this.createForm.patchValue({
      ...this.selectedRow
      , activeYn: this.selectedRow.activeYn === 'Y' ? true : false
    });
  }

  onSave() {
    if (this.createForm.invalid) {
      return;
    }

    let response: Promise<ApiResponse<any>>;
    const param = {
      ...this.createForm.value
      , activeYn: this.createForm.controls['activeYn'].value === true ? 'Y' : 'N'
    };
    if (this.isUpdate) {
      response = this.businessUnitService.updateBusinessUnit({
        data: param
      });
    } else {
      response = this.businessUnitService.createBusinessUnit({
        data: param
      });
    }
    response.then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          text: 'Business Unit has been saved.',
        });
        this.search();
      } else {
        Utils.alertError({
          text: 'Business Unit has not been saved.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Business Unit has not been saved.',
      });
    });
  }

}
