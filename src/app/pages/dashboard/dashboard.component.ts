import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { BaseComponent } from 'src/app/shared/base.component';
import { Globals } from 'src/app/shared/globals';
import { ConsultingService } from '../consulting/consulting.service';
import { Dropdown } from 'src/app/model/dropdown.model';
import { TableControl } from 'src/app/shared/table-control';
import Utils from 'src/app/shared/utils';
import { CaseactivityService } from '../case/caseactivity/caseactivity.service';
import { DashboardService } from './dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelectChange } from '@angular/material/select';
import { Case } from '../case/case.model';
import { Caseactivity } from '../case/caseactivity/caseactivity.model';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [SharedModule, NgxChartsModule]
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

  searchForm: FormGroup;
  searchFormCase: FormGroup;
  dataSourceCase: any[];
  displayedColumnsCase: string[] = ['caseNumber', 'typeName', 'fullName', 'subTypeName', 'priorityName', 'action'];
  tableControlCase: TableControl = new TableControl(() => { this.searchCase(); });


  searchFormAct: FormGroup;
  tableControlAct: TableControl = new TableControl(() => { this.searchAct(); });
  dataSourceAct: any[];

  selectedRow: Case;

  selectedRowAct: Caseactivity;

  displayedColumnsAct: string[] = ['activityNumber', 'typeName', 'statusName', 'createdBy', 'updatedBy', 'action'];


  name = 'Angular';
  //view: any[];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;
  view: any[] = [530, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel: string = 'Number';
  showYAxisLabel = true;
  yAxisLabel: string = 'Channel';
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  viewPie: any[] = [530, 400];

  showLabels = true;
  colorSchemePie = {
    domain: ['#9370DB', '#C7B42C', '#A10A28', '#AAAAAA']
  };
  yAxisLabelPie: string = 'Case Type';

  isDoughnut: boolean = false;
  legendPosition: string = 'right';

  summaryCaseStatusData = [
    {
      "name": "New",
      "value": 5,
    },
    {
      "name": "Working",
      "value": 10,
    },
    {
      "name": "Escalated",
      "value": 3,
    },
    {
      "name": "Closed",
      "value": 18,
    },
  ];



  summaryCaseChannelData: any = [];
  //สรุปเคสตามประเภท
  summaryCaseTypeData: any = [];

  ViewByList: Dropdown[];

  countNew: number = 0;
  countWorking: number = 0;
  countEscalated: number = 0;
  countClosed: number = 0;

  selViewBy: any;


  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    public router: Router,
    public globals: Globals,
    public formBuilder: FormBuilder,
    private caseactivityService: CaseactivityService,
    private consulting: ConsultingService,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['VIEW_BY'] }
    ).then(result => {
      this.ViewByList = result.data['VIEW_BY'];

    });

    this.translate.get([
      'dashboard.channel', 'case.type', 'dashboard.number'
    ]).subscribe(translation => {
      this.yAxisLabel = translation['dashboard.channel'];
      this.yAxisLabelPie = translation['case.type'];
      this.xAxisLabel = translation['dashboard.number'];

    });
  }

  ngOnInit() {
    this.selViewBy = "01";
    this.searchForm = this.formBuilder.group({
      viewBy: [this.selViewBy]
    });

    this.searchFormCase = this.formBuilder.group({
      viewBy: [this.selViewBy],
      statusCd: [''],
    });

    this.searchFormAct = this.formBuilder.group({
      caseNumber: [""]
    });




    this.getCountCaseEachStatus();
    this.getChartBarDataList();
    this.getChartPieDataList();

    this.onSearchCase();




    // this.caseStore.getCaseDetail().subscribe(detail => {
    //   console.log("Dashboad caseDetailSubscription");
    //   console.log(detail);

    // });

  }

  ngAfterViewInit(): void {

  }

  /**
   *  01 My  > UserId
   *  02 Org >
   * @param evt
   */
  changeView(evt: MatSelectChange) {
    this.selViewBy = evt.value;
    this.searchFormCase.patchValue({ viewBy: this.selViewBy });


    this.getCountCaseEachStatus();
    this.getChartBarDataList();

    this.getChartPieDataList();

    this.onSearchCase();
  }

  getCountCaseEachStatus() {

    const params = { data: { viewBy: this.selViewBy } };

    this.dashboardService.getCountCaseEachStatus(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");
      if (result.status) {
        console.log(result.data);
        this.countNew = result.data.countNew;
        this.countWorking = result.data.countWorking;
        this.countEscalated = result.data.countEscalated;
        this.countClosed = result.data.countClosed;
      } else {

      }
    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });
    });

  }




  getChartBarDataList() {

    this.spinner.show("approve_process_spinner");
    const params = { data: { viewBy: this.selViewBy } };

    this.dashboardService.getChartBarDataList(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");
      if (result.status) {
        console.log(result.data);
        this.summaryCaseChannelData = result.data;

      } else {

      }
    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });
    });

  }


  getChartPieDataList() {

    this.spinner.show("approve_process_spinner");
    const params = { data: { viewBy: this.selViewBy } };

    this.dashboardService.getChartPieDataList(params).then((result: any) => {
      this.spinner.hide("approve_process_spinner");
      if (result.status) {
        this.summaryCaseTypeData = result.data;

      } else {

      }
    }, (err: any) => {
      Utils.alertError({
        text: err.message,
      });
    });

  }


  onSearchCase() {
    this.searchCase();
  }


  searchCase() {
    const param = {
      ...this.searchFormCase.getRawValue(),
      sortColumn: this.tableControlCase.sortColumn,
      sortDirection: this.tableControlCase.sortDirection,
    };

    this.dashboardService.getCaseDashboardList({
      pageSize: this.tableControlCase.pageSize,
      pageNo: this.tableControlCase.pageNo,
      data: param,
    })
      .then(
        (result) => {
          this.dataSourceCase = result.data;
          this.tableControlCase.total = result.total;
        },
        (error) => {
          Utils.alertError({
            text: error.message,
          });
        }
      );
  }

  onCaseEdit(e) {
    this.gotoCaseDetail(e);

  }

  gotoCaseDetail(element) {
    console.log(element.caseNumber)
    this.router.navigate([
      "/casedetails", { caseNumber: element.caseNumber }
    ]);
  }


  onSelectRow(row: Case) {
    this.selectedRow = row;

    this.onSearchAct(row);
  }


  onSelectRowAct(row: Case) {
    this.selectedRowAct = row;

  }


  onSearchAct(row?: any) {
    this.selectedRowAct = row;

    this.searchFormAct.patchValue({ caseNumber: this.selectedRowAct?.caseNumber });
    this.searchAct();
  }


  searchAct() {
    const param = {
      ...this.searchFormAct.value
      , sortColumn: this.tableControlAct.sortColumn
      , sortDirection: this.tableControlAct.sortDirection
    };

    this.caseactivityService.getCaseActivityListByCaseNumber({
      pageSize: this.tableControlAct.pageSize,
      pageNo: this.tableControlAct.pageNo,
      data: param
    }).then(result => {
      // console.log(result.data);
      this.dataSourceAct = result.data;
      this.tableControlAct.total = result.total;
    }, error => {
      Utils.alertError({
        text: 'Please try again later.',
      });
    });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
