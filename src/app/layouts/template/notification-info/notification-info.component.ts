import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dropdown } from 'src/app/model/dropdown.model';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { Globals } from 'src/app/shared/globals';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { interval, Subscription } from 'rxjs';
import { NotificationInfoService } from './notification-info.service';
@Component({
  selector: 'app-notification-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './notification-info.component.html',
  styleUrl: './notification-info.component.scss'
})
export class NotificationInfoComponent implements OnInit, OnDestroy {

  consultingForm: FormGroup;
  hiddenNoti = false;
  countNew: number = 0;
  systemConfigList: Dropdown[];
  systemConfigTempList: Dropdown[];
  systemConfigFilter: Dropdown;
  intervalSouce: number = 10000;
  selViewBy: any;
  subscription: Subscription;
  intervalId: number;

  countWorking: number = 0;
  countEscalated: number = 0;
  countClosed: number = 0;

  caseNotificationList: any[] = [];
  activityNotificationList: any[] = [];
  private navTitleSubscription: Subscription;

  constructor(
    private element: ElementRef,
    private router: Router,
    private translate: TranslateService,
    private globals: Globals,
    public api: ApiService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private notificationService: NotificationInfoService
  ) {
    this.getNotificationList();
  }
  ngOnDestroy() {
    this.navTitleSubscription.unsubscribe();

    // For method 1
    this.subscription && this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.selViewBy = "01";

    this.api.getMultipleCodebookByCodeType(
      { data: ['SYS_CONFIG'] }
    ).then(result => {
      this.systemConfigList = result.data['SYS_CONFIG'];
      this.systemConfigList = this.systemConfigList.filter(vl => vl.codeId == '01');

      if (this.systemConfigList.length > 0) {
        this.systemConfigFilter = this.systemConfigList[0];
        this.intervalSouce = Number(this.systemConfigFilter.etc1);
        console.log("1intervalSouce : " + this.intervalSouce);
      } else {
        this.intervalSouce = this.intervalSouce;
      }

      const source = interval(this.intervalSouce);
      const text = 'get count case number every ' + this.intervalSouce + ' milliseconds ';
      this.getCountCaseEachStatus(text);
      // This is get count case number

      // this.subscription = source.subscribe((val) => this.getCountCaseEachStatus(text));
      this.subscription = source.subscribe((val) => this.getNotificationList());

    });


  }


  toggleBadgeVisibility() {
    this.hiddenNoti = !this.hiddenNoti;
  }

  getCountCaseEachStatus(text) {
    console.log("getCountCaseEachStatus : " + text)
    const params = { data: { viewBy: this.selViewBy } };

    this.dashboardService.getCountCaseEachStatus(params).then((result: any) => {
      //this.spinner.hide("approve_process_spinner");
      if (result.status) {
        console.log(result.data);
        //this.countNew = result.data.countNew;
        this.countWorking = result.data.countWorking;
        this.countEscalated = result.data.countEscalated;
        this.countClosed = result.data.countClosed;
      } else {

      }
    }, (err: any) => {
      console.log(err.message);
    });

  }

  getNotificationList() {
    this.notificationService.getCaseNotiList({ data: { userId: this.globals.profile.userId } }).then((res) => {
      if (res.status) {
        this.caseNotificationList = res.data.caseNotilogList;
        this.activityNotificationList = res.data.caseActNotilogList;
        this.countNew = res.data.total;
        this.countNew = res.data.total;
      }
    });
  }

  onSelectNotification(element: any) {
    this.updateReadStatus(element);
  }

  updateReadStatus(element: any) {
    this.notificationService.updateReadStatus({ data: element }).then((res) => {
      if (res.status) {
        this.getNotificationList();
        this.router.navigate([
          "/casedetails", { caseNumber: element.caseNumber }
        ]);
      } else {
        alert('Error');
      }
    });
  }


}
