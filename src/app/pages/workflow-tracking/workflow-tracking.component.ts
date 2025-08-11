import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { WorkflowTrackingService } from './workflow-tracking.service';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowModel } from '../workflow-mgmt/workflow-mgmt.model';
import { TableControl } from 'src/app/shared/table-control';
import { WorkflowMgmtService } from '../workflow-mgmt/workflow-mgmt.service';
import { WorkflowTrackingDetailComponent } from './workflow-tracking-detail/workflow-tracking-detail.component';


@Component({
    selector: 'app-workflow-tracking',
    imports: [SharedModule, WorkflowTrackingDetailComponent],
    templateUrl: './workflow-tracking.component.html',
    styleUrl: './workflow-tracking.component.scss'
})
export class WorkflowTrackingComponent extends BaseComponent implements OnInit {

  searchForm: FormGroup;
  detailForm: FormGroup;
  wfTrackingSearchForm: FormGroup;
  dataSource: WorkflowModel[];
  displayedColumns: string[] = ['workflowId', 'workflowName', 'description', 'status', 'action'];
  tableControl: TableControl = new TableControl(() => { this.search(); });

  displayedLogColumns: string[] = ['workflowId', 'transactionId', 'systemName', 'updatedDate', 'action'];
  wflogDataSource: any[];
  tableLogControl: TableControl = new TableControl(() => { this.searchWfLog(); });
  trackingId: any = null;
  wfTrackingLog: any = null;
  selectedRow: any;
  selectedRow1: any;
  constructor(
    public api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    private workflowTrackingService: WorkflowTrackingService,
    private workflowMgmtService: WorkflowMgmtService
  ) {
    super(router, globals);

  }

  ngOnInit(): void {
    this.initForm();
    this.onSearch();
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      workflowId: [""],
      workflowName: [""],
      description: [""],
      status: ["Active"]
    });

    this.detailForm = this.formBuilder.group({
      workflowId: [""],
      workflowName: [""],
      description: [""]
    });

    this.wfTrackingSearchForm = this.formBuilder.group({
      transactionId: [""],
      systemName: [""]
    });

  }

  onSearch() {
    this.tableControl.resetPage();
    this.search();
  }

  search() {
    const param = this.searchForm.getRawValue();
    this.workflowMgmtService.getWorkflowPageList({ data: param, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.dataSource = res.data;
        this.tableControl.total = res.total;
      }
    });
  }

  onSelectedRow(element) {
    this.detailForm.patchValue(element);
    this.onSearchWflog();
  }

  onSearchWflog() {
    this.tableLogControl.resetPage();
    this.searchWfLog();
  }

  searchWfLog() {
    let param = this.detailForm.getRawValue();
    param = { ...param, transactionId: this.wfTrackingSearchForm.get('transactionId').value, systemName: this.wfTrackingSearchForm.get('systemName').value };
    this.workflowTrackingService.getWfTrackingByWorkflowId({ data: param, pageNo: this.tableLogControl.pageNo, pageSize: this.tableLogControl.pageSize }).then((res) => {
      if (res.status) {
        this.wflogDataSource = res.data;
        this.tableLogControl.total = res.total;
      }
    });
  }

  onWfTrackingSelectRow(element) {
    this.trackingId = element.trackingId;
    this.wfTrackingLog = element;
    this.selectedRow1 = element;
  }

  onRowClick(row) {
    this.selectedRow = row;
    this.onSelectedRow(row);
  }

}
