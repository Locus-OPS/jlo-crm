import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreatedByComponent } from 'src/app/pages/common/created-by/created-by.component';
import { SharedModule } from 'src/app/shared/module/shared.module';

import { BaseComponent } from 'src/app/shared/base.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';
import { TabParam, TabManageService } from 'src/app/layouts/admin/tab-manage.service';
import Utils from 'src/app/shared/utils';

import { TableControl } from 'src/app/shared/table-control';
import { SchedulerHistoryLogData } from './scheduler-history-log.model';
import { SchedulerHistoryLogService } from './scheduler-history-log.service';

@Component({
  selector: 'app-scheduler-history-log',
  imports: [SharedModule],
  templateUrl: './scheduler-history-log.component.html',
  styleUrl: './scheduler-history-log.component.scss'
})
export class SchedulerHistoryLogComponent extends BaseComponent implements OnInit {

  historyLogForm: FormGroup;
  selectedRow: any;

  schedulerHistoryLogTableControl: TableControl = new TableControl(() => { this.searchSchedulerHistoryLog() });
  schedulerHistoryLog: SchedulerHistoryLogData[];
  schedulerHistoryLogColumn: string[] = ['executedDate', 'result', 'errorMessage'];

  constructor(
    public router: Router,
    public globals: Globals,
    private formBuilder: FormBuilder,
    public tabParam: TabParam,
    private schedulerHistoryLogService: SchedulerHistoryLogService,
    private tabManageService: TabManageService,
  ) {
    super(router, globals);
  }


  ngOnInit() {
    this.historyLogForm = this.formBuilder.group({
      schedulerName: new FormControl({ value: '', disabled: true }),
      expression: new FormControl({ value: '', disabled: true }),
    });

    if (this.tabParam.params['id'] != null) {
      this.schedulerHistoryLogService.getSchedulerById({ data: this.tabParam.params['id'] })
        .then(result => {
          this.historyLogForm.patchValue(result.data);
          this.tabManageService.changeTitle(<number>this.tabParam.index, 'menu.schedulerhistorylog', { name: result.data.schedulerName });
          this.searchSchedulerHistoryLog();
        }, error => {
          Utils.alertError({
            text: 'Please try again later.',
          });
          this.router.navigate(["/system/scheduler"]);
        });

    } else {
      this.router.navigate(["/system/scheduler"]);
    }

  }

  searchSchedulerHistoryLog() {
    this.schedulerHistoryLogService.getSchedulerHistoryLogById({
      pageSize: this.schedulerHistoryLogTableControl.pageSize,
      pageNo: this.schedulerHistoryLogTableControl.pageNo,
      data: { id: this.tabParam.params['id'], sortColumn: this.schedulerHistoryLogTableControl.sortColumn, sortDirection: this.schedulerHistoryLogTableControl.sortDirection }
    }).then(result => {
      this.schedulerHistoryLog = result.data;
      this.schedulerHistoryLogTableControl.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onExecute() {
    this.schedulerHistoryLogService.executeScheduler({ data: this.tabParam.params['id'] })
      .then(result => {
        this.searchSchedulerHistoryLog();
      }, error => {
        Utils.alertError({
          text: 'Please try again later.',
        });
        this.router.navigate(["/system/scheduler"]);
      });

  }

  onSelectRow(row: any) {
    this.selectedRow = row;
  }

}
