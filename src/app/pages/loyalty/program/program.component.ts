import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { TableControl } from 'src/app/shared/table-control';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import Utils from 'src/app/shared/utils';
import { ProgramData } from './program-data';
import { ProgramService } from './program.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ProgramStore } from './program.store';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: ProgramData;
  dataSource: ProgramData[];
  displayedColumns: string[] = ['programCode', 'program', 'description', 'promotionCalculateRule', 'startDate', 'endDate', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  promotionCalculateRuleList: Dropdown[];
  activeFlagList: Dropdown[];

  programId: number;

  submitted = false;
  isShowMoreTab = false;
  isReadOnly = false;
  created = false;
  searched = false;
  deleted = false;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private formBuilder: FormBuilder,
    private programService: ProgramService,
    private programStore: ProgramStore,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['PROMOTION_CALCULATE_RULE', 'ACTIVE_FLAG']
    }).then(
      result => {
        this.promotionCalculateRuleList = result.data['PROMOTION_CALCULATE_RULE'];
        this.activeFlagList = result.data['ACTIVE_FLAG'];
      }
    );
  }

  ngOnInit() {
    if (this.CAN_WRITE()) {
      this.displayedColumns.push("action");
    }
    this.searchForm = this.formBuilder.group({
      programCode: [''],
      program: [''],
      activeFlag: [''],
      promotionCalculateRuleId: [''],
    });

    this.createForm = this.formBuilder.group({
      programId: [''],
      programCode: ['', Validators.required],
      program: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      activeFlag: [''],
      promotionCalculateRuleId: ['', Validators.required],
      description: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });
    this.tableControl.sortColumn = 'program';
    this.tableControl.sortDirection = 'asc';
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSearch() {
    this.submitted = true;
    this.searched = true;

    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.isShowMoreTab = false;

    this.programService.getProgramList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: {
        ...this.searchForm.value,
        sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection
      }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.tableControl.total = result.total;
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
    this.searched = false;

  }

  onDelete(element: ProgramData) {
    this.deleted = true;
    Utils.confirmDelete().then(confirm => {
      if (confirm.value) {
        this.programService.deleteProgram({
          data: {
            programId: element.programId
          }
        }).then(result => {
          if (result.status) {
            Utils.showSuccess(this.deleted, 'Program', this.deleted);
          } else {
            Utils.showError(result, null);
          }
          this.search();
        }, error => {
          console.log('error ==============================>', error);
          Utils.showError(null, error);
        });
      }
    });
  }

  clearSort() {
    // It works in a strange way. We need to check more about this.
    // this.sort.sort({ id: 'startDate', start: 'desc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  cancel() {
    if (this.selectedRow) {
      this.createForm.patchValue({
        ...this.selectedRow
      });
    } else {
      this.createForm.reset();
      if (this.createFormDirective) {
        this.createFormDirective.resetForm();
      }
    }
    this.created = false;
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.programId = this.selectedRow.programId;

    this.created = false;
    this.createForm.patchValue(row);
    Utils.setDatePicker(this.createForm);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');

    this.programStore.selectProgram(this.selectedRow);
  }

  onSave(e) {
    this.submitted = true;
    const param = {
      ...this.createForm.value
      , startDate: Utils.getDateString(this.createForm.value['startDate'])
      , endDate: Utils.getDateString(this.createForm.value['endDate'])
      , activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.programService.saveProgram({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        this.programId = result.data.programId;
        Utils.convertToBoolean(result.data, this.createForm, 'activeFlag');
        Utils.setDatePicker(this.createForm);
        Utils.showSuccess(this.created, 'Program');
        if (this.created) {
          this.search();
        }
        this.created = false;
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clear() {
    this.searchForm.reset();
    this.isShowMoreTab = false;
    //this.clearSort();
    //this.selectedRow = null;
  }

  onStartDateChange(e) {
    if (this.createForm.controls['endDate'].value < e.value) {
      this.createForm.patchValue({ endDate: e.value });
    }
  }

  onEndDateChange(e) {
    if (this.createForm.controls['startDate'].value > e.value) {
      this.createForm.patchValue({ startDate: e.value });
    }
  }

  showMoreTab() {
    this.isShowMoreTab = !this.isShowMoreTab;
  }

}
