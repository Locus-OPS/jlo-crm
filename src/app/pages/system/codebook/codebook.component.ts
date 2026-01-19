import { Component, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { Dropdown } from 'src/app/model/dropdown.model';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { CodebookService } from './codebook.service';
import Utils from 'src/app/shared/utils';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { CodebookData } from './codebook.model';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CreatedByComponent } from '../../common/created-by/created-by.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-codebook',
    templateUrl: './codebook.component.html',
    styleUrls: ['./codebook.component.scss'],
    imports: [SharedModule, CreatedByComponent]
})
export class CodebookComponent extends BaseComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  statusList: Dropdown[];
  businessUnitList: Dropdown[];
  codeTypeList: Dropdown[];

  searchForm: UntypedFormGroup;
  createForm: UntypedFormGroup;

  sortColumn: string;
  sortDirection: string;
  displayedColumns: string[] = ['codeType', 'codeId', 'codeName', 'parentType', 'parentId', 'activeFlag'];
  pageSize = 5;
  pageNo = 0;
  total = 0;
  isUpdated = false;
  submitted = false;
  dataSource: CodebookData[];
  selectedRow: CodebookData;

  codeTypeFilter: Dropdown[];

  constructor(
    public codebookService: CodebookService,
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.statusList = result.data; });
    api.getBusinessUnit().then(result => { this.businessUnitList = result.data; });
    api.getCodebookType().then(result => { this.codeTypeList = result.data; this.codeTypeFilter = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      inputFilter: [''],
      codeId: [''],
      codeType: [''],
      codeName: [''],
      buId: [''],
      activeFlag: ['']
    });
    this.createForm = this.formBuilder.group({
      codeId: ['', Validators.required],
      codeType: ['', Validators.required],
      codeName: ['', Validators.required],
      parentType: [''],
      parentId: [''],
      description: [''],
      seq: [''],
      etc1: [''],
      etc2: [''],
      etc3: [''],
      etc4: [''],
      etc5: [''],
      buId: ['', Validators.required],
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



    this.searchForm.get("inputFilter").valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.codeTypeFilter = this.codeTypeList.filter(vl => vl.codeName.toUpperCase().indexOf(this.searchForm.get("inputFilter").value.toUpperCase()) >= 0);
      });
  }

  search() {
    this.selectedRow = null;
    this.codebookService.searchCodebook({
      pageSize: this.pageSize,
      pageNo: this.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.sortColumn, sortDirection: this.sortDirection }
    }).then(result => {
      if (result.status) {
        this.dataSource = result.data;
        this.total = result.total;
      } else {
        Utils.alertError({
          text: 'กรุณาลองใหม่ภายหลัง',
        });
      }
    }, error => {
      Utils.alertError({
        text: 'กรุณาลองใหม่ภายหลัง',
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
    this.codebookService.saveCodebook({
      data: this.createForm.value
    }).then(result => {
      if (result.status) {
        this.isUpdated = true;
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.alertSuccess({
          title: 'อัปเดตสำเร็จ!',
          text: 'อัปเดตข้อมูลสำเร็จ',
        });
      } else {
        let message = 'กรุณาลองใหม่ภายหลัง';
        if (result.message === 'DUPLICATE') {
          message = 'ข้อมูลซ้ำ กรุณาตรวจสอบ';
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

  getBuName(buId: number): string {
    const dropdown: Dropdown = this.businessUnitList.find((item) => Number(item.codeId) === buId);
    if (dropdown) {
      return dropdown.codeName;
    } else {
      return '';
    }
  }
}
