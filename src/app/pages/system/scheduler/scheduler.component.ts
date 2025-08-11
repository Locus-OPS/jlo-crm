import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { BaseComponent } from 'src/app/shared/base.component';
import { Dropdown } from 'src/app/model/dropdown.model';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SchedulerData } from './scheduler.model';
import { SchedulerService } from './scheduler.service';
import Utils from 'src/app/shared/utils';
@Component({
    selector: 'app-scheduler',
    imports: [SharedModule, CreatedByComponent],
    templateUrl: './scheduler.component.html',
    styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent extends BaseComponent implements OnInit {

  useYnList: Dropdown[];

  @ViewChild("firstFocus") firstFocus: ElementRef;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  searchForm: FormGroup;
  createForm: FormGroup;

  sortColumn: string;
  sortDirection: string;
  // tableControl: TableControl = new TableControl(() => { this.search(); });
  displayedColumns: string[] = ['schedulerName', 'expression', 'priority', 'runonInstance', 'useYn', 'active'];
  pageSize = 5;
  pageNo = 0;
  total = 0;
  isUpdated = false;
  submitted = false;
  dataSource: SchedulerData[];
  selectedRow: SchedulerData;

  constructor(
    public schedulerService: SchedulerService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'SCHEDULER_USE_FLAG' }).then(result => { this.useYnList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      schdulerUseYn: [''],
      schdulerName: [''],
    });

    this.createForm = this.formBuilder.group({
      id: [''],
      schedulerName: ['', Validators.required],
      classpath: ['', Validators.required],
      priority: ['', Validators.required],
      runonInstance: ['', Validators.required],
      expression: ['', Validators.required],
      runonContextRoot: ['', Validators.required],
      useYn: ['', Validators.required],
      schedulerType: ['Java'],
      seq: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: ['']
    });

    this.search();
  }

  search() {
    this.selectedRow = null;
    this.schedulerService.searchScheduler({
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.sortColumn, sortDirection: this.sortDirection }
      // data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.total = result.total;
      } else {
        Utils.alertError({
          text: 'Please try again later.',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSearch() {
    this.pageNo = 0;
    this.search();
  }

  onSelectRow(row) {
    this.isUpdated = true;
    this.submitted = true;
    this.selectedRow = row;
    this.createForm.patchValue(row);
  }

  sortData(e) {
    this.sortColumn = e.active;
    this.sortDirection = e.direction;
    this.search();
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }

  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  onPage(event) {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }

  create() {
    this.isUpdated = false;
    this.selectedRow = {};
    this.createForm.reset();
    this.createForm.patchValue({ schedulerType: 'Java' });
    this.submitted = false;

    setTimeout(() => {
      this.firstFocus.nativeElement.focus();
    }, 10);
  }

  onSave() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.schedulerService.saveScheduler({
      data: this.createForm.value
    }).then(result => {
      if (result.status) {
        // this.isUpdated = true;
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          title: 'Updated!',
          text: 'Scheduler has been updated.',
        });
      } else {
        let message = 'Please try again later.';
        if (result.message === 'DUPLICATE') {
          Utils.alertDuplicateError();
          return;
        }
        Utils.alertError({
          text: message,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  gotoSchedulerHistoryLog() {
    this.router.navigate(['/system/scheduler-log', { id: this.createForm.value.id }]);
  }

}
