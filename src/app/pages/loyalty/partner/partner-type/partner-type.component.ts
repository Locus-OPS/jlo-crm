import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { PartnerService } from '../partner.service';
import { TableControl } from 'src/app/shared/table-control';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

export interface PartnerTypeData {

  partnerId?: number;
  partnerNo?: string;
  partner?: string;
  partnerType?: string;
  partnerTypeId?: number;
  activeFlag?: string;

  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;

}
@Component({
  selector: 'app-partner-type',
  templateUrl: './partner-type.component.html',
  styleUrls: ['./partner-type.component.scss']
})
export class PartnerTypeComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: PartnerTypeData;
  dataSource: PartnerTypeData[];

  displayedColumns: string[] = ['partnerType', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  activeFlagList: Dropdown[];

  submitted = false;
  editable = false;
  created = false;

  constructor(
    public dialogRef: MatDialogRef<PartnerTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PartnerTypeData, // DialogData,
    private api: ApiService,
    private partnerService: PartnerService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getCodebookByCodeType({ data: 'ACTIVE_FLAG' }).then(result => { this.activeFlagList = result.data; });
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      partnerType: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      partnerType: [''],
      activeFlag: [''],
      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']

    });
    this.search();

    this.CHECK_FORM_PERMISSION(this.createForm);
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.search();
  }

  search() {
    const param = {
      ...this.searchForm.value
      , sortColumn: this.tableControl.sortColumn
      , sortDirection: this.tableControl.sortDirection
    };
    this.partnerService.getPartnerTypeList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: param
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
  }


  clearSort() {
    this.sort.sort({ id: '', start: 'asc', disableClear: false });
  }

  create() {
    this.created = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.createForm.patchValue(row);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onSave(e) {
    this.submitted = true;
    const param = {
      ...this.createForm.value
      , partnerTypeId: this.selectedRow.partnerTypeId
      , activeFlag: Utils.convertToYN(this.createForm.value['activeFlag'])
    };

    if (this.createForm.invalid) {
      return;
    }
    this.partnerService.savePartnerType({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
        Utils.showSuccess(this.created, 'Partner Type');
        this.search();
      } else {
        Utils.showError(result, null);
      }
    }, error => {
      Utils.showError(null, error);
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
  }


  onClose(): void {
    this.dialogRef.close();
  }

}
