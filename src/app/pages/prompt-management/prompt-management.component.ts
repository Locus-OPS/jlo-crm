import { Component, OnInit, ViewChild } from '@angular/core';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { PromptManagementService } from './prompt-management.service';
import Utils from 'src/app/shared/utils';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { Subject, takeUntil } from 'rxjs';
import { CreatedByComponent } from '../common/created-by/created-by.component';
import { CodebookData } from '../system/codebook/codebook.model';

@Component({
  selector: 'app-prompt-management',
  templateUrl: './prompt-management.component.html',
  styleUrls: ['./prompt-management.component.scss'],
  standalone: true,
  imports: [SharedModule, CreatedByComponent]
})
export class PromptManagementComponent extends BaseComponent implements OnInit {

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  statusList: Dropdown[];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  sortColumn: string;
  sortDirection: string;
  displayedColumns: string[] = ['codeId', 'codeName', 'activeFlag'];
  pageSize = 5;
  pageNo = 0;
  total = 0;
  isUpdated = false;
  submitted = false;
  dataSource: CodebookData[];
  selectedRow: CodebookData;

  constructor(
    public promptManagementService: PromptManagementService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.statusList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      codeId: [''],
      codeName: [''],
      activeFlag: ['']
    });
    this.createForm = this.formBuilder.group({
      codeId: ['', Validators.required],
      codeName: ['', Validators.required],
      description: ['', Validators.required],
      seq: [''],
      activeFlag: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: [''],
      createdByName: [''],
      updatedByName: ['']
    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  search() {
    this.selectedRow = null;
    this.promptManagementService.searchPrompt({
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.sortColumn, sortDirection: this.sortDirection }
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

  onSelectRow(row: CodebookData) {
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
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.promptManagementService.savePrompt({
      data: this.createForm.value
    }).then(async result => {
      if (result.status) {
        this.isUpdated = true;
        Utils.alertSuccess({
          text: 'Prompt has been saved.',
        });
        await this.onSearch();
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
      } else {
        let message = 'Please try again later.';
        if (result.message === 'DUPLICATE') {
          message = 'Duplicate Data, Please check.';
        }
        Utils.alertError({
          text: message,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    });
  }

}
