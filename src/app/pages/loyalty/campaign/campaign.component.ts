import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import Utils from 'src/app/shared/utils';
import { Dropdown } from 'src/app/model/dropdown.model';
import { CampaignService } from './campaign.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TableControl } from 'src/app/shared/table-control';
import { CampaignData } from './campaign.model';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent extends BaseComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('createFormDirective')
  createFormDirective: FormGroupDirective;

  tableControl: TableControl = new TableControl(() => { this.search(); });

  selectedRow: CampaignData;
  dataSource: CampaignData[];
  displayedColumns: string[] = ['campaignCode', 'campaign', 'startDate', 'endDate', 'campaignType', 'activeFlag'];

  searchForm: FormGroup;
  createForm: FormGroup;

  campaignTypeList: Dropdown[];
  activeFlagList: Dropdown[];
  submitted = false;
  editable = false;
  created = false;

  constructor(
    public api: ApiService,
    private campaignService: CampaignService,
    private formBuilder: FormBuilder,
    public router: Router,
    public globals: Globals
  ) {
    super(router, globals);
    api.getMultipleCodebookByCodeType({
      data: ['CAMPAIGN_TYPE', 'ACTIVE_FLAG']
    }).then(
      result => {
        this.campaignTypeList = result.data['CAMPAIGN_TYPE'];
        this.activeFlagList = result.data['ACTIVE_FLAG'];
      }
    );
  }

  get f() { return this.searchForm.controls; }
  get c() { return this.createForm.controls; }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      campaign: [''],
      campaignCode: [''],
      campaignTypeId: [''],
      activeFlag: ['']
    });

    this.createForm = this.formBuilder.group({
      campaignId: [''],
      campaignCode: ['', Validators.required],
      campaign: ['', Validators.required],
      campaignTypeId: ['', Validators.required],
      activeFlag: [''],
      detail: [''],

      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      createdBy: [''],
      createdDate: [''],
      updatedBy: [''],
      updatedDate: ['']
    });

    this.CHECK_FORM_PERMISSION(this.createForm);

    this.search();
  }

  onSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    this.selectedRow = null;
    this.campaignService.getCampaignList({
      pageSize: this.tableControl.pageSize,
      pageNo: this.tableControl.pageNo,
      data: { ...this.searchForm.value, sortColumn: this.tableControl.sortColumn, sortDirection: this.tableControl.sortDirection }
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

  create() {
    this.created = true;
    this.editable = true;
    this.submitted = false;
    this.selectedRow = {};
    this.createForm.reset();
    if (this.createFormDirective) {
      this.createFormDirective.resetForm();
    }
  }

  onSelectRow(row) {
    this.selectedRow = row;
    this.created = false;
    this.createForm.patchValue(row);
    Utils.setDatePicker(this.createForm);
    Utils.convertToBoolean(this.selectedRow, this.createForm, 'activeFlag');
  }

  onSave(e) {
    this.submitted = true;
    const msgTitle = this.created ? 'Created!' : 'Updated!';
    const msgText = this.created ? 'Campaign has been created.!' : 'Campaign has been updated.';
    const param = {
      ...this.createForm.value
      , startDate: Utils.getDateString(this.createForm.value['startDate'])
      , endDate: Utils.getDateString(this.createForm.value['endDate'])
      , activeFlag: this.createForm.value['activeFlag'] === true ? 'Y' : 'N'
    };

    if (this.createForm.invalid) {
      return;
    }
    this.campaignService.saveCampaign({
      data: param
    }).then(result => {
      if (result.status) {
        Utils.assign(this.selectedRow, result.data);
        this.createForm.patchValue(result.data);
        Utils.setDatePicker(this.createForm);
        Utils.alertSuccess({
          title: msgTitle,
          text: msgText,
        });
      }
    }, error => {
      Utils.alertError({
        text: 'Please, try again later',
      });
    });
  }

  clear() {
    this.searchForm.reset();
    this.clearSort();
    this.selectedRow = null;
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

}
