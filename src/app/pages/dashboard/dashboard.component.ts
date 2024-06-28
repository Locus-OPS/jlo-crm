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
import { CaseStore } from '../case/case.store';
import Utils from 'src/app/shared/utils';
import { CaseactivityService } from '../case/caseactivity/caseactivity.service';
import { DashboardService } from './dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSelectChange } from '@angular/material/select';
import { Case } from '../case/case.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  displayedColumnsAct: string[] = ['activityNumber', 'typeName', 'statusName', 'createdBy', 'updatedBy', 'action'];

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

  summaryCaseChannelData = [
    {
      "name": "Phone",
      "value": 16,
    },
    {
      "name": "Email",
      "value": 4,
    },
    {
      "name": "Web",
      "value": 8,
    },
    {
      "name": "Walk In",
      "value": 5,
    },
    {
      "name": "Line",
      "value": 1,
    },
    {
      "name": "Facebook",
      "value": 4,
    },
  ];

  summaryCaseTypeData = [
    {
      "name": "Incident",
      "value": 4,
    },
    {
      "name": "Service Request",
      "value": 20,
    },
  ];

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
    private caseStore: CaseStore,
    private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
  ) {
    super(router, globals);

    api.getMultipleCodebookByCodeType(
      { data: ['VIEW_BY'] }
    ).then(result => {
      this.ViewByList = result.data['VIEW_BY'];

    });

  }

  ngOnInit() {

    this.searchForm = this.formBuilder.group({
      viewBy: ["01"]
    });

    this.searchFormCase = this.formBuilder.group({
      viewBy: ["01"],
      statusCd: [""],
    });

    this.searchFormAct = this.formBuilder.group({
      caseNumber: [""]
    });


    this.selViewBy = "01";

    this.getCountCaseEachStatus();

    this.onSearchCase();

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
    this.searchFormCase.patchValue({ selViewBy: this.selViewBy });
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
  onSearchCase() {
    this.searchFormCase.patchValue({ selViewBy: this.selViewBy });
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
    this.caseStore.updateCaseDetail(e.caseNumber);
  }



  onSelectRow(row: Case) {
    this.selectedRow = row;

    this.onSearchAct(row);
  }


  onSearchAct(row?: any) {
    this.selectedRow = row;

    this.searchFormAct.patchValue({ caseNumber: this.selectedRow?.caseNumber });
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


}
