import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Globals } from 'src/app/shared/globals';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { WorkflowTrackingService } from '../workflow-tracking.service';
import { WorkflowMgmtService } from '../../workflow-mgmt/workflow-mgmt.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { TableControl } from 'src/app/shared/table-control';

@Component({
  selector: 'app-workflow-tracking-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workflow-tracking-detail.component.html',
  styleUrl: './workflow-tracking-detail.component.scss'
})
export class WorkflowTrackingDetailComponent extends BaseComponent implements OnInit {

  @Input() trackingId: string = '';
  dataSource: any[];
  displayedColumns: string[] = ['taskId', 'eventType', 'status', 'link'];
  tableControl: TableControl = new TableControl(() => { this.getWfTrackingDetail(); });
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
    this.onSearch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trackingId']) {
      if (this.trackingId != "") {
        this.onSearch();
      }
    }
  }

  onSearch() {
    this.tableControl.resetPage();
    this.getWfTrackingDetail();
  }

  getWfTrackingDetail() {
    this.workflowTrackingService.getWfTrackingById({ data: { trackingId: this.trackingId }, pageNo: this.tableControl.pageNo, pageSize: this.tableControl.pageSize }).then((res) => {
      if (res.status) {
        this.dataSource = res.data;
      }
    });
  }

  onSelectRow(row) {

  }
}
